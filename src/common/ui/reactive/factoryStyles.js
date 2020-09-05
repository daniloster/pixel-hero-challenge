import ObservableState from '../../ObservableState'

/**
 * Factory styles to components
 * @param {HTMLElement} element
 * @param {{ [key: string]: any }} style
 */
export default function factoryStyles(element, style) {
  const subscribers = []
  Object.entries(style).forEach(([attribute, value]) => {
    subscribers.push(
      ObservableState.observe(value, (newValue) => {
        element.style.setProperty(attribute, newValue)
      }),
    )
  })
  return {
    unsubscribe: () => subscribers.forEach(({ unsubscribe }) => unsubscribe()),
  }
}
