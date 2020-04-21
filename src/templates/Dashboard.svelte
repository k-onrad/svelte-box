<script>
  import { fade } from 'svelte/transition'
  import { width } from '../core/stores.js'
  import Topbar from '../orgs/Topbar.svelte'
  import Sidenav from '../orgs/Sidenav.svelte'
  // import Footer from '../orgs/Footer.svelte'

  // Default content
  import NotFound from '../pages/not-found/NotFound.svelte'

  // Assume mobile, if width >= 768 then tablet or desktop
  let hidden = true

  // Setup links to pages
  const links = [
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
  main {
    @apply w-full px-0 pt-20 bg-gray-200;
  }
</style>

<Topbar {hidden} on:click={() => hidden = !hidden} />

<div class="flex h-screen bg-white">
  {#if $width > 768 || !hidden}
    <Sidenav {links} />
  {/if}

  {#if $width > 768 || hidden}
    <main in:fade="{{ duration: 200, delay: 250 }}">
      <slot>
        <NotFound />
      </slot>
    </main>
  {/if}
</div>
