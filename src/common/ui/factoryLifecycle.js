import { DESTROY_EVENT_ID, MOUNT_EVENT_ID } from './reactive/factoryEvents'
import walkThroughTree from './walkThroughTree'

/**
 * Append element to parent
 * @param {import("../../types").Component} self
 * @param {HTMLElement} element
 * @param {{ onMount: () => void; onDestroy: () => void; }} hooks
 * @returns {void}
 */
export default function factoryLifecycle(self, element, hooks) {
  const { onMount, onDestroy } = hooks
  const mount = (component) => {
    // console.log('component mounting', { component, key: component.key })
    onMount(component)
    element.removeEventListener(MOUNT_EVENT_ID, mountHandler)
    // ...
  }
  const destroy = (component) => {
    // console.log('component destroying', { component, key: component.key })
    onDestroy(component)
    element.removeEventListener(DESTROY_EVENT_ID, destroyHandler)
    // ...
  }
  const mountHandler = (e) => {
    e.preventDefault()
    walkThroughTree([self], mount)
  }
  const destroyHandler = (e) => {
    e.preventDefault()
    walkThroughTree([self], destroy)
  }

  element.addEventListener(MOUNT_EVENT_ID, mountHandler)
  element.addEventListener(DESTROY_EVENT_ID, destroyHandler)
}
