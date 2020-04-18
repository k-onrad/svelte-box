<script>
  import TopBarSearch from './TopBarSearch.svelte'
  import TopBarNotifications from './TopBarNotifications.svelte'
  import TopBarUserDropdown from './TopBarUserDropdown.svelte'
</script>

<div class="main-navbar sticky-top bg-white">
  <nav class="navbar align-items-stretch navbar-light flex-md-nowrap p-0">
    <TopBarSearch />
    <ul class="navbar-nav border-left flex-row ">
      <TopBarNotifications />
      <TopBarUserDropdown />
    </ul>
    <nav class="nav">
      <a 
        href="/" 
        class="nav-link nav-link-icon toggle-sidebar d-md-inline d-lg-none text-center border-left" 
        data-toggle="collapse" 
        data-target=".header-navbar" 
        aria-expanded="false" 
        aria-controls="header-navbar">
        <i class="material-icons"></i>
      </a>
    </nav>
  </nav>
</div>
