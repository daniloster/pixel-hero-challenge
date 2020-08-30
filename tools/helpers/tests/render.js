import { logDOM, prettyDOM } from '@testing-library/dom'

export default function render(component) {
  const root = document.createElement('div')
  document.body.appendChild(root)
  component.bootstrap(root)
  const container = root.firstChild

  return { container, debug: () => logDOM(prettyDOM(container)) }
}
