<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
</script>

<style src="./SideNav.styles.scss">
</style>

<div class="item sidenav">
  <ul class="navigation-links">
    <li><a href="/" use:link use:active>Dashboard</a></li>
    <li><a href="/example" use:link>Example</a></li>
    <li><a href="/hello/svelte" use:link use:active={{ path: '/hello/*', className: 'active' }}>Say hi!</a></li>
    <li><a href="/does/not/exist" use:link>Not found</a></li>
  </ul>
</div>
