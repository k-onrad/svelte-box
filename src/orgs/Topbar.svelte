<script>
  import { width } from '../stores.js'
  import Logo from '../mols/Logo.svelte'
  import Searchbar from '../mols/Searchbar.svelte'
  import Hamburguer from '../atoms/Hamburguer.svelte'
  import NotificationBell from '../atoms/NotificationBell.svelte'
  // import TopBarUserDropdown from '../mols/TopBarUserDropdown.svelte'
  // import TopBarSidenavToggle from '../mols/TopBarSidenavToggle.svelte'
  export let hidden
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
    {#if $width > 768}
      <NotificationBell />
    {:else}
      <Hamburguer {hidden} on:click />
    {/if}
    <!-- <TopBarUserDropdown />
    <TopBarSidenavToggle on:click {openSidenav} />-->
  </div>
</header>
