<script>
  import { fade } from 'svelte/transition'
  import { width } from '../stores.js'
  import Topbar from '../orgs/Topbar.svelte'
  import Sidenav from '../orgs/Sidenav.svelte'
  // import Footer from '../orgs/Footer.svelte'

  // Assume mobile, if width >= 768 then tablet or desktop
  let hidden = true
</script>

<Topbar {hidden} on:click={() => hidden = !hidden} />

<div class="flex">
  {#if $width > 768 || !hidden}
    <Sidenav />
  {/if}

  {#if $width > 768 || hidden}
    <main
      class="h-full w-full m-auto pt-20 px-4 flex flex-col"
      in:fade="{{ duration: 200, delay: 250 }}">
      <slot>
        <div class="content">content</div>
      </slot>
    </main>
  {/if}
</div>
