import { history } from './history'
import _ from 'lodash'

export const isTokenExists = () => {
  return null != localStorage.getItem('user')
      && null != JSON.parse(localStorage.getItem('user')).token
}

export const getToken = () => {
  if(isTokenExists()){
    return JSON.parse(localStorage.getItem('user')).token
  }
  return ''
}

export const saveUserToLocalStorage = (token) => {
  localStorage.setItem('user', JSON.stringify({token: token}))
}

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('user')
}

export const redirectFromAuth = () => {
  let nextLocation = _.get(history, 'location.state.from', '/dashboard')
  if(nextLocation === '/login' || nextLocation === '/register')
    nextLocation = '/dashboard'
  history.push(nextLocation)
}