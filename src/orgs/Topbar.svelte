<script>
  import { width } from '../core/stores.js'
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
    @apply fixed top-0 inset-x-0 z-20;
    @apply w-full h-20 py-2 px-6;
    @apply bg-white text-sm shadow-lg;
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
