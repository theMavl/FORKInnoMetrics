import React from 'react'
import createStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import TestRenderer from 'react-test-renderer'
import ProjectsListPage from '../index'

describe('Test ProjectsListPage component', () => {

  it('Test render ProjectsListPage component', () => {

    const mockStore = createStore([thunk])
    const store = mockStore({
      projects: {
        projects: [{name: 'proj 1'}, {name: 'proj 2'}, {name: 'proj 3'}],
        activeRequest: false
      }
    })

    const instance = TestRenderer.create(
      <Provider store={store}>
        <ProjectsListPage />
      </Provider>
    )

    expect(instance.toJSON()).toMatchSnapshot()
  })

})