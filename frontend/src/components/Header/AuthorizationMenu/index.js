import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import { NavLink } from 'react-router-dom'
import {logoutRequest} from '../../../store/user/actionCreators'
import {userAuthorized} from '../../../helpers/selectors'
import styles from './style.css'

class AuthMenu  extends React.Component {
  shouldComponentUpdate(nextProps, nextState){
    return nextProps.authorized !== this.props.authorized
  }
  render(){
    return this.props.authorized ?
        (
            <div className={styles.authMenu}
                 onClick={this.props.logout}
            >
              <div className={styles.authItem}>Logout</div>
            </div>
        )
        :
        (
            <div className={styles.authMenu}>
              <div className={styles.authItem}
                   // onClick={() => this.props.history.push('/login')}
              >
                <NavLink to='/login'>Login</NavLink>
              </div>
              <span style={{padding: '0 5px 0 5px'}}> or </span>
              <div className={styles.authItem}
                   // onClick={() => this.props.history.push('/register')}
              >
                <NavLink to='/register'>Register</NavLink>
              </div>
            </div>
        )
  }
}

const AuthorizationMenu = connect(
    (state) => ({authorized: userAuthorized(state)}),
    (dispatch) => ({
      logout: () => dispatch(logoutRequest())
    })
)(AuthMenu)

export default withRouter(AuthorizationMenu)