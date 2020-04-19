<script>
  import SideNavItem from './SideNavItem.svelte'
  import SideNavSearch from './SideNavSearch.svelte'

  export let openSidenav

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
    height: 100vh;
    background: var(--white);
    transition: transform .2s ease-in-out;
    box-shadow: 
    0 0.125rem 9.375rem rgba(90,97,105,.1), 
    0 0.25rem 0.5rem rgba(90,97,105,.12), 
    0 0.9375rem 1.375rem rgba(90,97,105,.1), 
    0 0.4375rem 2.1875rem rgba(165,182,201,.1);
  }
  @media (max-width: 767.98px) {
    nav {
      transform: translateX(-100%);
      box-shadow: none;
    }
  }
  .open {
    transform: translateX(0);
    box-shadow: 
    0 0.125rem 9.375rem rgba(90,97,105,.1), 
    0 0.25rem 0.5rem rgba(90,97,105,.12), 
    0 0.9375rem 1.375rem rgba(90,97,105,.1), 
    0 0.4375rem 2.1875rem rgba(165,182,201,.1);
  }
  ul {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 3.75rem - 1px);
  }
</style>

<nav class="sidebar col-12 col-md-3 col-lg-2 px-0" class:open={openSidenav == true}>
  <SideNavSearch />

  <ul class="nav flex-column">
    {#each modules as {id, ...props} (id)}
      <SideNavItem {...props}/>
    {/each}
  </ul>
</nav>
