<script>
  import { fade } from 'svelte/transition'
  export let hidden
</script>

<style>
  button {
    @apply text-gray-500;
  }
</style>

<button on:click type="button" class="md:hidden focus:outline-none focus:text-gray-700">
  {#if hidden}
    <i
      in:fade="{{ duration: 200, delay: 200 }}"
      class="material-icons">menu</i>
  {:else}
    <i 
      in:fade="{{ duration: 200, delay: 200 }}"
      class="material-icons">arrow_back</i>
  {/if}
</button>
