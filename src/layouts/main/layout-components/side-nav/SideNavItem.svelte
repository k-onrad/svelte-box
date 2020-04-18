<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let href = '/'
  export let icon = ''
  export let text = ''
</script>
<li class="nav-item">
  <a 
    use:link 
    use:active 
    class="nav-link active" 
    href={href}>
    <i class="material-icons">{icon}</i>
    <span>{text}</span>
  </a>
</li>
