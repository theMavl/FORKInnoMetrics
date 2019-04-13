import React from 'react'
import TestRenderer from 'react-test-renderer'
import Input from '../index'

describe('Test Input component', () => {

  it('Test render Input component', () => {

    const instance = TestRenderer.create(
      <Input/>
    )
    expect(instance.toJSON()).toMatchSnapshot()
  })
})