import { writable, derived } from 'svelte/store'

export const width = writable(320)
export const height = writable(568)

export const screen = derived(
  width,
  ($width) => {
    if ($width <= 640) {
      return 'sm'
    } else if ($width <= 768) {
      return 'md'
    } else if ($width <= 1024) {
      return 'lg'
    } else {
      return 'xl'
    }
  }
)

