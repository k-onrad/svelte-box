import HomePage from './routes/home/HomePage.svelte'
import Example from './routes/example/Example.svelte'
import NotFound from './routes/not-found/NotFound.svelte'

const routes = new Map()
routes.set('/', HomePage)
routes.set('/example', Example)
routes.set('*', NotFound)

export default routes
