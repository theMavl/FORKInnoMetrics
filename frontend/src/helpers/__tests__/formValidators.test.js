import {required, email} from '../formValidators'

describe('Test \'required\' validator', () => {
  it('Rejects \'\' string', () => {
    expect(required('')).toBe('Required')
  })

  it('Rejects \'   \' string', () => {
    expect(required('   ')).toBe('Required')
  })

  it('Passes \'123\' string', () => {
    expect(required('123')).toBeUndefined()
  })

  it('Passes \'123\' parameter', () => {
    expect(required(123)).toBeUndefined()
  })
})


describe('Test \'email\' validator', () => {
  it('Rejects \'\' string', () => {
    expect(email('')).toBe('Invalid email')
  })


  it('Rejects \'qwerty@gmail\' string', () => {
    expect(email('qwerty@gmail')).toBe('Invalid email')
  })


  it('Passes \'qwerty@gmail.com\' parameter', () => {
    expect(email('qwerty@gmail.com')).toBeUndefined()
  })
})