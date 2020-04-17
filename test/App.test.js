import App from '../src/App.svelte'

describe('App', () => {
  it('should render the app', () => {
    const { container } = render(App)

    expect(container.getElementsByClassName('title').length).toBe(1)

    expect(container).toMatchSnapshot()
  })
})
