import {history} from './history'
import _ from 'lodash'

var pbkdf2 = require('pbkdf2');

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

export const saveUserToLocalStorage = (token, password_h) => {
    localStorage.setItem('user', JSON.stringify({token: token, password_h: password_h}))
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


export const generatePasswordHash = (login, password) => pbkdf2.pbkdf2Sync(password, login, 25, 128, 'sha512').toString('hex');

export const decryptActivities = (activities) => {
    var enc_key_h;
    var enc_key;
    for (var i = 0; i < activities.length; i++) {
        enc_key_h = activities[i].enc_key_h;

        console.log(obj.id);
    }
}