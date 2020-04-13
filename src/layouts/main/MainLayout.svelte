<script>
  import Logo from './layout-components/logo/Logo.svelte'
  import TopBar from './layout-components/top-bar/TopBar.svelte'
  import SideNav from './layout-components/side-nav/SideNav.svelte'
  import Footer from './layout-components/footer/Footer.svelte'
</script>

<style src="./MainLayout.styles.scss"></style>

<div class="main-layout">
  <Logo/>
  <TopBar/>
  <SideNav/>

  <slot>
    <div class="item content">content</div>
  </slot>

  <Footer />
</div>
