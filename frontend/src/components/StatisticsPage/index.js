import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { getMetrics } from '../../helpers/metricsSelectors'
import { getActivitiesRequest } from '../../store/activities/actionCreators'
import Spinner from '../Spinner'
import PageTemplate from '../PageTemplate'
import PeriodPicker from '../PeriodPicker'
import GoalSection from './GoalSection'
// import styles from './style.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

class _StatisticsPage extends React.Component {
  componentDidMount(){

    this.getActivities()
  }

  getActivities = () => {
    this.props.match.params.projectName ?
    this.props.getActivities(this.props.match.params.projectName)
                                        : this.props.getActivities()
  }
  render() {
    // console.log(this.props.metricsGroups)

    const testeeName = this.props.match.params.projectName ?
                        `'${this.props.match.params.projectName}' team`
                        : 'My'
    return (
      <PageTemplate title={testeeName + ' performance'}
                    restHeader={<PeriodPicker onSubmit={this.getActivities}/>}
      >

        {
          this.props.activeRequest ? <Spinner/> :

          this.props.metricsGroups.map(group => (
            <GoalSection key={group.name}
                         goalName={group.name}
                         metrics={group.metrics}
            >
            </GoalSection>
          ))
        }

      </PageTemplate>
    )
  }
}

const StatisticsPage = connect(
  (state) => ({
    metricsGroups: getMetrics(state),
    activeRequest: state.activities.activeRequest
  }),

  (dispatch) => ({
    getActivities: (proj) => dispatch(getActivitiesRequest(proj))
  })
)(_StatisticsPage)


export default withRouter(StatisticsPage)