document.addEventListener('click', onClickOutside)

let hooks = []
function onClickOutside(e) {
  hooks.forEach(([container, hook]) => {
    const isClickingOutside =
      container &&
      !container.contains(e.target) &&
      document.body.contains(e.target)
    hook(e, isClickingOutside)
  })
}

export default function useClickOutside(container, hook) {
  const listener = [container, hook]
  hooks.push(listener)

  return () => {
    hooks = hooks.filter((item) => item !== listener)
  }
}
