<script>
  import { onMount } from 'svelte'
  import Chart from 'Chart'

  export let label = 'Subscribers'
  export let value = 17.28
  export let tendency = 2.4

  let container
  
  const createChart = () => {
    var ctx = document.getElementById('myChart')
    var chrt = new Chart(ctx, {
    // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: [0, 10, 5, 2, 20, 30, 45]
        }]
      },

      // Configuration options go here
      options: {}
    })

  }
  onMount(createChart())
</script>

<style>
  .card {
    @apply relative overflow-hidden flex flex-col p-0 h-32; 
    @apply border border-gray-200 bg-white rounded;
    @apply min-w-0 break-words;
    background-clip: border-box;
  }
  .content {
    @apply flex flex-col m-auto;
  }
</style>

<canvas id="myChart" width="400" height="400"></canvas>

<article class="card">
  <div 
    style="position: absolute; inset: 0px; overflow: hidden; pointer-events: none; visibility: hidden; z-index: -1;" 
    class="chartjs-size-monitor">
    <div 
      class="chartjs-size-monitor-expand" 
      style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
      <div style="position:absolute;width:1000000px;height:1000000px;left:0;top:0"></div>
    </div>
    <div 
      class="chartjs-size-monitor-shrink" 
      style="position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1;">
      <div style="position:absolute;width:200%;height:200%;left:0; top:0"></div>
    </div>
  </div>
  <div class="content">
    <div class="stats-small__data text-center">
      <span class="stats-small__label text-uppercase">{label}</span>
      <h6 class="stats-small__value count my-3">{value}</h6>
    </div>
    <div class="stats-small__data">
      <span class="stats-small__percentage stats-small__percentage--decrease">{tendency}%</span>
    </div>
  </div>
  <canvas 
    bind:this={container}
    height="80" 
    width="200"
    style="display: block;"></canvas>
</article>
