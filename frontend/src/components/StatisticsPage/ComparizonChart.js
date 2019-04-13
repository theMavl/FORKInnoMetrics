import React from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

class ComparizonChart extends React.Component {
  render() {
    return (
      <ResponsiveContainer width={'100%'} aspect={3}>
        <ComposedChart data={this.props.data}
                       margin={{ top: 60, right: 120, left: 120, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='day' />
          <YAxis label={{ offset: 13, value: 'Hours', position: 'top' }} width={1} yAxisId='left'  />
          <YAxis label={{ offset: 13, value: 'Hours', position: 'top' }} width={1} yAxisId='right' orientation='right' />
          <Tooltip payload={this.props.data} />
          <Bar yAxisId='left' dataKey='actual' barSize={30} fill='#03F3C3' />
          <Bar yAxisId='left' dataKey='average' barSize={30} fill='#1585E5' />
          <Line yAxisId='left' dataKey='teamAvg' stroke='#E16111' />
          <Legend verticalAlign="bottom" height={30}/>
        </ComposedChart>
      </ResponsiveContainer>
    )
  }
}

export default ComparizonChart