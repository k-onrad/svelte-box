import ImageExample from '../src/components/image-example/ImageExample.svelte'
import { render } from '@testing-library/svelte'

describe('Image Example', () => {
  it('renders an image', () => {
    const { container } = render(ImageExample)

    expect(container.getElementsByClassName('image-content').length).toBe(1)
    expect(container.getElementsByClassName('bg-image').length).toBe(1)

    expect(container).toMatchSnapshot()
  })
})
