import React from 'react'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import ActivitiesPage from '../index'

describe('Test ActivitiesPage component', () => {

  it('Test shallow render ActivitiesPage component', () => {

    const mockStore = createStore([])
    const store = mockStore({})

    const wrapper = shallow(
      <Provider store={store}>
        <ActivitiesPage />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

})