import React from 'react'
import styles from './style.css'

class Spinner extends React.Component {
  render() {
    return (
        <div className={styles.spinnerContainer} {...this.props}>
          <div className={styles.spinner}>
            <div className={styles.sc1}></div>
            <div className={styles.sc2}></div>
            <div className={styles.sc3}></div>
            <div className={styles.sc4}></div>
            <div className={styles.sc5}></div>
            <div className={styles.sc6}></div>
            <div className={styles.sc7}></div>
            <div className={styles.sc8}></div>
          </div>
        </div>

    )
  }
}

export default Spinner