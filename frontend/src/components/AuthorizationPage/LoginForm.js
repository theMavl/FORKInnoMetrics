import React from 'react'
import { Link } from 'react-router-dom'
import { Field } from 'redux-form'
import Button from '../Button'
import Input from '../Input'
import { email, required } from '../../helpers/formValidators'
import styles from './style.css'
import Spinner from "../Spinner";

class LoginForm extends React.Component {
  onSubmit = () => {
    this.props.login()
  }

  render () {
    return (
      <form className={styles.form}
            onSubmit={this.props.handleSubmit(this.onSubmit)}
      >
        <h1 className={styles.msgTitle}>Login</h1>
        <Field
          name='email'
          component={Input}
          label='Email'
          placeholder='Email'
          type='email'
          validate={[required, email]}
          disabled={this.props.activeRequest}
        />
          {this.props.activeRequest && <Spinner/>}
        <Field
          name='password'
          component={Input}
          label='Password'
          placeholder='Password'
          type='password'
          validate={required}
          disabled={this.props.activeRequest}
        />
        <Button name='Login'
                type='submit'
                style={{width: '100%'}}
                disabled={this.props.submitDisabled}
        />
        <p className={styles.formError}>{this.props.formError}</p>
        <p className={styles.suggestion}>Don&#39;t have account yet?&nbsp;
          <Link to='/register'>Register</Link>
        </p>
      </form>
    )
  }
}

export default LoginForm