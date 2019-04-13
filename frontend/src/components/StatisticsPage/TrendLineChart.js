import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

class TrendLineChart extends React.Component {
  render() {
    return (
      <ResponsiveContainer width={'100%'} aspect={3}>
        <LineChart data={this.props.data}
                       margin={{ top: 60, right: 120, left: 120, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='day' />
          <YAxis label={{ offset: 13, value: this.props.yName, position: 'top' }} width={1} yAxisId='left'  />
          <YAxis label={{ offset: 13, value: this.props.yName, position: 'top' }} width={1} yAxisId='right' orientation='right' />
          <Tooltip />
          <Line yAxisId='left' dataKey='value' stroke='#E16111' />
          <Legend verticalAlign="bottom" height={30}/>
        </LineChart>
      </ResponsiveContainer>
    )
  }
}

export default TrendLineChart