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
            display: !false,
            suggestedMax: Math.max.apply(Math, e.data) + 1
          }
        }
      ]
    }
  }
}

export const data = [
  {x: 1, y: 1},
  {x: 2, y: 2},
  {x: 3, y: 1},
  {x: 4, y: 3},
  {x: 5, y: 5},
  {x: 6, y: 4},
  {x: 7, y: 7},
]
