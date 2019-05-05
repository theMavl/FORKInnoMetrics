import React from 'react'
import { Link } from 'react-router-dom'
import { Field } from 'redux-form'
import Button from '../Button'
import Input from '../Input'
import { email, required } from '../../helpers/formValidators'
import styles from './style.css'
import Spinner from "../Spinner";

class RegistrationForm extends React.Component {
  onSubmit = () => {
    this.props.register()
  }

  render () {
    return (
      <form className={styles.form}
            onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <h1 className={styles.msgTitle}>Register</h1>
        <Field
          name='email'
          component={Input}
          label='Email'
          placeholder='Email'
          type='email'
          validate={[required, email]}
          disabled={this.props.activeRequest}
        />
        <Field
          name='name'
          component={Input}
          label='Name'
          placeholder='Name'
          type='text'
          validate={required}
          disabled={this.props.activeRequest}
        />
        <Field
          name='surname'
          component={Input}
          label='Surname'
          placeholder='Surname'
          type='text'
          validate={required}
          disabled={this.props.activeRequest}
        />
        <Field
          name='password'
          component={Input}
          label='Password'
          placeholder='Password'
          type='password'
          validate={required}
          disabled={this.props.activeRequest}
        />
        <Button name='Register'
                type='submit'
                style={{width: '100%'}}
                disabled={this.props.submitDisabled}
        />
        {this.props.activeRequest && <Spinner/>}
        <p className={styles.formError}>{this.props.formError}</p>
        <p className={styles.suggestion}>Have account already?
          <Link to='/login'>Login</Link>
        </p>
      </form>
    )
  }
}

export default RegistrationForm