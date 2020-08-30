import noop from './noop'
import factoryAssignment from './reactive/factoryAssignment'
import factoryAttrs from './reactive/factoryAttrs'
import factoryClassList from './reactive/factoryClassList'
import factoryEvents, {
  DESTROY_EVENT_ID,
  MOUNT_EVENT_ID,
} from './reactive/factoryEvents'
import ObservableState from './reactive/ObservableState'
import walkThroughTree from './walkThroughTree'

const internalRef = Symbol('element')
const EMPTY_LIST = []
const EMPTY_OBJECT = {}
const PRIMITIVE_TYPES = ['string', 'number']
const DATA_ITERATION_KEY = 'data-iteration-key'
/**
 * @typedef {Events}
 * @property {EventHandler} click
 * @property {EventHandler} blur
 */
/**
 * @typedef {Attrs}
 * @property {any|ObservableState} [string]
 */

/**
 * @typedef {Props}
 * @property {Attrs} attrs
 * @property {import("./types").ObservableState|{[key:string]: boolean}} classList
 * @property {CSS|string} className
 * @property {string} key
 * @property {Array<Component>|string} children
 * @property {Events} events
 */

/**
 * Component base
 * @param {string} tag
 * @param {Props} props
 * @returns {Component}
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
    ns,
    onMount = noop,
    onDestroy = noop,
  } = props || EMPTY_OBJECT
  this.children = children
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

  this.onMount = () => {
    onMount()
    // ...
  }

  this.onDestroy = () => {
    onDestroy()
    // ...
  }

  element.addEventListener(MOUNT_EVENT_ID, (e) => {
    e.preventDefault()
    walkThroughTree([this], (component) => component.onMount())
  })

  element.addEventListener(DESTROY_EVENT_ID, (e) => {
    e.preventDefault()
    walkThroughTree([this], (component) => component.onDestroy())
  })

  if (children instanceof ObservableState) {
    ObservableState.observe(children, (node) => {
      if (PRIMITIVE_TYPES.includes(typeof node)) {
        element[html ? 'innerHTML' : 'innerText'] = node
      } else {
        /** @type {Array<Component>} */
        const nodes = (Array.isArray(node || EMPTY_LIST)
          ? node || EMPTY_LIST
          : [node]
        ).filter((item) => typeof item !== 'number')
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
    })
  } else {
    if (PRIMITIVE_TYPES.includes(typeof children)) {
      element[html ? 'innerHTML' : 'innerText'] = children
    } else {
      children.forEach((node) => {
        setParent(node, this)
      })
    }
  }
}

Component.prototype.bootstrap = bootstrap
Component.build = build

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
 * @typedef Component
 * @param {HTMLElement} [internalRef]
 * @param {Function(root: HTMLElement): HTMLElement} bootstrap
 * @property {Array<Component>} children
 */

/**
 *
 * @param {Component} element
 * @param {Component} parent
 */
function setParent(element, parent) {
  parent[internalRef].appendChild(element[internalRef])
}
