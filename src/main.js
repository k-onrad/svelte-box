import 'core-js/stable'
import 'regenerator-runtime/runtime'
import App from './App.svelte'

import './global.css'
import './shards.1.1.0.min.css'

const app = new App({
  target: document.body
})

window.app = app

export default app
