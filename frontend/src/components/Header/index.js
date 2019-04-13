import React from 'react'
import {withRouter} from 'react-router'
import Logo from '../Logo'
import Menu from './Menu'
import AuthorizationMenu from './AuthorizationMenu'
import styles from './style.css'

const Header = ({history}) => {
  return (
      <header className={styles.header}>
        <div className={styles.logoItem} onClick={() => {history.push('/')}}>
          <Logo/>
        </div>
        <Menu/>
        <AuthorizationMenu/>
      </header>

  )
}

export default withRouter(Header)