import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Field, isInvalid, reduxForm } from 'redux-form'
import { date, required } from '../../helpers/formValidators'
import Input from '../Input'
import styles from './style.css'

class _PeriodPicker extends React.Component {
  onSubmit = () => {
    console.log('submit')
    this.props.getActivities()
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if(this.props.periodFormState != undefined && prevProps.periodFormState != undefined &&
       !_.isEqual(this.props.periodFormState.values, prevProps.periodFormState.values)){
      this.props.submit()
    }
}
  render(){
    const datePickerProps = {
      type: 'datePicker',
      labelStyle: {
        display: 'inline',
        padding: 0,
        margin: 0
      },
      placeholder: '',
      containerProps: {style: {
        width: 'fit-content',
        height: '30px'
      }}
    }
    return (
      <div className={styles.periodPicker}>
        <i className={`${'material-icons'} ${styles.calendarIcon}`}>
          calendar_today
        </i>
        <form className={styles.form}
            onSubmit={this.props.handleSubmit(this.onSubmit)}
        >

          <Field
            name='startDate'
            component={Input}
            validate={[required, date]}
            normalize={(value, prevValue, allValues, prevAllValues) => {
              if(moment(value, 'DD/MM/YYYY')
                .isAfter(moment(allValues.endDate, 'DD/MM/YYYY'))
              ){
                this.props.change('endDate', moment(value).format('DD/MM/YYYY'))
                return allValues.endDate
              }
              return moment(value).format('DD/MM/YYYY')
            }}
            props={datePickerProps}
          />
          <span style={{padding: '0 5px'}}>-</span>
          <Field
            name='endDate'
            component={Input}
            validate={[required, date]}
            normalize={(value, prevValue, allValues, prevAllValues) => {
              if(moment(value, 'DD/MM/YYYY')
                .isBefore(moment(allValues.startDate, 'DD/MM/YYYY'))
              ){
                this.props.change('startDate', moment(value).format('DD/MM/YYYY'))
                return allValues.startDate
              }
              return moment(value).format('DD/MM/YYYY')
            }}
            props={datePickerProps}
          />

        </form>
      </div>
    )
  }
}


const initialValues = {
  startDate: moment().subtract({weeks: 1}).format('DD/MM/YYYY'),
  endDate: moment().format('DD/MM/YYYY')
}

let PeriodPicker = reduxForm({
  form: 'periodPicker',
  destroyOnUnmount: false,
  initialValues
})(_PeriodPicker)

PeriodPicker = connect(
  (state) => ({
    periodFormState: state.form.periodPicker,
    submitDisabled: isInvalid('periodPicker')(state) || state.activities.activeRequest
  })
)(PeriodPicker)

export default PeriodPicker