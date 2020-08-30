import ObservableState from '../../ObservableState'

export const DESTROY_EVENT_ID = `destroy:observers:${Date.now()}`
export const MOUNT_EVENT_ID = `mount:observers:${Date.now()}`

document.addEventListener('DOMNodeRemoved', (e) => {
  /** @type {HTMLElement} */
  const target = e.target
  target.dispatchEvent(new CustomEvent(DESTROY_EVENT_ID, { bubbles: false }))
})
document.addEventListener('DOMNodeInserted', (e) => {
  /** @type {HTMLElement} */
  const target = e.target
  // console.log('ADD', e.target)
  target.dispatchEvent(new CustomEvent(MOUNT_EVENT_ID, { bubbles: false }))
})

export default function factoryEvents(element, events) {
  const subscribers = []
  Object.entries(events).forEach(([eventName, handler]) => {
    let internalHandler = () => null
    if (eventName === 'mount') {
      element.addEventListener(MOUNT_EVENT_ID, (e) => internalHandler(e))
    } else {
      element.addEventListener(eventName, (e) => internalHandler(e))
    }
    subscribers.push(
      ObservableState.observe(handler, (newValue) => {
        internalHandler = newValue
      }),
    )
  })
  return { unsubscribe: () => subscribers.forEach((fn) => fn()) }
}
