<script>
  import { fly } from 'svelte/transition'
  import NavLink from '../mols/NavLink.svelte'

  export let links
</script>

<style>
  nav {
    @apply px-0 pt-24 relative z-10 shadow-2xl;
  }
  ul {
    @apply flex flex-col pt-2 overflow-x-hidden w-full h-full;
  }
</style>

<nav class="w-full md:w-1/4" transition:fly="{{ opacity: 1, duration: 200, x: -1000 }}">  
  <ul>
    {#each links as {id, ...props} (id)}
      <NavLink {...props}/>
    {/each}
  </ul>
</nav>
