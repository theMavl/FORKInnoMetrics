import React from 'react'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { shallow } from 'enzyme'
import AuthorizedRoute from '../index'
import TestRenderer from 'react-test-renderer'
import * as reactRouterDom from 'react-router-dom'
import { history } from '../../../helpers/history'

describe('Test AuthorizedRoute component', () => {

  const Component = () => {
    return <div>Component</div>
  }

  const RedirectComponent = () => {
    return <div>Redirect</div>
  }

  reactRouterDom.Redirect = jest.fn(RedirectComponent)

  it('Test shallow render AuthorizedRoute component', () => {

    const props = {}
    const mockStore = createStore([])
    const initialStore = {
      user: {
        authorized: true
      }
    }
    const store = mockStore(initialStore)

    const wrapper = shallow(
      <Provider store={store}>
        <reactRouterDom.Router history={history}>
          <AuthorizedRoute{...props} />
        </reactRouterDom.Router>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('Test shallow render Component in AuthorizedRoute when user authenticated', () => {

    // selectors.userAuthorized = jest.fn().mockReturnValue(true)

    const props = {component: Component}
    const mockStore = createStore([])
    const initialStore = {
      user: {
        authorized: true
      }
    }
    const store = mockStore(initialStore)

    const wrapper = TestRenderer.create(
      <Provider store={store}>
        <reactRouterDom.Router history={history}>
          <AuthorizedRoute {...props} />
        </reactRouterDom.Router>
      </Provider>
    )

    expect(wrapper.toJSON().children[0]).toEqual('Component')
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('Test shallow render Component in AuthorizedRoute when user not authenticated', () => {

    // selectors.userAuthorized = jest.fn().mockReturnValue(false)

    const props = {component: Component}
    const mockStore = createStore([])
    const initialStore = {
      user: {
        authorized: false
      }
    }
    const store = mockStore(initialStore)

    const wrapper = TestRenderer.create(
      <Provider store={store}>
        <reactRouterDom.Router history={history}>
          <AuthorizedRoute {...props} />
        </reactRouterDom.Router>
      </Provider>
    )

    expect(wrapper.toJSON().children[0]).toEqual('Redirect')
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})