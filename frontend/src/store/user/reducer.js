import {TYPES as USER_TYPES} from './actionTypes'
import { removeUserFromLocalStorage, saveUserToLocalStorage } from '../../helpers/authenticationUtils'

const initialState = {
  authorized: !(null === localStorage.getItem('user')),
  activeRequest: false,
  failed: false,
  error: null
}

export const reducer = (state = initialState, action) => {

  if(action.type.startsWith('@@redux-form'))
    return {
      ...state,
      error: null,
      failed: false
    }

  switch (action.type) {
    case USER_TYPES.LOGIN_REQUEST:
    case USER_TYPES.REGISTER_REQUEST:
      return {
        authorized: false,
        activeRequest: true,
        failed: false,
        error: null
      }

    case USER_TYPES.LOGIN_SUCCESS:
      saveUserToLocalStorage(action.token)
      return {
        authorized: true,
        activeRequest: false,
        failed: false,
        error: null
      }

    case USER_TYPES.REGISTER_SUCCESS:
      return {
        authorized: false,
        activeRequest: false,
        failed: false,
        error: null
      }

    case USER_TYPES.LOGIN_FAILURE:
    case USER_TYPES.REGISTER_FAILURE:
      return {
        authorized: false,
        activeRequest: false,
        failed: true,
        error: action.error
      }

    case USER_TYPES.LOGOUT_REQUEST:
      return {
        authorized: true,
        activeRequest: true,
        failed: false,
        error: null
      }

    case USER_TYPES.LOGOUT_SUCCESS:
    case USER_TYPES.UNAUTHORIZED:
      removeUserFromLocalStorage()
      return {
        authorized: false,
        activeRequest: false,
        failed: false,
        error: null
      }

    case USER_TYPES.LOGOUT_FAILURE:
      removeUserFromLocalStorage()
      return {
        authorized: false,
        activeRequest: false,
        failed: true,
        error: action.error
      }

    default:
      return state
  }
}