import React from 'react'
import TestRenderer from 'react-test-renderer'
import Header from '../index'
import { Router } from 'react-router-dom'
import { history } from '../../../helpers/history'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'

describe('Test Header component', () => {

  it('Test render Header component', () => {

    const mockStore = createStore([])
    const initialStore = {
      user: {
        authorized: false
      }
    }
    const store = mockStore(initialStore)

    const instance = TestRenderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Header/>
        </Router>
      </Provider>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})