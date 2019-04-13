import {TYPES as PROJECTS_TYPES} from './actionTypes'
import {TYPES as USER_TYPES} from '../user/actionTypes'
import { postRequest } from '../../helpers/api'
import { removeUserFromLocalStorage } from '../../helpers/authenticationUtils'

export const getProjectsRequest = () => (dispatch, getState) => {
  dispatch({type: PROJECTS_TYPES.GET_PROJECTS_REQUEST})

  dispatch({
    type: PROJECTS_TYPES.GET_PROJECTS_SUCCESS,
    payload: {
      projects: [{name: 1}, {name: 2}, {name: 3}]
    }
  })
}

export const inviteUserRequest = (projectId) => (dispatch, getState) => {
	
	// const filters = getState().form.projectInvitation.values.email
	dispatch({type: PROJECTS_TYPES.INVITE_USER_REQUEST})

	postRequest(`/project/${projectId}/invite`, {}, true)
	.then((result) => {
		dispatch({
			type: PROJECTS_TYPES.INVITE_USER_SUCCESS,
			payload: {
				// TODO
			}
		})
	})
	.catch((error) => {
		if(error == undefined){
			dispatch({type: PROJECTS_TYPES.INVITE_USER_FAILURE, error: 'No response'})
			return
		}
		switch(error.status){
			case 401:
				removeUserFromLocalStorage()
				dispatch({type: USER_TYPES.LOGOUT_SUCCESS})
				break
			default:
				dispatch({type: PROJECTS_TYPES.INVITE_USER_FAILURE, error: error})
		}
	})
}