<script>
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let href = '/'
  export let icon = ''
  export let text = ''
</script>

<style>
  li {
    @apply w-full flex px-1;
    @apply truncate text-sm;
  }
  li {
    transition: box-shadow .2s ease,color .2s ease,background-color .2s ease;
  }
  a {
    @apply w-full p-4 m-1;
    @apply border-none;
  }
  .active, a:hover {
    box-shadow: inset 0.1875rem 0 0 var(--blue);
  }
  .active, 
  .active i, 
  a:hover, 
  a:hover i {
    color: var(--blue);
  }
  i {
    @apply align-middle mr-1;
    @apply text-lg text-center text-gray-500;
    top: -1px;
    transition: color .2s ease;
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
