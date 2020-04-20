<script>
  export let type = 'text'
  export let placeholder = 'Digite aqui'
</script>

<style>
  input {
    @apply w-full m-0 py-2 px-2;
    @apply bg-gray-200;
    @apply border rounded border-gray-200;
    @apply text-gray-700 text-sm leading-tight;
  }
</style>

<input 
  class="focus:outline-none focus:bg-white focus:border-blue-500" 
  type={type} 
  placeholder={placeholder} />
