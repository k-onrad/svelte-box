class Rex {
  // Should look like const rex = Rex(url, token)
  // const user = await rex.fetch('login')
  // const resourceData = await rex.fetch('endpoint')

  constructor(url, token) {
    this.url = url
    this.headers = token 
      ? {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`} 
      : {'Content-Type': 'application/json'}
  }

  setHeader(header) {
    this.headers = header
  }

  addHeader(header) {
    this.headers = Object.assign(this.headers, header)
  }

  async fetch(endpoint, {body, ...options}} = {}) {
    const defaults = {
      method: body ? 'POST' : 'GET',
      headers: this.headers,
    }

    const params = Object.assign(defaults, options)
    
    if (body) {
      params.body = JSON.stringify(body)
    }

    return window
      .fetch(`${this.url}/${endpoint}`, params)
      .then(async response => {
        if (response.status == 401) {
          // logout
          window.location.assign(window.location)
          return
        }
        const data = await response.json()
        if (response.ok) {
          return data
        } else {
          return Promise.reject(data)
        }
      })
  }
}
