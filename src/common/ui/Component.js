import noop from '../noop'
import ObservableState from '../ObservableState'
import getRandomHash from './getRandomHash'
import random from './random'
import factoryAssignment from './reactive/factoryAssignment'
import factoryAttrs from './reactive/factoryAttrs'
import factoryClassList from './reactive/factoryClassList'
import factoryEvents, {
  DESTROY_EVENT_ID,
  MOUNT_EVENT_ID,
} from './reactive/factoryEvents'
import walkThroughTree from './walkThroughTree'

export const internalRef = Symbol('element')
const EMPTY_LIST = []
const EMPTY_OBJECT = {}
const PRIMITIVE_TYPES = ['string', 'number']
const DATA_ITERATION_KEY = 'data-iteration-key'

const RandomHash = getRandomHash()

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
    ns,
    onMount = noop,
    onDestroy = noop,
  } = props || EMPTY_OBJECT
  this.children = children
  this.key =
    key ||
    `${RandomHash[random(100)]}-${RandomHash[random(100)]}-${random(
      10000,
    )}-${random(10000)}`
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
  ObservableState.observeSync(
    ObservableState.observeTransform([children]),
    (node) => {
      console.log({ children: [].concat(node || EMPTY_LIST) })
      if (PRIMITIVE_TYPES.includes(typeof node)) {
        element[html ? 'innerHTML' : 'innerText'] = node
      } else {
        /** @type {Array<Component|any>} */
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
 * @param {Component} element
 * @param {Component} parent
 * @returns {void}
 */
function setParent(element, parent) {
  parent[internalRef].appendChild(element[internalRef])
}
