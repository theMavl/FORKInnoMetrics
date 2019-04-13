import React from 'react'
import styles from './style.css'

class PageTemplate extends React.Component {
  render() {
    // const bodyWidth = document.getElementsByTagName('body')[0].offsetWidth
    // const bodyHeight = document.getElementsByTagName('body')[0].offsetHeight
    // console.log(bodyWidth, bodyHeight)
    return (
        <article className={styles.main}>

          <div className={styles.titleRow}>
            <span className={styles.pageTitle}><h1>
              {this.props.title}
            </h1></span>{this.props.restHeader}
          </div>
          <div className={styles.content}>
            {this.props.children}
          </div>
        </article>

    )
  }
}

export default PageTemplate