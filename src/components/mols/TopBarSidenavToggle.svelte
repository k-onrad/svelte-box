<script>
  export let openSidenav
</script>

<style>
  .toggle {
    min-width: 3.75rem;
    border-left: 1px solid #e1e5eb;
    color: #818ea3;
    font-size: 1.5625rem;
    font-weight: 400;
    padding: .625rem .625rem;
    transition: all 250ms cubic-bezier(.27,.01,.38,1.06);
    height: 100%;
    text-align: center;
    align-self: center;
  }
  .open {
    position: absolute;
    right: 0;
    padding: .625rem .625rem;
    transition: all 250ms cubic-bezier(.27,.01,.38,1.06);
  }
</style>

<div on:click class:open={openSidenav == true} class="toggle">
{#if openSidenav}
  <i class="material-icons"></i>
{:else}
  <i class="material-icons"></i>
{/if}
</div>
