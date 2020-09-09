import ObservableState from '../ObservableState'
import Component from '../ui/Component'

const resizeListeners = ObservableState.create([])
const resizeObserver = new ResizeObserver((entries) => {
  const listeners = resizeListeners.get()
  for (const entry of entries) {
    const { target, contentRect } = entry
    const found = listeners.find(([element]) => element === target)
    if (found) {
      const [element, listener] = found
      listener({ target, contentRect })
    }
  }
})

/**
 *
 * @param {HTMLElement} element
 * @param {({ target: HTMLElement, contentRect: DOMRectReadOnly }) => void} listener
 * @returns {import("../types").Subscription}
 */
function subscribe(element, listener) {
  resizeListeners.set((old) => [...old, [element, listener]])
  resizeObserver.observe(element)

  return {
    unsubscribe: () => {
      resizeObserver.unobserve(element)
      resizeListeners.set((old) =>
        old.filter(([currentElement]) => currentElement !== element),
      )
    },
  }
}

/**
 *
 * @param {Component|HTMLElement} component
 * @param {({ target: HTMLElement, contentRect: DOMRectReadOnly }) => void} listener
 * @returns {import("../types").Subscription}
 */
export default function useResizeObserver(component, listener) {
  /** @type {HTMLElement} */
  const element = component instanceof Component ? component.node() : component
  return subscribe(element, listener)
}
