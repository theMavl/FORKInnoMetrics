import React from 'react'
import Chart from 'react-google-charts'
import { connect } from 'react-redux'
import { activitiesSummarized } from '../../../helpers/selectors'
import Spinner from '../../Spinner'
import styles from './style.css'

class ChartView extends React.Component {
  render() {
    console.log([['Activity', 'Duration', { role: 'annotation' }]]
                  .concat(this.props.activities.map(a => [a.executable_name, a.duration, a.duration])))
    return (
      <div className={styles.chartView}>
        <Chart
          // width={'500px'}
          height={`${this.props.activities.length * 30}px`}
          chartType='BarChart'
          loader={<Spinner/>}
          data={[['Activity', 'Duration (min)', { role: 'annotation' }]]
            .concat(this.props.activities.map(a => {
              let time = Number(a.duration)
              const fromDays = 24 * 60 * 60,
                    fromHours = 60 * 60,
                    fromMinutes = 60
              const days = Math.floor(time / fromDays)
              time -= days * fromDays
              const hours = Math.floor(time / fromHours)
              time -= hours * fromHours
              const minutes = Math.floor(time / fromMinutes)
              const seconds = (time - minutes * fromMinutes)
              const formatted = (x) => (x < 10 ? '0' : '') + x
              return [
                a.executable_name, a.duration / 60,
                `${days > 0 ? days + 'days\n' : ''} ${formatted(hours)}:${formatted(minutes)}:${formatted(seconds)}`
              ]
            }))
          }
          options={{
            title: 'Time spend for activities',
            // chartArea: { width: '50%' },
            hAxis: {
              title: 'Time (min)',
            },
            vAxis: {
              title: 'Activity',
              minValue: 0,
            },
            legend: { position: 'none' },
            // bar: { groupWidth: '30px' },
          }}
        />
        {/*<ResponsiveContainer width={'100%'} aspect={3}>
          <BarChart data={this.props.activities}
                    margin={{ top: 25, right: 50, left: 50, bottom: 25 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='executable_name'
                   label={{ offset: 0, value: 'Activity', position: 'bottom' }}
                   height={25}
                   axisLine={false}
                   tickLine={false}
                   interval={0}
                   tick={<CustomTick amount={this.props.activities.length}/>}
            />
            <YAxis width={100}
                   label={{ offset: 13, value: 'Duration', position: 'top' }}
                   dataKey='duration'
                   tickFormatter={(value) => moment().startOf('day')
                                                     .seconds(value)
                                                     .format('HH[h ]mm[m ]ss[s]')}
            />
            <Tooltip payload={this.props.activities}
                     formatter={(value, name, props) => moment().startOf('day')
                                                                .seconds(value)
                                                                .format('HH[h ]mm[m ]ss[s]')}
            />
            <Bar dataKey='duration'
                 barSize={30}
                 fill='#8884d8'
            />
        </BarChart>
        </ResponsiveContainer>*/}
      </div>
    )
  }
}

class CustomTick extends React.Component{
  render(){
    const {x, y, payload, ...rest} = this.props
    let width = rest.width/rest.amount - 5
    return (
      <foreignObject className={styles.truncated}
                     x={x-width/2} y={y-10}
                     width={width} height={20}
      >
        <span title={payload.value}>{payload.value}</span>
      </foreignObject>

    )
  }
}

const ConnectedChartView = connect(
  (state) => ({
    activities: activitiesSummarized(state)
  })
)(ChartView)

export default ConnectedChartView