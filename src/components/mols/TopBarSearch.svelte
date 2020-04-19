<style>
  div {
    align-items: center;
  }
  span {
    padding: .75rem 0 .75rem .625rem;
    background: 0 0;
    border: none;
  }
  i {
    position: absolute;
    z-index: 4;
    min-width: 1.25rem;
    font-size: 1.125rem;
    text-align: center;
    vertical-align: middle;
    color: #cacedb;
    transition: color .2s ease;
  }
  input {
    font-size: .8125rem;
    border: none !important;
    border-radius: 0;
    box-shadow: none !important;
    padding-left: 1.875rem;
  }
  input:focus,
  input:hover,
  input:active {
    box-shadow: inset 0 -0.1rem var(--blue) !important;
  }

</style>

<div class="h-100 w-100 d-none d-md-flex d-lg-flex input-group input-group-seamless ml-3">
  <span class="input-group-text">
    <i class="material-icons">search</i>
  </span>
  <input 
    class="form-control" 
    type="text" 
    placeholder="Search for something..." 
    aria-label="Search"/>
</div>
