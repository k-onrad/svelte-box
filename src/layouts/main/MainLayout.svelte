<script>
  import TopBar from './layout-components/top-bar/TopBar.svelte'
  import SideNav from './layout-components/side-nav/SideNav.svelte'
  import Footer from './layout-components/footer/Footer.svelte'
</script>

<style src="./MainLayout.styles.scss"></style>

<div class="main-layout row">
  <SideNav/>

  <main class="main-content col-lg-10 col-md-9 col-sm-12 p-0 offset-lg-2 offset-md-3">
    <TopBar/>
    <slot>
      <div class="content">content</div>
    </slot>
    <Footer/>
  </main>
</div>
