import App from './App.svelte'

import './themes/global.css'
import './themes/shards.1.1.0.min.css'

const app = new App({
  target: document.body
})

window.app = app

export default app
