<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let href = '/'
  export let icon = ''
  export let text = ''
</script>

<style>
  li {
    @apply w-full py-4 px-4;
  }
  li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: box-shadow .2s ease,color .2s ease,background-color .2s ease;
    font-size: .85rem;
  }
  a {
    @apply w-full px-4 py-4;
    @apply border-none;
    font-weight: 400;
    color: #3d5170;
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
    href={href}>
    <i class="material-icons">{icon}</i>
    <span>{text}</span>
  </a>
</li>
