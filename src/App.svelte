<script>
  import Router from 'svelte-spa-router'

  import routes from './routes.js'
  import MainLayout from './layouts/main/MainLayout.svelte'

  // Handles the "conditionsFailed" event dispatched by the router when a component can't be loaded because one of its pre-condition failed
  const conditionsFailed = (event) => {
    // eslint-disable-next-line no-console
    console.error('Caught event conditionsFailed', event.detail)
  }
  // Handles the "routeLoaded" event dispatched by the router after a route has been successfully loaded
  // import ImageExample from './components/image-example/ImageExample.svelte'
  const routeLoaded = (event) => {
    // eslint-disable-next-line no-console
    console.info('Caught event routeLoaded', event.detail)
  }
  // Handles event bubbling up from nested routes
  const routeEvent = (event) => {
    // eslint-disable-next-line no-console
    console.info('Caught event routeEvent', event.detail)
  }
</script>

<style>
</style>

<MainLayout>
  <Router {routes} on:conditionsFailed={conditionsFailed} on:routeLoaded={routeLoaded} on:routeEvent={routeEvent} />
</MainLayout>
