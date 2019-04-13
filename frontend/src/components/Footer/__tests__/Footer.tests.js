import React from 'react'
import TestRenderer from 'react-test-renderer'
import Footer from '../index'

describe('Test Footer component', () => {

  it('Test render Footer component', () => {

    const instance = TestRenderer.create(
      <Footer/>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})