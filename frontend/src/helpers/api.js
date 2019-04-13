import axios from 'axios'
import { getToken } from './authenticationUtils'
import { processApiError } from './errorProcessors'

/* DOMAIN_ADDRESS initialized by process.env in 'webpack.config.js' */

const request = axios.create({
  baseURL: DOMAIN_ADDRESS,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export function postRequest (url, params={}, withToken=false) {

  const formData = new FormData()
  Object.keys(params).forEach(key => formData.append(key, params[key]))
 
  return new Promise((resolve, reject) => {
    request.post(
      url,
      formData,
      {
        headers: additionalHeaders(withToken),
        withCredentials: true
      }
    )
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(processApiError(error))
        })
  })
}

export function getRequest (url, params={}, withToken=false) {

  return new Promise((resolve, reject) => {
    request.get(
      url,
      {
        params: params,
        headers: additionalHeaders(withToken),
        withCredentials: true
      }
    )
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(processApiError(error))
        })
  })
}

const additionalHeaders = (isWithToken) => isWithToken ? {'X-API-Key': getToken()} : {}
