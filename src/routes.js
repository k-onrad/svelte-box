import Overview from './pages/Overview.svelte'
import Example from './pages/example/Example.svelte'
import NotFound from './pages/not-found/NotFound.svelte'

const routes = new Map()

routes.set('/', Overview)
routes.set('/example', Example)
routes.set('*', NotFound)

export default routes
