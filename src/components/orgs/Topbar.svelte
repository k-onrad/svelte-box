<script>
  import Logo from '../mols/Logo.svelte'
  import TopBarSearch from '../mols/TopBarSearch.svelte'
  import NotificationBell from '../atoms/NotificationBell.svelte'
  import TopBarUserDropdown from '../mols/TopBarUserDropdown.svelte'
  import TopBarSidenavToggle from '../mols/TopBarSidenavToggle.svelte'

  export let openSidenav
</script>

<style>
  nav {
    height: 3.75rem;
    box-shadow: 0 0.125rem 0.625rem rgba(90,97,105,.12);
  }
  ul {
    align-items: center;
  }
</style>

<nav class="navbar navbar-expand-lg navbar-light sticky-top bg-white flex-md-nowrap p-0">
  <Logo />
  <TopBarSearch />
  <ul class="navbar-nav flex-row h-100">
    <NotificationBell />
    <!-- <TopBarUserDropdown /> -->
    <TopBarSidenavToggle on:click {openSidenav} />
  </ul>
</nav>
