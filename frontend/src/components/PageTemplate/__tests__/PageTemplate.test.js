import React from 'react'
import TestRenderer from 'react-test-renderer'
import PageTemplate from '../index'
import { history } from '../../../helpers/history'
import { Router } from 'react-router-dom'

describe('Test PageTemplate component', () => {

  it('Test render PageTemplate component', () => {

    const instance = TestRenderer.create(
      <Router history={history}>
        <PageTemplate/>
      </Router>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})