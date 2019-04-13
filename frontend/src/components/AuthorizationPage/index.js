import React from 'react'
import { connect } from 'react-redux'
import { isInvalid, reduxForm } from 'redux-form'
import { loginRequest, logoutRequest, registerRequest } from '../../store/user/actionCreators'
import { userAuthorized } from '../../helpers/selectors'
import PageTemplate from '../PageTemplate'
import RegistrationForm from './RegistrationForm'
import LoginForm from './LoginForm'
import Button from '../Button'
import styles from './style.css'

class AuthPage extends React.Component {
  onLogout = () => {
    this.props.logout()
  }
  onStayTheSame = () => {
    this.props.history.push('/')
  }
  render(){
    if(this.props.authorized)
      return (
        <PageTemplate title='Logout confirmation'>
          <p className={styles.description}>
            You are logged in already.
            Would you like to keep the same session or
            login to another account?
          </p>
          <div className={styles.buttonsRow}>
            <Button name='Stay the same'
                    styleType='primary'
                    onClick={this.onStayTheSame}
                    style={{margin: '0 calc(var(--cell-size)/4) 0 0'}}
            />
            <Button name='Logout anyway'
                    styleType='secondary'
                    onClick={this.onLogout}
            />
          </div>
        </PageTemplate>
      )
    return (
        <main className={styles.content}>
          {this.props.match.path === '/login' ?
            <LoginForm {...this.props}/> : <RegistrationForm {...this.props}/>}
        </main>
    )
  }
}

const initialValues = {
  email: '',
  password: '',
  name: '',
  surname: ''
}

let AuthorizationPage = reduxForm({
  form: 'authorization',
  initialValues: initialValues
})(AuthPage)

AuthorizationPage = connect(
    (state) => ({
      authorized: userAuthorized(state),
      authFormState: state.form.authorization,
      formError: state.user.error,
      activeRequest: state.user.activeRequest,
      submitDisabled: isInvalid('authorization')(state) || state.user.activeRequest
    }),

    (dispatch) => ({
      logout: () => dispatch(logoutRequest()),
      login: () => dispatch(loginRequest()),
      register: () => dispatch(registerRequest())
    })
)(AuthorizationPage)

export default AuthorizationPage