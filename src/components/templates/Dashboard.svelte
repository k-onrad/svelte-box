<script>
  import Topbar from '../orgs/Topbar.svelte'
  import Sidenav from '../orgs/Sidenav.svelte'
  import Footer from '../orgs/Footer.svelte'

  let openSidenav = false
</script>

<style src="./Dashboard.scss"></style>

<Topbar {openSidenav} on:click={() => openSidenav = !openSidenav}/>

<div class="container-fluid">
  <div class="row">

    <Sidenav {openSidenav}/>

    <main class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"> 
      <slot>
        <div class="content">content</div>
      </slot>
    </main>

    <Footer/>

  </div>
</div>
