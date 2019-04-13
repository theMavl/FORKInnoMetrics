import React from 'react'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import RegistrationForm from '../RegistrationForm'

describe('Test RegistrationForm component', () => {

  it('Test shallow render RegistrationForm component', () => {

    const props = {}
    const mockStore = createStore([])
    const store = mockStore({})

    const wrapper = shallow(
      <Provider store={store}>
        <RegistrationForm props={props} />
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })
})