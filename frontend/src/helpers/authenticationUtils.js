import {history} from './history'
import _ from 'lodash'

var forge = require('node-forge');

export const isTokenExists = () => {
    return null != localStorage.getItem('user')
        && null != JSON.parse(localStorage.getItem('user')).token
}

export const getToken = () => {
    if (isTokenExists()) {
        return JSON.parse(localStorage.getItem('user')).token
    }
    return ''
}

export const saveUserToLocalStorage = (token, password_h, private_key_h) => {
    localStorage.setItem('user', JSON.stringify({token: token, password_h: password_h, private_key_h: private_key_h}))
}

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
}

export const redirectFromAuth = () => {
    let nextLocation = _.get(history, 'location.state.from', '/dashboard')
    if (nextLocation === '/login' || nextLocation === '/register')
        nextLocation = '/dashboard'
    history.push(nextLocation)
}


export const generatePasswordHash = (login, password) => forge.util.bytesToHex(forge.pkcs5.pbkdf2(password, login, 25, 128));

export const decryptActivities = (activities) => {
    // AES-CBC
    var password_h = JSON.parse(localStorage.getItem('user')).password_h;
    if (null == password_h) {
        console.log('No password_h found!');
        return activities;
    }

    let enc_key_h;
    let enc_key;
    let private_key;
    let decipher;
    let tmp_h;
    let tmp;
    let keys;

    const encrypted_fields = ['executable_name', 'browser_url', 'browser_title', 'ip_address', 'mac_address', 'activity_type', 'project'];

    try {
        const private_key_h = JSON.parse(localStorage.getItem('user')).private_key_h;
        private_key = forge.pki.decryptRsaPrivateKey(forge.util.encodeUtf8(private_key_h), password_h);

        for (var i = 0; i < activities.length; i++) {
            enc_key_h = forge.util.hexToBytes(activities[i].enc_key_h);
            enc_key = private_key.decrypt(enc_key_h, 'RSA-OAEP');

            keys = Object.keys(activities[i]);

            for (var j = 0; j < keys.length; j++) {
                if (encrypted_fields.includes(keys[j])) {
                    decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(enc_key, 'utf8'));
                    decipher.start({
                        iv: forge.util.hexToBytes(activities[i].iv)
                    });
                    tmp_h = forge.util.hexToBytes(activities[i][keys[j].toString()]);
                    decipher.update(forge.util.createBuffer(tmp_h, 'binary'));
                    tmp = decipher.finish();
                    if (tmp) {
                        activities[i][keys[j].toString()] = decipher.output.data;
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    return activities;
}