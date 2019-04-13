import _ from 'lodash'
import {createSelector} from 'reselect'
import { getActivities } from './selectors'

export const getMetrics = createSelector(
  state => getActivities(state),
  activities => {

    let metricsGroups = [
      {
        name: 'Code changes',
        metrics: [
          {
            name: 'Lines added',
            activities: activities.filter(a => a.activity_type === 'eclipse_lines_insert'),
            headerRow: ['File name', 'Lines added']
          },
          {
            name: 'Lines deleted',
            activities: activities.filter(a => a.activity_type === 'eclipse_lines_delete'),
            headerRow: ['File name', 'Lines deleted']
          },
          {
            name: 'Lines changed',
            activities: activities.filter(a => a.activity_type === 'eclipse_lines_change'),
            headerRow: ['File name', 'Lines changed']
          }
        ]
      },
      {
        name: 'Comments changes',
        metrics: [
          {
            name: 'Comments added',
            activities: activities.filter(a => a.activity_type === 'eclipse_comments_added'),
            headerRow: ['File name', 'Comments added']
          },
          {
            name: 'Comments deleted',
            activities: activities.filter(a => a.activity_type === 'eclipse_comments_deleted'),
            headerRow: ['File name', 'Comments deleted']
          }
        ]
      },
      {
        name: 'Tests changes',
        metrics: [
          {
            name: 'Tests added',
            activities: activities.filter(a => a.activity_type === 'eclipse_tests_added'),
            headerRow: ['File name', 'Tests added']
          },
          {
            name: 'Tests deleted',
            activities: activities.filter(a => a.activity_type === 'eclipse_tests_deleted'),
            headerRow: ['File name', 'Tests deleted']
          }
        ]
      }
    ]

    metricsGroups.forEach(
      group => {
        group.metrics.forEach(
          m => {
            m.value = _.reduce(m.activities, (sum, a) => sum + parseInt(a.value, 10), 0)
            m.trend = '-'
            m.data = _.chain(m.activities)
                      .reduce((obj, a) => {
                        obj[a.executable_name] = _.add(obj[a.executable_name], parseInt(a.value, 10))

                        return obj
                      }, {})

                      .toPairs()
                      .sortBy(pair => pair[1])
                      .reverse()
                      .value()
          }
        )

        let commonData = {}

        group.metrics.forEach(
          m => {

            commonData = _.chain(m.data)
                          .groupBy('[0]')
                          .mapValues(([value]) => _.set({}, m.name, value[1]))
                          .defaultsDeep(commonData)
                          .value()
          }
        )
        let headerRow = ['File name'].concat(_.map(group.metrics, 'name'))
        let commonMetric = {
          name: 'Total changes',
          value: _.sumBy(group.metrics, 'value'),
          trend: '-',
          headerRow: headerRow,
          data: _.chain(commonData)
                 .reduce((array, values, key) => {
                   let row = _.fill(Array(headerRow.length), 0)
                   row[0] = key
                   _.forIn(values, ((v, key) => {
                     row[headerRow.indexOf(key)] = v
                   }))
                   return _.concat(array, [row])
                 }, [])
                 .value()
        }
        group.metrics = [commonMetric].concat(group.metrics)
      }
    )

    return metricsGroups
})
