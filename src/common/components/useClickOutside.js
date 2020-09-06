import factoryUUID from '../factoryUUID'

document.addEventListener('click', onClickOutside)

const uuid = factoryUUID()
const weakHooks = new WeakMap()
let hooks = []

function onClickOutside(e) {
  hooks.forEach((id) => {
    if (weakHooks.has(id)) {
      const [container, hook, unsubscribe] = weakHooks.get(id)
      const isClickingOutside =
        container &&
        !container.contains(e.target) &&
        document.body.contains(e.target)
      hook(e, isClickingOutside)
      if (!document.body.contains(container)) {
        unsubscribe()
      }
    }
  })
}

export default function useClickOutside(container, hook) {
  const ref = { id: uuid() }
  const unsubscribe = () => {
    hooks = hooks.filter(({ id }) => ref.id !== id)
  }
  const listener = [container, hook, unsubscribe]
  hooks.push(ref)
  weakHooks.set(ref, listener)

  return unsubscribe
}
