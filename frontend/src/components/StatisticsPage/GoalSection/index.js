import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import Chart from 'react-google-charts'
import Spinner from '../../Spinner'
import styles from './style.css'

const TileTemplate = ({opened, onOpenCloseTab, name, value, trend}) => {
  return (
    <div className={opened ? styles.tileActive : styles.tile}
         key={name}
         onClick={onOpenCloseTab}
    >
      <span className={styles.metricValue}>{value}</span>
      <span className={styles.metricName}>{name}</span>
      {trend !== '-' &&
        <span className={trend > 0 ? styles.positiveTrend : styles.negativeTrend}>
          <i className={`${'material-icons'} ${styles.trendArrow}`}>
            {trend > 0 ? 'arrow_upward' : 'arrow_downward'}
          </i>
          {trend}%
        </span>
      }
    </div>
  )
}

const OpenedTabTemplate = ({children, onClose}) => {
  return (
    <div className={styles.openedTabArea}>
      <div className={styles.chart}>
        {children}
      </div>
      <div className={styles.buttons}>
        <i className={`${'material-icons'} ${styles.closeIcon}`}
           onClick={onClose}
        >
          close
        </i>
        <Link className={styles.moreButton}
              to='/'
        >  {/*TODO: solve navigation*/}
          <i className={`${'material-icons'}`}
          >
            arrow_forward_ios
            {/*chevron_right*/}
          </i>
          More...
        </Link>
      </div>
    </div>
  )
}

class GoalSection extends React.Component {
  state = {
    opened: null
  }
  onOpenCloseTab = (index) => {
    if(index === null || this.state.opened === index)
      this.setState({opened: null})
    else
      this.setState({opened: index})
  }
  render() {
    return (
      <div className={styles.goal}>
        <span>{/*Goal:*/} <h2 className={styles.goalName}>{this.props.goalName}</h2></span>
        {this.props.metrics === undefined ?
           (<div className={styles.emptyPanel}>
            There is nothing to show for this goal yet
          </div>) :
           (<div className={styles.panel}>
             <div className={styles.tiles}>
               {this.props.metrics.map((a, i) => (
                 <TileTemplate key={a.name}
                               opened={this.state.opened === i}
                               onOpenCloseTab={() => this.onOpenCloseTab(i)}
                               name={a.name}
                               value={a.value}
                               trend={a.trend}
                 />
               ))}
             </div>
             {this.state.opened !== null && (
               <OpenedTabTemplate onClose={() => this.onOpenCloseTab(null)}>
                 {
                   this.props.metrics[this.state.opened].value === 0 ?
                   <div className={styles.emptyChart}>
                     <span>No data collected for this metric yet</span>
                   </div>
                   :
                   <Chart
                     // width={'500px'}
                     // height={'300px'}
                     chartType='BarChart'
                     loader={<Spinner/>}
                     data={[this.props.metrics[this.state.opened].headerRow].concat(this.props.metrics[this.state.opened].data)}
                     options={{
                       title: this.props.metrics[this.state.opened].name,
                       // chartArea: { width: '50%' },
                       hAxis: {
                         title: 'Amount',
                         minValue: 0,
                       },
                       vAxis: {
                         title: 'File',
                         // textPosition: 'none'
                       },
                       // legend: { position: 'none' },
                     }}
                   />

                 }
               </OpenedTabTemplate>
             )}
           </div>)
        }
      </div>
    )
  }
}

export default GoalSection