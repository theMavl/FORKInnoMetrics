import moment from 'moment'
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
// import Autosuggest from 'react-autosuggest'
import styles from './style.css'
import datePickerStyles from './datePicker.css'
// import autoSuggestStyles from './autoSuggest.css'

import 'react-datepicker/dist/react-datepicker-cssmodules.css'

class Input extends React.Component {
  render() {
    const {input, meta, type, label, labelStyle, required, error, containerProps, inputProps, autoSuggestProps, ...otherInputProps} = this.props
    let _containerProps = containerProps
    let _inputProps = otherInputProps
    _.assign(_inputProps, inputProps)
    let labelProps = {style: {}}
    _.assign(labelProps.style, labelStyle)
    if(_inputProps.id != undefined) {
      labelProps.htmlFor = _inputProps.id
    }
    _.assign(_inputProps, input)
    const displayedError = meta != undefined ? meta.error : error


    if(type === 'checkbox')
      return (
        <div className={styles.checkboxContainer} {..._containerProps}>
          <input className={styles.checkboxInput} {..._inputProps} type={type}/>
          <label className={styles.checkboxLabel} {...labelProps}>
            {label}
          </label>
        </div>
      )

    return (
        <div className={styles.container} {..._containerProps}>
          {label.trim().length > 0 && (
            <label className={styles.label} {...labelProps}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          )}
          {type === 'datePicker' ?
           <DatePicker {...input}
                       onBlur={(value) => {input.onBlur(moment(input.value, 'DD/MM/YYYY').toDate())}}
                       dateFormat='dd/MM/yyyy'
                       popperPlacement='bottom-start'
                       popperModifiers={{
                         preventOverflow: {
                           enabled: true,
                           escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                           boundariesElement: 'viewport'
                         }
                       }}
                       className={datePickerStyles.input}
           />
           // : type === 'autoSuggest' ?
           //   <Autosuggest {...autoSuggestProps} theme={autoSuggestStyles}
           //                inputProps={{className: styles.input, ..._inputProps}}
           //   />
           : <input className={styles.input} {..._inputProps} type={type}/>
          }
          <div className={styles.messages}>
            {_.get(meta, 'touched') && <span className={styles.error}>{displayedError}</span>}
          </div>
        </div>

    )
  }
}

Input.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  type: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string
}

Input.defaultProps = {
  type: 'text',
  label: '',
  required: false,
  error: ''
}

export default Input