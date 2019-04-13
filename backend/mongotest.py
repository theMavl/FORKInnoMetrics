from flask_login import UserMixin
from mongoengine import StringField, ListField, ReferenceField, DateTimeField, BooleanField, Document, connect

DEFAULT_STRING_MAX_LENGTH = 100


class User(Document, UserMixin):
    email = StringField(max_length=DEFAULT_STRING_MAX_LENGTH)
    password = StringField(max_length=DEFAULT_STRING_MAX_LENGTH)
    name = StringField(max_length=DEFAULT_STRING_MAX_LENGTH)
    surname = StringField(max_length=DEFAULT_STRING_MAX_LENGTH)
    active = BooleanField(default=True)
    confirmed_at = DateTimeField()


connect(db='metrics', username='manager', password='123456')
print(connect)

user = User(email="hjj", password="fsd", name="dgsga", surname="dfsa")
user.save()
print("Done")