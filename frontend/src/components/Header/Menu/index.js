import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import { NavLink } from 'react-router-dom'
import {userAuthorized} from '../../../helpers/selectors'
import styles from './style.css'

class HeaderMenu extends React.Component {
  guestNavigation = [
    // {name: 'Main Page', path: '/'}
  ]
  userNavigation = [
    {name: 'MyPage', path: '/dashboard'},
    // {name: 'Activities', path: '/activities'},
    // {name: 'Projects', path: '/projects'},
    // {name: 'Settings', path: '/settings'}
  ]
  render() {
    const navigation = this.props.authorized ? this.userNavigation : this.guestNavigation
    return (
        <nav className={styles.menu}>
          {navigation.map((i) => {
            return <div className={styles.menuItem} key={i.name}
                    >
              <NavLink to={i.path}>{i.name}</NavLink>
                    </div>
          })}
        </nav>

    )
  }
}

const Menu = connect(
  (state) => ({authorized: userAuthorized(state)}),
  () => ({})
)(HeaderMenu)

export default withRouter(Menu)