import React from 'react'
import TestRenderer from 'react-test-renderer'
import Spinner from '../index'

describe('Test Spinner component', () => {

  it('Test render Spinner component', () => {

    const instance = TestRenderer.create(
      <Spinner/>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})