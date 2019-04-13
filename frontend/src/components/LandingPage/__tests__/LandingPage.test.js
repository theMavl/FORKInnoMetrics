import React from 'react'
import TestRenderer from 'react-test-renderer'
import LandingPage from '../index'
import { history } from '../../../helpers/history'
import { Router } from 'react-router-dom'

describe('Test LandingPage component', () => {

  it('Test render LandingPage component', () => {

    const instance = TestRenderer.create(
      <Router history={history}>
        <LandingPage/>
      </Router>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})