<script>
  import Layout from './components/layout/Layout.svelte'
  import HelloWorld from './components/hello-world/HelloWorld.svelte'
  import ImageExample from './components/image-example/ImageExample.svelte'
</script>

<style src="./App.styles.scss"></style>

<Layout>
  <div class="container">
    <div class="container__top">
      <ImageExample/>
    </div>
    <div class="container__middle">
      <HelloWorld />
    </div>
  </div>
</Layout>
