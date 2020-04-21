export const options = (e) => {
  return {
    maintainAspectRatio: true,
    responsive: true,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
      custom: false
    },
    elements: {
      point: {
        radius: 0
      },
      line: {
        tension: 0.3
      }
    },
    scales: {
      xAxes: [
        {
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          gridLines: false,
          scaleLabel: false,
          ticks: {
            display: false,
            suggestedMax: Math.max.apply(Math, e.data) + 1
          }
        }
      ]
    }
  }
}
