import React from 'react'
import styles from './style.css'

class LandingPage extends React.Component {
  render() {
    // const bodyWidth = document.getElementsByTagName('body')[0].offsetWidth
    // const bodyHeight = document.getElementsByTagName('body')[0].offsetHeight
    // console.log(bodyWidth, bodyHeight)
    return (
        <main className={styles.content}>
          <div className={styles.mainImg}>
            <div className={styles.descriptionBox}>
              <h1 className={styles.secondaryPhrase}>Analyze your activity</h1>
              <h1 className={styles.articlePhrase}>and </h1>
              <h1 className={styles.primaryPhrase}>Improve Productivity</h1>
              {/*<Button name='Get Started'/>*/}
            </div>
          </div>
          <div className={styles.screenBlock}>
            <h2 className={styles.heading}>Download links</h2>
            <p className={styles.blockDescription}>
              <a href='https://innometric.guru/files/InnometricsMac.zip' download>MacOS client</a><br/>
              <a href='https://innometric.guru/files/EclipseLogger_1.0.0.jar' download>Eclipse plugin</a><br/>
              Others coming soon...
            </p>
          </div>

        </main>

    )
  }
}

export default LandingPage