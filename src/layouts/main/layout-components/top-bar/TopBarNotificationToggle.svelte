<script>
  import TopBarNotificationMenu from './TopBarNotificationMenu.svelte'

  let show = false
</script>

<style>
  .nav-link {
    min-width: 3.75rem;
    color: rgba(0,0,0,.5);
    cursor: pointer;
  }
</style>


<li class="nav-item h-100 position-relative">
  <div 
    on:click={() => show = !show}
    class="nav-link nav-link-icon text-center h-100">
    <div>
      <i class="material-icons"></i>
      <span class="badge badge-pill badge-danger">2</span>
    </div>
  </div>
  {#if show}
    <TopBarNotificationMenu {show} />
  {/if}
</li>
