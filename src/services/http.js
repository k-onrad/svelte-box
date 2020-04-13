// #region Global Imports
import { stringify } from 'query-string'

require('es6-promise').polyfill()
require('isomorphic-fetch')
// #endregion Global Imports

const BaseUrl = `${process.env.API_URL}/api`

export const Http = {
  Request: async (methodType, url, params, payload) => {
    return new Promise((resolve, reject) => {
      const query = params ? `?${stringify(params)}` : ''
      window
        .fetch(`${BaseUrl}${url}${query}`, {
          body: JSON.stringify(payload),
          cache: 'no-cache',
          headers: {
            'content-type': 'application/json'
          },
          method: `${methodType}`
        })
        .then(async response => {
          if (response.status === 200) {
            return response.json().then(resolve)
          } else {
            return reject(response)
          }
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}
