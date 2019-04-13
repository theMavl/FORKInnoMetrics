import _ from 'lodash'
import {store} from '../store'
import { TYPES as USER_TYPES } from '../store/user/actionTypes'

export const processApiError = (error) => {
console.log(error.response)
  switch(_.get(error.response, 'status', 0)){
    case 0:
      return {status: 0, statusText: 'No Internet connection', data: { message: 'No Internet connection'}}
    case 401:
      store.dispatch({type: USER_TYPES.UNAUTHORIZED})
      return error.response
    default:
      return error.response
  }
}

export const getResponseError = (status, path, method) => {
  if(status === 0)
    return 'No response'
  if(status === 500)
    return 'Some error occurred'

  if(path === '/login' && method === 'post') {
    switch (status) {
      case 200:
        return 'Logged in successfully'
      case 400:
        return 'Some error occurred'
      case 401:
        return 'Wrong email or password'
      case 404:
        return 'Wrong email or password'
    }
  }
  if(path === '/activity' && method === 'post') {
    switch (status) {
      case 201:
        return 'Activity added successfully'
      case 400:
        return 'Wrong parameters provided'
    }
  }
  if(path === '/activity' && method === 'delete') {
    switch (status) {
      case 200:
        return 'Activity deleted successfully'
      case 400:
        return 'Some error occurred'
      case 404:
        return 'No such activity'
    }
  }
  if(path === '/activity' && method === 'get') {
    switch (status) {
      case 200:
        return 'Got activities successfully'
      case 404:
        return 'No activities yet'
    }
  }
  if(path === '/logout' && method === 'post') {
    switch (status) {
      case 200:
        return 'Logged out successfully'
    }
  }
  if(path === '/user' && method === 'delete') {
    switch (status) {
      case 200:
        return 'User deleted successfully'
    }
  }
  if(path === '/user' && method === 'post') {
    switch (status) {
      case 200:
        return 'User registered successfully'
      case 400:
        return 'Wrong parameters'
      case 409:
        return 'User with this email already exists'
    }
  }

  return 'Unknown error'
}