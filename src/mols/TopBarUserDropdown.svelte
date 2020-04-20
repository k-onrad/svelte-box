<script>
  let showDropdown = false
</script>

<li class="nav-item dropdown">
  <a 
    on:click={() => showDropdown = !showDropdown}
    href="/"
    class="nav-link dropdown-toggle text-nowrap px-3" 
    style="cursor: pointer;"
    role="button" 
    aria-haspopup="true" 
    aria-expanded="false">
    <img 
      class="user-avatar rounded-circle mr-2" 
      src="images/default_user.jpg" 
      alt="User Avatar"/> <span class="d-none d-md-inline-block">User</span>
  </a>
  {#if showDropdown}
    <!-- Gotta handle dropdowns better, extract css -->
    <div 
      class="dropdown-menu dropdown-menu-small"
      style="display: block !important;">
      <a class="dropdown-item" href="user-profile-lite.html"><i class="material-icons"></i> Profile</a>
      <a class="dropdown-item" href="components-blog-posts.html"><i class="material-icons">vertical_split</i> Blog Posts</a>
      <a class="dropdown-item" href="add-new-post.html"><i class="material-icons">note_add</i> Add New Post</a>
      <div class="dropdown-divider"></div>
      <a class="dropdown-item text-danger" href="/">
        <i class="material-icons text-danger"></i> Logout </a>
    </div>
  {/if}
</li>
