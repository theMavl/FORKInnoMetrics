import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Field, isInvalid, reduxForm } from 'redux-form'
import { activitiesFilterTags } from '../../../helpers/selectors'
import Input from '../../Input'
import styles from './style.css'

class _ActivitiesFilter extends React.Component {
  state = {
    opened: false
  }
  onSubmit = () => {
    console.log(this.props.tagsFormState)
  }

  componentDidMount = () => {
    let initialValues = this.props.suggestions.reduce((obj, item) => {
      obj[_.camelCase(item)] = true
      return obj
    }, {})
    this.props.initialize(initialValues)
  }
  render(){
    return (
      <div>
        <span className={styles.showHideBtn} onClick={() => this.setState({opened: !this.state.opened})}>
          {this.state.opened ?
           'Hide filters' : 'Show filters'
          }
        </span>
        <form
          onSubmit={this.props.handleSubmit(this.onSubmit)}
        >

          {this.state.opened && this.props.suggestions.map((activity, index) => (
            <Field key={_.camelCase(activity)}
              name={_.camelCase(activity)}
              type='checkbox'
              component={Input}
              label={activity}
            />
          ))}

        </form>
      </div>
    )
  }
}

let ActivitiesFilter = reduxForm({
   form: 'activitiesFilter'
 })(_ActivitiesFilter)

ActivitiesFilter = connect(
  (state) => ({
    filterFormState: state.form.activitiesFilter,
    suggestions: activitiesFilterTags(state),
    submitDisabled: isInvalid('activitiesFilter')(state)
  })
)(ActivitiesFilter)

export default ActivitiesFilter
