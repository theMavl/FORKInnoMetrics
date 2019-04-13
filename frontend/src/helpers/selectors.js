import {createSelector} from 'reselect'
import _ from 'lodash'
import moment from 'moment'

export const userAuthorized = createSelector(
  (state) => {
    return state.user
  },
  (user) => {
    return user.authorized
  }
)

export const getActivities = createSelector(state => state.activities, actStore => actStore.activities)

export const getSelectedActivitiesFilters = createSelector(state => _.get(state.form, 'activitiesFilter.values', []),
                                                           filters => _(filters).pickBy().keys().value())

export const getSelectedPeriod = createSelector(
  state => _.get(state.form,
                 'periodPicker.values',
                 {
                   startDate: moment().subtract({weeks: 1}).format('DD/MM/YYYY'),
                   endDate: moment().format('DD/MM/YYYY')
                 }),
  period => period)

export const getFilteredActivities = createSelector(
  [state => getActivities(state),
   state => getSelectedActivitiesFilters(state)],
  (activities, filters) => {
    if(filters.length === 0)
      return activities

  return _.filter(activities, (a) => _.includes(filters, _.camelCase(a.executable_name)))
})

export const activitiesFilterTags = createSelector(state => getActivities(state), activities => {
  let actTags = _.chain(activities).map('executable_name').uniq().value()
  return actTags
})

export const activitiesSummarized = createSelector(
  (state) => getFilteredActivities(state),
  (activities) => {
    let actObj = _(activities).chain()
      .reduce(
        (result, a) => {
          result[a.executable_name] = _.add(result[a.executable_name], (Date.parse(a.end_time) - Date.parse(a.start_time)) / 1000) // to seconds
          return result
        }, {})
      .reduce(
      (result, value, key) => _.concat(result, {duration: value, executable_name: key}), [])
      .sortBy('duration')
      .reverse()
      .value()
    return actObj
  }
)