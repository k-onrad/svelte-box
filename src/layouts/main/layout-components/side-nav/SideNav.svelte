<script>
  import Logo from '../logo/Logo.svelte'
  import SideNavItem from '../side-nav-item/SideNavItem.svelte'

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

<aside class="main-sidebar col-12 col-md-3 col-lg-2 px-0">
  <Logo />

  <!-- Componentize this -->
  <form 
    action="#" 
    class="main-sidebar__search w-100 border-right d-sm-flex d-md-none d-lg-none">
    <div class="input-group input-group-seamless ml-3">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <i class="fas fa-search"></i>
        </div>
      </div>
      <input 
        class="navbar-search form-control" 
        type="text" 
        placeholder="Search for something..." 
        aria-label="Search"/>
    </div>
  </form>
  <!-- Componentize this -->

  <div class="nav-wrapper">
    <ul class="nav flex-column">
      {#each modules as {id, ...props} (id)}
        <SideNavItem {...props}/>
      {/each}
    </ul>
  </div>
</aside>
