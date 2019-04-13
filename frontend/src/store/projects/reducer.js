import {TYPES as PROJECTS_TYPES} from './actionTypes'

const initialState = {
  projects: [],

  activeRequest: false,
  failed: false,
  error: null
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECTS_TYPES.GET_PROJECTS_REQUEST:
      return {
        ...state,
        activeRequest: true,
        failed: false,
        error: null
      }

    case PROJECTS_TYPES.GET_PROJECTS_SUCCESS:
      return {
        projects: action.payload.projects,
        activeRequest: false,
        failed: false,
        error: null
      }

    case PROJECTS_TYPES.GET_PROJECTS_FAILURE:
      return {
        ...state,
        activeRequest: false,
        failed: true,
        error: action.error
      }

    default:
      return state
  }
}