import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'redux-mock-store'
import { shallow } from 'enzyme/build'
import {activities} from '../../../../../___mocks___/activities'
import ChartView from '../index'

describe('Test ChartView component', () => {

  it('Test shallow render ChartView component', () => {

    const mockStore = createStore([])
    const store = mockStore({})

    const wrapper = shallow(
      <Provider store={store}>
        <ChartView activities={activities} />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

})