import {TYPES as ACTIVITIES_TYPES} from './actionTypes'
import {TYPES as USER_TYPES} from '../user/actionTypes'
import {decryptActivities} from '../../helpers/authenticationUtils'

const initialState = {
    activities: [],
    filters: {},

    activeRequest: false,
    failed: false,
    error: null
}

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIVITIES_TYPES.INIT_ACTIVITIES:
        case USER_TYPES.LOGIN_SUCCESS:
        case USER_TYPES.LOGOUT_SUCCESS:
        case USER_TYPES.LOGOUT_FAILURE:
            return initialState


        case ACTIVITIES_TYPES.GET_ACTIVITIES_REQUEST:
            return {
                ...state,
                activeRequest: true,
                activities: [],
                filters: action.payload.filters,
                failed: false,
                error: null
            }

        case ACTIVITIES_TYPES.GET_ACTIVITIES_SUCCESS:
            return {
                ...state,
                activities: decryptActivities(action.payload.activities),
                activeRequest: false,
                failed: false,
                error: null
            }

        case ACTIVITIES_TYPES.GET_ACTIVITIES_FAILURE:
            return {
                ...state,
                activeRequest: false,
                activities: [],
                failed: true,
                error: action.error
            }

        default:
            return state
    }
}