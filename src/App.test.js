import App from './App.svelte'
import { render } from '@testing-library/svelte'

describe('App', () => {
  it('should render the app', () => {
    const { container } = render(App)

    expect(container.getElementsByClassName('title').length).toBe(1)

    expect(container).toMatchSnapshot()
  })
})
