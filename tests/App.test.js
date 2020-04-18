import App from '../src/App.svelte'
import { render } from '@testing-library/svelte'

jest.mock('svelte-spa-router')
jest.mock('../src/routes.js')
jest.mock('../src/layouts/main/MainLayout.svelte')

describe('App', () => {
  it('should render the app', () => {
    const { container } = render(App)

    expect(container.getElementsByClassName('title').length).toBe(1)

    expect(container).toMatchSnapshot()
  })
})
