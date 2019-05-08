"""
API interface for Innometrics backend
"""
import datetime
import json
from http import HTTPStatus
from typing import Optional

import bcrypt
import flask
import jwt
from Crypto import Random
from apispec.ext.flask import FlaskPlugin
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask, make_response, jsonify
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from apispec import APISpec
from gevent.pywsgi import *

from api.activity import add_activity, delete_activity, find_activities
from api.constants import *
from api.project import create_new_project, invite_user, accept_invitation, get_project_activities
from config import config
from db.models import User
from logger import logger
from utils import execute_function_in_parallel

from Crypto.PublicKey import RSA
from Crypto.Cipher import AES
from Crypto import Random
from Crypto.Cipher import PKCS1_OAEP
import struct
import Crypto.IO.PKCS8 as PKCS8
import base64

app = Flask(__name__)
CORS(app, supports_credentials=True)  # , origins=['https://innometrics.guru'])

flask_config = config['FLASK']
app.secret_key = flask_config['SECRET_KEY']

login_manager = LoginManager()
login_manager.init_app(app)

spec = APISpec(
    title='Innometrics backend API',
    version='1.0.0',
    plugins=(
        FlaskPlugin(),
        MarshmallowPlugin(),
    ),
    consumes=['multipart/form-data', 'application/x-www-form-urlencoded']
)


@login_manager.user_loader
def load_user(user_id) -> Optional[User]:
    """
    Load a user from DB
    :param user_id: an id of the user
    :return: User instance or None if not found
    """
    return User.objects(id=user_id).first()


def encode_auth_token(user_id) -> Optional[bytes]:
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            flask_config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        logger.exception(f'Failed to encode token. Error {e}')
        return None


def decode_auth_token(auth_token) -> Optional[str]:
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, flask_config.get('SECRET_KEY'))
        return payload['sub']
    except jwt.ExpiredSignatureError:
        #  Signature expired. Please log in again.
        return None
    except jwt.InvalidTokenError:
        #  Invalid token. Please log in again.
        return None


@login_manager.request_loader
def load_user_from_request(request) -> Optional[User]:
    token = request.headers.get('Authorization', default='').replace('Token ', '')
    if not token:
        return None

    user_id = decode_auth_token(token)

    if user_id:
        return load_user(user_id)
    else:
        return None


def _hash_password(password: str) -> str:
    """
    Hash a password
    :param password: a password
    :return: hashed password
    """

    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())


def _check_password(plain_pass: str, encoded_pass: str) -> bool:
    """
    Check if two passwords are the same
    :param plain_pass: a first unhashed password
    :param encoded_pass: a hashed password to check with
    :return: True if they are same, False otherwise
    """

    return bcrypt.checkpw(plain_pass.encode(), encoded_pass.encode())


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Login a user
    ---
    get:
        summary: Login endpoint.
        description: Login a user with email.
        parameters:
            -   in: formData
                name: email
                description: an email of the user
                required: true
                type: string
            -   in: formData
                name: password
                required: true
                description: a password of the user
                type: string
        responses:
            400:
                description: Parameters are not correct
            404:
                description: User was not found
            401:
                description: Credentials provided are incorrect
            200:
                description: User was logged in
    """
    try:
        data = flask.request.json if flask.request.json else flask.request.form
        email: str = data.get(EMAIL_KEY)
        password: str = data.get(PASSWORD_KEY)

        if not (email and password):
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        existing_user = User.objects(email=email.lower()).first()
        existing_user = existing_user if existing_user else User.objects(email=email).first()
        if not existing_user:
            return make_response(jsonify({MESSAGE_KEY: 'User not found'}), HTTPStatus.NOT_FOUND)
        if _check_password(password, existing_user.password):
            login_user(existing_user)

            response = make_response(
                jsonify({MESSAGE_KEY: 'Success!',
                         TOKEN_KEY: encode_auth_token(str(existing_user.id)).decode(),
                         PUBLIC_KEY: existing_user.public_key,
                         PRIVATE_KEY_H: existing_user.private_key_h
                         }),
                HTTPStatus.OK)
            response.set_cookie(PUBLIC_KEY, existing_user.public_key)
            response.set_cookie(PRIVATE_KEY_H, existing_user.private_key_h)
            return response
        return make_response(jsonify({MESSAGE_KEY: 'Failed to authenticate'}), HTTPStatus.UNAUTHORIZED)
    except Exception as e:
        logger.exception(f'Failed to login user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


# @app.route('/DEBUG_gen', methods=['GET'])
# def DEBUG_GENERATE_SAMPLE():
#     from Crypto.Protocol.KDF import PBKDF2
#     from Crypto.Util.Padding import pad
#     try:
#         public_key = RSA.import_key(extern_key=base64.b64decode(current_user.public_key.encode('utf-8')).decode('utf-8'))
#
#         enc_key = Random.new().read(32)
#
#         enc_key = b'ENC_KEY_ENC_KEY_ENC_KEY_ENC_KEY_ENC_KEY_ENC_KEY_ENC_KEY_ENC_KEY'[:32]
#
#         cipher = PKCS1_OAEP.new(public_key)
#
#         enc_key_h = cipher.encrypt(enc_key)
#
#         iv = Random.new().read(AES.block_size)
#
#         cipher = AES.new(enc_key, AES.MODE_CBC, iv)
#
#         str_plain = "Яндекс Браузер!!!".encode('utf-8')
#
#         str_plain = pad(str_plain, AES.block_size)
#
#         ex_n = cipher.encrypt(str_plain)
#
#         activity_data = {
#             START_TIME_KEY: str(int(datetime.datetime.now().strftime("%s")) - 10),
#             END_TIME_KEY: str(int(datetime.datetime.now().strftime("%s"))),
#             EXECUTABLE_KEY: ex_n.hex(),  # base64.b64encode(ex_n),  # (iv + ex_n).hex(),
#             ENC_KEY_H: enc_key_h.hex(),  # base64.b64encode(enc_key_h),  # enc_key_h.hex(),
#             INIT_VECTOR_KEY: iv.hex()  # base64.b64encode(iv)  #
#         }
#
#         print("AAAAAAAA", enc_key_h.hex())
#
#         result = add_activity(activity_data, current_user.to_dbref())
#
#         # pass_h = PBKDF2(password='123', salt=b'ala@ala.com', count=25, dkLen=128)
#         #
#         # print(pass_h.hex())
#         #
#         # private_key = RSA.importKey(extern_key=current_user.private_key_h, passphrase=pass_h.hex())
#         #
#         # print(private_key.export_key())
#         #
#         # decipher = PKCS1_OAEP.new(private_key)
#         #
#         # enc_key_decrypted = decipher.decrypt(enc_key_h)
#         # print(enc_key_decrypted)
#
#         if not result:
#             return make_response(jsonify({MESSAGE_KEY: 'Failed to create activity'}),
#                                  HTTPStatus.INTERNAL_SERVER_ERROR)
#
#         return make_response(jsonify({MESSAGE_KEY: 'OK'}), HTTPStatus.OK)
#     except Exception as e:
#         logger.exception(f'Failed to login user. Error {e}')
#         return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/user', methods=['POST'])
def user_register():
    """
    Register a user
    ---
    post:
        summary: User registration endpoint.
        description: Register a new user.
        parameters:
            -   in: formData
                name: email
                description: an email of the user
                required: true
                type: string
            -   in: formData
                name: name
                description: a name of the user
                required: true
                type: string
            -   in: formData
                name: surname
                description: a surname of the user
                required: true
                type: string
            -   in: formData
                name: password
                required: true
                description: a password of the user
                type: string
        responses:
            400:
                description: Parameters are not correct
            409:
                description: User with the email already exists
            200:
                description: User was logged registered
    """
    try:
        data = flask.request.json if flask.request.json else flask.request.form
        email: str = data.get(EMAIL_KEY)
        password: str = data.get(PASSWORD_KEY)
        name: str = data.get(NAME_KEY)
        surname: str = data.get(SURNAME_KEY)

        if not (email and password and name and surname):
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        existing_user = User.objects(email=email).first()
        existing_user = existing_user if existing_user else User.objects(email=email.lower()).first()
        email = email.lower()
        if existing_user:
            return make_response(jsonify({MESSAGE_KEY: 'User already exists'}), HTTPStatus.CONFLICT)

        user = User(email=email, password=_hash_password(password), name=name, surname=surname)

        key = RSA.generate(RSA_MODULO, Random.new().read)
        private_key, public_key = key, key.publickey()
        private_key_h = private_key.export_key(format="PEM", pkcs=8, passphrase=password)

        user.public_key = base64.b64encode(public_key.export_key()).decode('utf-8')
        user.private_key_h = private_key_h.decode("utf-8")

        if not user:
            return make_response(jsonify({MESSAGE_KEY: 'Failed to create user'}), HTTPStatus.INTERNAL_SERVER_ERROR)

        user.save()
        return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)
    except Exception as e:
        logger.exception(f'Failed to register user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/user/new_password', methods=['POST'])
@login_required
def new_password():
    """
    Change user's password
    ---
    post:
        summary: Password changing endpoint.
        description: Change user's password.
        parameters:
            -   in: formData
                name: old_password
                description: old user's password
                required: true
                type: string
            -   in: formData
                name: new_password
                description: a new password
                required: true
                type: string
        responses:
            400:
                description: Parameters are not correct
            401:
                description: Wrong current password
            406:
                description: New password is the same as an old one
            200:
                description: The password has been changed
    """
    try:
        data = flask.request.json if flask.request.json else flask.request.form
        old_password: str = data.get(OLD_PASSWORD_KEY)
        new_password: str = data.get(NEW_PASSWORD_KEY)

        if not (old_password and new_password):
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        if not _check_password(old_password, current_user.password):
            return make_response(jsonify({MESSAGE_KEY: 'Wrong current password'}), HTTPStatus.UNAUTHORIZED)

        if old_password == new_password:
            return make_response(jsonify({MESSAGE_KEY: 'New password is the same as an old one'}),
                                 HTTPStatus.NOT_ACCEPTABLE)

        try:
            private_key = RSA.importKey(extern_key=current_user.private_key_h, passphrase=old_password)
        except Exception as e:
            logger.exception(f'Failed to change password. Error {e}')
            return make_response(jsonify({MESSAGE_KEY: 'Provided password failed to decrypt user data'}),
                                 HTTPStatus.UNAUTHORIZED)

        private_key_h = private_key.export_key(format="PEM", pkcs=8, passphrase=new_password)
        current_user.private_key_h = private_key_h.decode("utf-8")
        current_user.password = str(_hash_password(new_password))[2:-1]
        print(current_user.password)
        current_user.save()

        response = make_response(
            jsonify({MESSAGE_KEY: 'Success!',
                     PRIVATE_KEY_H: current_user.private_key_h
                     }),
            HTTPStatus.OK)
        response.set_cookie(PRIVATE_KEY_H, current_user.private_key_h)
        return response
    except Exception as e:
        logger.exception(f'Failed to change password. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/project', methods=['POST'])
@login_required
def new_project():
    """
    Create a new project
    ---
    post:
        summary: Project creation endpoint.
        description: Create a new project with user issuing request being a manager.
        parameters:
            -   in: formData
                name: name
                description: a name of the project
                required: true
                type: string
        responses:
            400:
                description: Parameters are not correct
            201:
                description: Project was created
    """
    try:
        data = flask.request.json if flask.request.json else flask.request.form
        name: str = data.get(NAME_KEY)

        if not name:
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        project = create_new_project(name, current_user.to_dbref())
        if not project:
            return make_response(jsonify({MESSAGE_KEY: 'Failed to create project'}), HTTPStatus.INTERNAL_SERVER_ERROR)

        return make_response(jsonify({MESSAGE_KEY: 'Success', PROJECT_KEY: project}), HTTPStatus.CREATED)
    except Exception as e:
        logger.exception(f'Failed to register user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/project/<string:project_id>/invite', methods=['POST'])
@login_required
def invite(project_id: str):
    """
    Invite a user to the project
    ---
    post:
        summary: Project invitation endpoint.
        description: Invite a user or add a manager to the project.
        parameters:
            -   in: formData
                name: user_email
                description: a email of user to be invited
                required: true
                type: string
            -   in: formData
                name: manager
                description: True if adding a manager role
                required: false
                type: boolean
        responses:
            400:
                description: Parameters are not correct
            200:
                description: User was invited
    """
    try:
        data = flask.request.json if flask.request.json else flask.request.form
        user_email: str = data.get(USER_EMAIL_KEY)
        manager: bool = True if data.get(MANAGER_KEY, 'False') == 'True' else False

        if not (project_id and user_email):
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        result = invite_user(project_id=project_id, user_email=user_email, invitor=current_user.to_dbref(),
                             manager=manager)
        if not result:
            return make_response(jsonify({MESSAGE_KEY: 'Failed to send the invitation'}),
                                 HTTPStatus.INTERNAL_SERVER_ERROR)

        return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)
    except Exception as e:
        logger.exception(f'Failed to register user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/project/<string:project_id>/accept_invitation', methods=['POST'])
@login_required
def accept_invitation_endpoint(project_id: str):
    """
    Accept invitation to the project
    ---
    post:
        summary: Project invitation endpoint.
        description: Accept an invitation to the project.
        responses:
            400:
                description: Parameters are not correct
            200:
                description: User was added to the project
    """
    try:
        if not project_id:
            return make_response(jsonify({MESSAGE_KEY: 'Not enough data provided'}), HTTPStatus.BAD_REQUEST)

        result = accept_invitation(project_id=project_id, user=current_user.to_dbref())
        if not result:
            return make_response(jsonify({MESSAGE_KEY: 'Failed to accept'}), HTTPStatus.INTERNAL_SERVER_ERROR)

        return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)
    except Exception as e:
        logger.exception(f'Failed to register user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Something bad happened'}), HTTPStatus.INTERNAL_SERVER_ERROR)


@app.route('/project/<string:project_id>/activity', methods=['GET'])
@login_required
def project_activities(project_id: str):
    """
    Find project activities
    ---
    get:
        summary: Find activities.
        description: Find activities in specified project.
        parameters:
            -   name: offset
                in: args
                required: true
                type: integer
                description: a number of activities to skip
            -   name: amount_to_return
                in: args
                required: true
                type: integer
                description: amount of activities to return, max is 1000
            -   name: filters
                in: args
                required: false
                type: object
                description: filters for activity, example {"activity_type"&#58; "os"}
            -   name: start_time
                in: args
                required: false
                type: string
                description: minimum start time of an activity
            -   name: end_time
                in: args
                required: false
                type: string
                description: maximum end time of an activity
        responses:
            404:
                description: Activities were not found
            400:
                description: Wrong format
            200:
                description: A list of activities was returned
    """
    data = flask.request.args
    offset: int = int(data.get(OFFSET_KEY, 0))
    amount_to_return: int = min(int(data.get(AMOUNT_TO_RETURN_KEY, 100)), 1000)
    filters = data.get(FILTERS_KEY, {})
    start_time = data.get(START_TIME_KEY, None)
    end_time = data.get(END_TIME_KEY, None)

    if not isinstance(filters, dict):
        try:
            filters = json.loads(filters)
        except Exception:
            return make_response(jsonify({MESSAGE_KEY: 'Wrong format'}), HTTPStatus.BAD_REQUEST)

    activities = get_project_activities(project_id=project_id,
                                        user=current_user.to_dbref(), offset=offset, items_to_return=amount_to_return,
                                        filters=filters, start_time=start_time, end_time=end_time)
    if activities is None:
        return make_response(jsonify({MESSAGE_KEY: 'Failed to fetch activities'}),
                             HTTPStatus.INTERNAL_SERVER_ERROR)
    if activities == -1:
        return make_response(jsonify({MESSAGE_KEY: 'Wrong format for filters'}),
                             HTTPStatus.BAD_REQUEST)

    if not activities:
        return make_response(jsonify({MESSAGE_KEY: 'Activities of current user were not found'}),
                             HTTPStatus.NOT_FOUND)
    activities_list = [{k: str(v) for k, v in activity.to_mongo().items()} for activity in activities]

    return make_response(jsonify({MESSAGE_KEY: 'Success', ACTIVITIES_KEY: activities_list}), HTTPStatus.OK)


@app.route('/user', methods=['DELETE'])
@login_required
def user_delete():
    """
    Delete a user
    ---
    delete:
        summary: User deletion endpoint.
        description: Delete a user from DB.
        responses:
            200:
                description: User was deleted
    """
    try:
        current_user.delete()
    except Exception as e:
        logger.exception(f'Failed to delete user. Error {e}')
        return make_response(jsonify({MESSAGE_KEY: 'Failed to delete user'}), HTTPStatus.INTERNAL_SERVER_ERROR)

    return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)


@app.route("/logout", methods=['POST'])
@login_required
def logout():
    """
    Logout a user
    ---
    post:
        summary: User logout endpoint.
        description: Logout a user.
        responses:
            200:
                description: User was logged out
    """
    try:
        logout_user()
    except Exception as e:
        logger.exception(f'Failed to log out user. Error {e}')
    return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)


@app.route('/activity', methods=['POST'])
@login_required
def activity_add():
    """
    Add an activity
    ---
    post:
        summary: Add an activity.
        description: Add an activity or multiple activities to the current user.
        parameters:
            -   name: activity
                in: formData
                required: true
                description: json containing all specified parameters
                type: string
            -   name: activities
                in: formData
                required: false
                description: List containing activity_data
                type: array
                items:
                    type: string
            -   name: start_time
                in: formData
                required: true
                type: string
                description: a start time of the activity
            -   name: end_time
                in: formData
                required: true
                type: string
                description: an end time of the activity
            -   name: executable_name
                in: formData
                required: true
                type: string
                description: a name of the current executable
            -   name: browser_url
                in: formData
                required: false
                type: string
                description: a url opened during the activity
            -   name: browser_title
                in: formData
                required: false
                type: string
                description: a title of the browsing window
            -   name: ip_address
                in: formData
                required: true
                type: string
                description: an ip address of the user
            -   name: mac_address
                in: formData
                required: true
                type: string
                description: an mac address of the user
            -   name: idle_activity
                in: formData
                required: false
                type: boolean
                description: if activity is an idle one
            -   name: activity_type
                in: formData
                required: false
                type: string
                description: a type of activity collected (os, eclipse tab and etc)
        responses:
            400:
                description: Parameters are not correct
            201:
                description: Activity was added
    """
    data = flask.request.json if flask.request.json else flask.request.form
    activity_data = data.get(ACTIVITY_KEY)
    if not isinstance(activity_data, dict):
        try:
            activity_data = json.loads(activity_data)
        except Exception:
            return make_response(jsonify({MESSAGE_KEY: 'Wrong format'}), HTTPStatus.BAD_REQUEST)

    if ACTIVITIES_KEY in activity_data:
        #  Add multiple activities
        activities = [(activity, current_user.to_dbref()) for activity in activity_data.get(ACTIVITIES_KEY, [])]
        all_result = execute_function_in_parallel(add_activity, activities)
        result = 1
        for part_result in all_result:
            if not part_result:
                result = part_result
        if result:
            result = all_result
        else:
            # Delete those activities that were added
            for part_result in all_result:
                if part_result:
                    delete_activity(part_result)
    else:
        result = add_activity(activity_data, current_user.to_dbref())

    if not result:
        return make_response(jsonify({MESSAGE_KEY: 'Failed to create activity'}),
                             HTTPStatus.INTERNAL_SERVER_ERROR)

    return make_response(jsonify({MESSAGE_KEY: 'Success', ACTIVITY_ID_KEY: result}), HTTPStatus.CREATED)


@app.route('/activity', methods=['DELETE'])
@login_required
def activity_delete():
    """
    Delete an activity
    ---
    delete:
        summary: Delete an activity.
        description: Delete a specific activity from current user's history.
        parameters:
            -   name: activity_id
                in: formData
                required: true
                type: integer
                description: an id of the activity
        responses:
            400:
                description: Parameters are not correct
            404:
                description: Activity with this id was not found
            200:
                description: Activity was deleted
    """
    data = flask.request.json if flask.request.json else flask.request.form
    activity_id: str = data.get(ACTIVITY_ID_KEY)

    if not activity_id:
        return make_response((jsonify({MESSAGE_KEY: 'Empty data'}, HTTPStatus.BAD_REQUEST)))

    result = delete_activity(activity_id)
    if result == 0:
        return make_response(jsonify({MESSAGE_KEY: 'Activity with this id was not found'}),
                             HTTPStatus.NOT_FOUND)
    if not result:
        return make_response(jsonify({MESSAGE_KEY: 'Failed to delete activity'}),
                             HTTPStatus.INTERNAL_SERVER_ERROR)

    return make_response(jsonify({MESSAGE_KEY: 'Success'}), HTTPStatus.OK)


@app.route('/activity', methods=['GET'])
@login_required
def activity_find():
    """
    Find activities
    ---
    get:
        summary: Find activities.
        description: Find activities of current user.
        parameters:
            -   name: offset
                in: args
                required: true
                type: integer
                description: a number of activities to skip
            -   name: amount_to_return
                in: args
                required: true
                type: integer
                description: amount of activities to return, max is 1000
            -   name: filters
                in: args
                required: false
                type: object
                description: filters for activity, example {"activity_type"&#58; "os"}
            -   name: start_time
                in: args
                required: false
                type: string
                description: minimum start time of an activity
            -   name: end_time
                in: args
                required: false
                type: string
                description: maximum end time of an activity
        responses:
            404:
                description: Activities were not found
            400:
                description: Wrong format
            200:
                description: A list of activities was returned
    """
    data = flask.request.args
    offset: int = int(data.get(OFFSET_KEY, 0))
    amount_to_return: int = min(int(data.get(AMOUNT_TO_RETURN_KEY, 100)), 1000)
    filters = data.get(FILTERS_KEY, {})
    start_time = data.get(START_TIME_KEY, None)
    end_time = data.get(END_TIME_KEY, None)

    if not isinstance(filters, dict):
        try:
            filters = json.loads(filters)
        except Exception:
            return make_response(jsonify({MESSAGE_KEY: 'Wrong format'}), HTTPStatus.BAD_REQUEST)

    activities = find_activities([current_user.id], offset=offset, items_to_return=amount_to_return,
                                 filters=filters, start_time=start_time, end_time=end_time)
    if activities is None:
        return make_response(jsonify({MESSAGE_KEY: 'Failed to fetch activities'}),
                             HTTPStatus.INTERNAL_SERVER_ERROR)
    if activities == -1:
        return make_response(jsonify({MESSAGE_KEY: 'Wrong format for filters'}),
                             HTTPStatus.BAD_REQUEST)

    if not activities:
        return make_response(jsonify({MESSAGE_KEY: 'Activities of current user were not found'}),
                             HTTPStatus.NOT_FOUND)
    activities_list = [{k: str(v) for k, v in activity.to_mongo().items()} for activity in activities]

    return make_response(jsonify({MESSAGE_KEY: 'Success', ACTIVITIES_KEY: activities_list}), HTTPStatus.OK)


with app.test_request_context():
    views = [login, activity_add, activity_delete, activity_find, logout, user_delete, user_register,
             project_activities, invite, accept_invitation_endpoint]
    for view in views:
        spec.add_path(view=view)


def entry():
    with open(os.path.join(INNOMETRICS_PATH, 'documentation.yaml'), 'w') as f:
        f.write(spec.to_yaml())

    if not INNOMETRICS_PRODUCTION:
        app.run(host='0.0.0.0', port=flask_config['PORT'], threaded=True)
    else:
        server = WSGIServer(('0.0.0.0', int(flask_config['PORT'])), app,
                            keyfile=INNOMETRICS_PRODUCTION_KEYFILE,
                            certfile=INNOMETRICS_PRODUCTION_CERTFILE)
        server.serve_forever()


if __name__ == '__main__':
    # Save documentation
    with open(os.path.join(INNOMETRICS_PATH, 'documentation.yaml'), 'w') as f:
        f.write(spec.to_yaml())

    if not INNOMETRICS_PRODUCTION:
        app.run(host='0.0.0.0', port=flask_config['PORT'], threaded=True)
    else:
        server = WSGIServer(('0.0.0.0', int(flask_config['PORT'])), app,
                            keyfile=INNOMETRICS_PRODUCTION_KEYFILE,
                            certfile=INNOMETRICS_PRODUCTION_CERTFILE)
        server.serve_forever()
