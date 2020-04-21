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
    @apply pt-2 w-full sticky top-26 scrolling-touch overflow-y-auto;
  }
</style>

<nav class="w-full md:w-1/4" transition:fly="{{ opacity: 1, duration: 200, x: -1000 }}">  
  <ul>
    {#each links as {id, ...props} (id)}
      <NavLink {...props}/>
    {/each}
  </ul>
</nav>
