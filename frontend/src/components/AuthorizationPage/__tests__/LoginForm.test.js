import React from 'react'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import LoginForm from '../LoginForm'

describe('Test LoginForm component', () => {

  it('Test shallow render LoginForm component', () => {

    const props = {}
    const mockStore = createStore([])
    const store = mockStore({})

    const wrapper = shallow(
      <Provider store={store}>
        <LoginForm props={props} />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })
})