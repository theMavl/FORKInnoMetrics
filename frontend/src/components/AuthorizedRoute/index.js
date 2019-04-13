import React from 'react'
import {Redirect, Route} from 'react-router-dom'
import { userAuthorized } from '../../helpers/selectors'
import {logoutRequest} from '../../store/user/actionCreators'
import {connect} from 'react-redux'

const AuthRoute = ({component: Component, authorized, ...rest}) => {
  return (
    <Route {...rest}
           render={(props) =>
             authorized ? (
               <Component {...props} />
             ) : (
               <Redirect
                 to={{
                   pathname: '/login',
                   state: {from: props.location}
                 }}
               />
             )
           }
    />
  )
}

const AuthorizedRoute = connect(
  (state) => ({
    authorized: userAuthorized(state)
  }),
  (dispatch) => ({
    logout: () => dispatch(logoutRequest())
  })
)(AuthRoute)

export default AuthorizedRoute