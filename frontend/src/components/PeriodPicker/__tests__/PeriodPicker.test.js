import React from 'react'
import { Provider } from 'react-redux'
import createStore from 'redux-mock-store'
import { shallow } from 'enzyme/build/index'
import PeriodPicker from '../index'

describe('Test PeriodPicker component', () => {

  it('Test shallow render PeriodPicker component', () => {

    const mockStore = createStore([])
    const store = mockStore({})

    const wrapper = shallow(
      <Provider store={store}>
        <PeriodPicker />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

})