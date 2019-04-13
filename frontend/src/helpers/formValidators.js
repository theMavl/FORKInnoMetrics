import _ from 'lodash'
import moment from 'moment'

export const required = (value) => {
  return !_.isEmpty(_.trim(value)) ?
      undefined : 'Required'
}

export const email = (value) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(_.trim(value)) ?
      undefined : 'Invalid email'
}

export const date = (value) => {
  return moment(value, 'DD/MM/YYYY').isValid() ?
         undefined : 'Invalid date'
}