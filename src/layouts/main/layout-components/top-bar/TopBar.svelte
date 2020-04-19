<script>
  import Logo from '../logo/Logo.svelte'
  import TopBarSearch from './TopBarSearch.svelte'
  import TopBarNotificationToggle from './TopBarNotificationToggle.svelte'
  import TopBarUserDropdown from './TopBarUserDropdown.svelte'
  import TopBarSidenavToggle from './TopBarSidenavToggle.svelte'

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
    <TopBarNotificationToggle />
    <!-- <TopBarUserDropdown /> -->
    <TopBarSidenavToggle on:click {openSidenav} />
  </ul>
</nav>
