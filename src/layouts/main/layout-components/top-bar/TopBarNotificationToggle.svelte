<script>
  import TopBarNotificationMenu from './TopBarNotificationMenu.svelte'
</script>

<style>
  li {
    position: relative;
  }
  .nav-link {
    min-width: 3.75rem;
    color: rgba(0,0,0,.5);
  }
</style>


<li class="nav-item">
  <div 
    class="nav-link nav-link-icon text-center dropdown-toggle" 
    href="/" 
    role="button" 
    id="dropdownMenuLink" 
    data-toggle="dropdown" 
    aria-haspopup="true" 
    aria-expanded="false">
    <div class="nav-link-icon__wrapper">
      <i class="material-icons"></i>
      <span class="badge badge-pill badge-danger">2</span>
    </div>
  </div>
  <TopBarNotificationMenu />
</li>
