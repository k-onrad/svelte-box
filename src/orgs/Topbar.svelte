<script>
  import Logo from '../mols/Logo.svelte'
  import Searchbar from '../mols/Searchbar.svelte'
  import Hamburguer from '../atoms/Hamburguer.svelte'
  import NotificationBell from '../atoms/NotificationBell.svelte'
  // import TopBarUserDropdown from '../mols/TopBarUserDropdown.svelte'
  // import TopBarSidenavToggle from '../mols/TopBarSidenavToggle.svelte'
</script>

<style>
  header {
    @apply fixed top-0 inset-x-0 z-50;
    @apply w-full h-16 py-2 px-6;
    @apply bg-white border-b border-gray-200 text-sm;
    @apply flex items-center content-center justify-between;
  }
  div {
    @apply flex justify-end px-2;
  }
</style>

<header>
  <Logo />
  <Searchbar />
  <div>
    <NotificationBell />
    <Hamburguer on:click on:reset on:mobile />
    <!-- <TopBarUserDropdown />
    <TopBarSidenavToggle on:click {openSidenav} />-->
  </div>
</header>
