import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import TestRenderer from 'react-test-renderer'
import createStore from 'redux-mock-store'
import { history } from '../../../helpers/history'
import Logo from '../index'

describe('Test Logo component', () => {

  it('Test render Logo component', () => {

    const mockStore = createStore([])
    const initialStore = {}
    const store = mockStore(initialStore)

    const instance = TestRenderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Logo/>
        </Router>
      </Provider>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})