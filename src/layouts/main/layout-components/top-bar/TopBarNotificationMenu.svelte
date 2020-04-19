<script>
  export let show
</script>

<style>
  .menu {
    position: absolute;
    right: 0;
    left: auto;
    margin: 0;
    padding: 0;
    min-width: 25rem;
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-right: 0;
    box-shadow: 0 0.5rem 2rem rgba(0,0,0,.11), 0 3px 10px rgba(0,0,0,.05), 0 2px 3px rgba(0,0,0,.06);
    font-size: .8rem;
  }
</style>

<div class="menu w-100" class:show>
  <a class="dropdown-item" href="/">
    <div class="notification__icon-wrapper">
      <div class="notification__icon">
        <i class="material-icons"></i>
      </div>
    </div>
    <div class="notification__content">
      <span class="notification__category">Analytics</span>
      <p>Your website’s active users count increased by <span class="text-success text-semibold">28%</span> in the last week. Great job!</p>
    </div>
  </a>
  <a class="dropdown-item" href="/">
    <div class="notification__icon-wrapper">
      <div class="notification__icon">
        <i class="material-icons"></i>
      </div>
    </div>
    <div class="notification__content">
      <span class="notification__category">Sales</span>
      <p>Last week your store’s sales count decreased by <span class="text-danger text-semibold">5.52%</span>. It could have been worse!</p>
    </div>
  </a>
  <a class="dropdown-item notification__all text-center" href="/"> View all Notifications </a>
</div>
