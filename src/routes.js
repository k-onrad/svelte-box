import HomePage from './pages/home/HomePage.svelte'
import Example from './pages/example/Example.svelte'
import NotFound from './pages/not-found/NotFound.svelte'

const routes = new Map()

routes.set('/', HomePage)
routes.set('/example', Example)
routes.set('*', NotFound)

export default routes
