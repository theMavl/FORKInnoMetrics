import React from 'react'
import TestRenderer from 'react-test-renderer'
import Button from '../index'

describe('Test Button component', () => {

  it('Test render Button component', () => {

    const props = {
      name: 'Button',
      styleType: 'primary',
      disabled: false
    }

    const instance = TestRenderer.create(
      <Button {...props}/>
    )
    // expect(instance.toJSON().children[0]).toEqual(props.name)
    expect(instance.toJSON()).toMatchSnapshot()
  })
})