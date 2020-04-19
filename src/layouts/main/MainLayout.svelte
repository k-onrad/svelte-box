<script>
  import TopBar from './layout-components/top-bar/TopBar.svelte'
  import SideNav from './layout-components/side-nav/SideNav.svelte'
  import Footer from './layout-components/footer/Footer.svelte'

  let openSidenav = false
</script>

<style src="./MainLayout.styles.scss"></style>

<TopBar {openSidenav} on:click={() => openSidenav = !openSidenav}/>

<div class="container-fluid">
  <div class="row">

    <SideNav {openSidenav}/>

    <main class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"> 
      <slot>
        <div class="content">content</div>
      </slot>
    </main>

    <Footer/>

  </div>
</div>
