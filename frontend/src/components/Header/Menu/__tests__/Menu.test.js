import React from 'react'
import TestRenderer from 'react-test-renderer'
import { Router } from 'react-router-dom'
import { history } from '../../../../helpers/history'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import Menu from '../index'

describe('Test Menu component', () => {

  it('Test render menu without \'MyPage\' when not authenticated', () => {

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
          <Menu/>
        </Router>
      </Provider>
    )
    expect(() => !!instance.root.find(element => element.children && element.children.includes('MyPage'))).toThrow()
    expect(instance.toJSON()).toMatchSnapshot()
  })

  it('Test render menu with \'MyPage\' when authenticated', () => {

    const mockStore = createStore([])
    const initialStore = {
      user: {
        authorized: true
      }
    }
    const store = mockStore(initialStore)

    const instance = TestRenderer.create(
      <Provider store={store}>
        <Router history={history}>
          <Menu/>
        </Router>
      </Provider>
    )
    expect(!!instance.root.find(element => element.children && element.children.includes('MyPage'))).toEqual(true)
    expect(instance.toJSON()).toMatchSnapshot()
  })
})