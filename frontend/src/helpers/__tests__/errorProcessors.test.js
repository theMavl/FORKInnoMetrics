import {getResponseError} from '../errorProcessors'

describe('Test \'getResponseError\' method', () => {
  it('Returns right message for 404 error /getActivity get request', () => {
    expect(getResponseError(404, '/activity', 'get')).toBe('No activities yet')
  })
  
  it('Returns right message for 409 error /user post request', () => {
    expect(getResponseError(409, '/user', 'post')).toBe('User with this email already exists')
  })
})