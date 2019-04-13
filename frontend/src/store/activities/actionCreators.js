import moment from 'moment'
import { getResponseError } from '../../helpers/errorProcessors'
import {TYPES as ACTIVITIES_TYPES} from './actionTypes'
import {getRequest} from '../../helpers/api'

export const getActivitiesRequest = (project) => (dispatch, getState) => {
  console.log(project)
  const requestPath = (project === undefined) ? '/activity' : `/project/${project}/activity`

  const filters = getState().form.periodPicker.values
  dispatch({type: ACTIVITIES_TYPES.GET_ACTIVITIES_REQUEST, payload: {filters: filters}})

  const sd = moment(filters.startDate, 'DD/MM/YYYY'), ed = moment(filters.endDate, 'DD/MM/YYYY')
  const params = {
    start_time: `${sd.year()}-${sd.month() + 1}-${sd.date()} 00:00:00`,
    end_time: `${ed.year()}-${ed.month() + 1}-${ed.date()} 23:59:59`
  }

  getRequest(requestPath, {...params}, true)
      .then((result) => {
        dispatch({
          type: ACTIVITIES_TYPES.GET_ACTIVITIES_SUCCESS,
          payload: {activities: result.data.activities}
        })
      })
      .catch((error) => {
        dispatch({type: ACTIVITIES_TYPES.GET_ACTIVITIES_FAILURE, error: getResponseError(error.status, '/activity', 'get')})
      })
}