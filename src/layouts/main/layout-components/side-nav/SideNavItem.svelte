<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let href = '/'
  export let icon = ''
  export let text = ''
</script>

<style>
  li {
    white-space: nowrap;
    min-width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: box-shadow .2s ease,color .2s ease,background-color .2s ease;
    font-size: .85rem;
  }
  a {
    border-bottom: 1px solid #e1e5eb;
    font-weight: 400;
    color: #3d5170;
    padding: .9375rem 1.5625rem;
  }
  .active, a:hover {
    box-shadow: inset 0.1875rem 0 0 var(--blue);
    background-color: var(--light);
  }
  .active, 
  .active i, 
  a:hover, 
  a:hover i {
    color: var(--blue);
  }
  i {
    min-width: 1.25rem;
    top: -1px;
    font-size: 1.125rem;
    text-align: center;
    vertical-align: middle;
    color: #cacedb;
    transition: color .2s ease;
    margin-right: .375rem;
  }
</style>

<li>
  <a 
    use:link 
    use:active 
    class="nav-link" 
    href={href}>
    <i class="material-icons">{icon}</i>
    <span>{text}</span>
  </a>
</li>
