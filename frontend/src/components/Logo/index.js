import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './style.css'

class Logo extends React.Component {
  render() {
    return (
        <div className={styles.logo}>
          <NavLink to='/'>
            <span className={styles.name}>
              <span className={styles.inno}>Inno</span>
              <span className={styles.metrics}>Metrics</span>
            </span>
          </NavLink>
        </div>

    )
  }
}

export default Logo