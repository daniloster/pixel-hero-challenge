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
  self.onMount = () => {
    onMount()
    element.removeEventListener(MOUNT_EVENT_ID, mountHandler)
    // ...
  }
  self.onDestroy = () => {
    onDestroy()
    element.removeEventListener(DESTROY_EVENT_ID, destroyHandler)
    // ...
  }
  const mountHandler = (e) => {
    e.preventDefault()
    walkThroughTree([self], (component) => component.onMount())
  }
  const destroyHandler = (e) => {
    e.preventDefault()
    walkThroughTree([self], (component) => component.onDestroy())
  }

  element.addEventListener(MOUNT_EVENT_ID, mountHandler)
  element.addEventListener(DESTROY_EVENT_ID, destroyHandler)
}
