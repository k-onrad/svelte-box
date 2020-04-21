<style>
  .card {
    @apply h-48; 
    @apply overflow-hidden flex p-4 m-0; 
    @apply relative z-10 shadow-lg bg-white rounded;
    @apply min-w-full min-h-full break-words;
    background-clip: border-box;
  }
</style>


<article class="card">
  <slot></slot>
</article>
