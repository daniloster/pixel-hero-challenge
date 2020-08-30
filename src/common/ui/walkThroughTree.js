/**
 *
 * @param {Array<Component>} components
 * @param {(component: Component) => void} call
 */
export default function walkThroughTree(components, call) {
  if (!Array.isArray(components)) {
    return
  }
  const iterate = [...components]
  let item = null
  while ((item = iterate.shift())) {
    walkThroughTree(item.children, call)
    call(item)
  }
}
