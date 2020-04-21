<script>
  import { onMount } from 'svelte'
  import Chart from 'chart.js'
  
  export let type = 'line'
  export let data
  export let options = {}
  export let ariaLabel = 'A chart'

  let ctx

  onMount(() => { 
    new Chart(ctx, {
      type: type,
      data: data,
      options: options,
    })
  })
</script>

<canvas class="w-full h-full m-0 p-0" bind:this={ctx} aria-label={ariaLabel} role="img"></canvas>
