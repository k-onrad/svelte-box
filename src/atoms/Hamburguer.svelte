<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'

  const dispatch = createEventDispatcher()
  
  onMount(() => dispatch('mobile'))
  onDestroy(() => dispatch('reset'))
</script>

<style>
  button {
    @apply text-gray-500;
  }
</style>

<button on:click type="button" class="md:hidden focus:outline-none focus:text-gray-700">
  <svg 
    class="fill-current w-4 h-4" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20">
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
  </svg>
</button>
