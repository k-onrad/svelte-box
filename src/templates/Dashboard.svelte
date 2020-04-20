<script>
  import { fade } from 'svelte/transition'
  import Topbar from '../orgs/Topbar.svelte'
  import Sidenav from '../orgs/Sidenav.svelte'
  import Footer from '../orgs/Footer.svelte'

  // Assume desktop, if Hamburguer is mounted then mobile
  let hidden = false
  let mobile = false
</script>

<Topbar 
  {hidden} 
  on:click={() => hidden = !hidden}
  on:mobile={() => { hidden = true; mobile = true }}
  on:reset={() => { hidden = false; mobile = false }}/>

<div class="flex">
  <Sidenav {hidden} {mobile}/>

  {#if hidden}
    <main 
      class="h-full w-full m-auto pt-20 px-4 flex flex-col" 
      in:fade="{{ duration: 200, delay: 300 }}"> 
      <slot>
        <div class="content">content</div>
      </slot>

      <Footer/>
    </main>
  {/if}
</div>

