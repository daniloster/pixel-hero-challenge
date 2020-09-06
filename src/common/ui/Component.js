import factoryUUID from '../factoryUUID'
import noop from '../noop'
import ObservableState from '../ObservableState'
import factoryLifecycle from './factoryLifecycle'
import factoryAssignment from './reactive/factoryAssignment'
import factoryAttrs from './reactive/factoryAttrs'
import factoryClassList from './reactive/factoryClassList'
import factoryEvents from './reactive/factoryEvents'
import factoryStyles from './reactive/factoryStyles'

export const internalRef = Symbol('element')
const EMPTY_LIST = []
const EMPTY_OBJECT = {}
const PRIMITIVE_TYPES = ['string', 'number']
const DATA_ITERATION_KEY = 'data-iteration-key'

const uuid = factoryUUID()

function isSameChildren(children) {
  return Array.isArray(children)
    ? children
        .map(({ key }) => key)
        .filter((key) => !!key)
        .join('|')
    : children
}
/**
 * Component base
 * @param {string} tag
 * @param {import("../types").ComponentProps} props
 * @returns {import("../types").Component}
 */
export default function Component(tag, props) {
  const {
    children = EMPTY_LIST,
    className = '',
    classList = {},
    html = false,
    key = '',
    events = EMPTY_OBJECT,
    attrs = EMPTY_OBJECT,
    style = EMPTY_OBJECT,
    ns,
    onMount = noop,
    onDestroy = noop,
  } = props || EMPTY_OBJECT
  this.children = children
  this.key = key || uuid()
  const create = ns
    ? (tag) => document.createElementNS(ns, tag)
    : (tag) => document.createElement(tag)
  /** @type {HTMLElement} */
  const element = (this[internalRef] = create(tag))

  if (key) element.setAttribute(DATA_ITERATION_KEY, key)
  if (className) factoryAssignment(element, 'className', className)
  factoryClassList(element, classList)
  factoryEvents(element, events)
  factoryAttrs(element, attrs, !!ns)
  factoryStyles(element, style)
  factoryLifecycle(this, element, { onMount, onDestroy })

  ObservableState.observeSync(
    ObservableState.observeTransform([children]),
    (node) => {
      if (PRIMITIVE_TYPES.includes(typeof node)) {
        element[html ? 'innerHTML' : 'innerText'] = node
      } else {
        /** @type {Array<import("../types").Component|any>} */
        const nodes = []
          .concat(node || EMPTY_LIST)
          .filter((item) => typeof item !== 'number')
        const existingChildren = Array.from(element.children)
        existingChildren.forEach((child) => {
          const isNotPresent = !nodes.some(
            ({ key }) => key === child.getAttribute(DATA_ITERATION_KEY),
          )
          if (isNotPresent) {
            child.parentNode.removeChild(child)
          }
        })
        if (!nodes.forEach) debugger
        nodes.forEach((node) => {
          const isNotPresent = !existingChildren.some(
            (child) => node.key === child.getAttribute(DATA_ITERATION_KEY),
          )
          if (isNotPresent) {
            setParent(node, this)
          }
        })
      }
    },
    isSameChildren,
  )
}

Component.prototype.bootstrap = bootstrap
Component.prototype.node = node
Component.build = build

function node() {
  return this[internalRef]
}

function build(tag, ns, children) {
  return factoryNode(
    tag,
    ns,
    children.map(([candidate, childNs, childChildren]) =>
      childChildren
        ? build(candidate, childNs, childChildren)
        : factoryNode(candidate, childNs),
    ),
  )
}

function factoryNode(props, ns, children) {
  if (typeof props === 'string') {
    return new Component(props, { ns, children })
  }
  const { tag, ...options } = props
  return new Component(tag, {
    ...options,
    ns,
    children,
  })
}

/**
 * Initialize component in DOM
 * @param {HTMLElement} root
 * @returns {HTMLElement} - the component HTMLElement
 */
function bootstrap(root) {
  setParent(this, { [internalRef]: root })

  return this[internalRef]
}

/**
 * Append element to parent
 * @param {import("../types").Component} element
 * @param {import("../types").Component} parent
 * @returns {void}
 */
function setParent(element, parent) {
  parent[internalRef].appendChild(element[internalRef])
}
