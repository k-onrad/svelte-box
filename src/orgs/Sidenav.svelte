<script>
  import { fly } from 'svelte/transition'

  import ListItem from '../mols/ListItem.svelte'
  import Searchbar from '../mols/Searchbar.svelte'

  export let hidden
  export let mobile

  const modules = [
    { id: 1, href: '/', icon: 'edit', text: 'Dashboard' },
    { id: 2, href: '/posts', icon: 'vertical_split', text: 'Posts' },
    { id: 3, href: '/add-post', icon: 'note_add', text: 'Add New Post' },
    { id: 4, href: '/forms-components', icon: 'view_module', text: 'Forms & Components' },
    { id: 5, href: '/tables', icon: 'table_chart', text: 'Tables' },
    { id: 6, href: '/user-profile', icon: 'person', text: 'User Profile' },
    { id: 7, href: '/errors', icon: 'error', text: 'Errors' }
  ]
</script>

<style>
  nav {
    @apply bg-white;
    @apply h-screen px-0 pt-16;
    @apply border-r border-gray-200;
  }
  .hidden {
    display: none;
  }
</style>

{#if !hidden || !mobile}
  <nav class="w-full md:max-w-xs" transition:fly="{{ opacity: 1, duration: 300, x: -200 }}">  
    <ul class="flex flex-col pt-2 overflow-x-hidden">
      {#each modules as {id, ...props} (id)}
        <ListItem {...props}/>
      {/each}
    </ul>
  </nav>
{/if}
