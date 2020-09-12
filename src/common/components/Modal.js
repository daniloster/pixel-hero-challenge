import noop from '../noop'
import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'
import useClickOutside from './useClickOutside'

const modals = document.createElement('div')
document.body.appendChild(modals)

const className = new CSS('modal')
className.scope(`
  display: none;
`)
className.modifier('.open', 'display: block; --animation-name: modal-in;')
className.modifier('.close', '--animation-name: modal-out;')
className.modifier('.animating', 'display: block;')

className.scope(
  '.overlay',
  `
position: fixed;
z-index: 1;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,.4);
`,
)

className.scope(
  '.container',
  `
position: fixed;
z-index: 2;
top: 0;
left: 0;
right: 0;
bottom: 0;

display: flex;
flex-direction: row;
flex-wrap: nowrap;
align-items: center;
justify-content: center;
`,
)

className.scope(
  '.content',
  `
  max-width: 90vw;
  max-height: 90vh;
  animation: var(--animation-name) 0.5s ease;

  background-color: #fff;
  box-shadow: 0 0 1rem 1px rgba(0, 0, 0, 0.4);
  padding: 1rem;
`,
)

/**
 * Modal component
 * @param {import("../types").ModalProps} props
 * @returns {import("../types").Modal}
 */
export default function Modal(props) {
  const {
    className: externalClassName = '',
    overlayClassName = '',
    containerClassName = '',
    contentClassName = '',
    children = [],
    isInitiallyOpen = false,
    onClose = noop,
    onOpen = noop,
  } = props || {}
  let animating = isInitiallyOpen
  const open = ObservableState.create(isInitiallyOpen)
  this.state = open
  this.onClose = onClose
  this.onOpen = onOpen
  /** @type {import("../types").Component} */
  const content = new Component('div', {
    className: `${className.for('content')} ${contentClassName}`,
    children: ObservableState.observeTransform(
      [open, children],
      (isOpen, childNodes) => (isOpen ? childNodes : []),
    ),
  })
  const unsubscribe = useClickOutside(
    content.node(),
    (e, isClickingOutside) => {
      if (isClickingOutside) {
        this.close()
      }
    },
  )
  const modal = new Component('div', {
    className: `${className} ${externalClassName}`,
    classList: ObservableState.observeTransform(open, (isOpen) => {
      animating = animating || isOpen
      return {
        [className.for('open')]: isOpen,
        [className.for('close')]: !isOpen,
        [className.for('animating')]: animating,
      }
    }),
    children: [
      new Component('div', {
        className: `${className.for('overlay')} ${overlayClassName}`,
      }),
      new Component('div', {
        className: `${className.for('container')} ${containerClassName}`,
        children: [content],
      }),
    ],
    $$onDestroy: () => {
      unsubscribe()
    },
  })
  modal.bootstrap(modals)
  modal.node().addEventListener('animationend', (e) => {
    /** @type {HTMLElement} */
    const el = e.target
    const animation = el.parentNode.parentNode
    const isClosing = animation.classList.contains(className.for('close'))
    if (isClosing) {
      animation.classList.remove(className.for('animating'))
    }
  })
  this.node = () => modal.node()
}

Modal.prototype.close = function close() {
  /** @type {import("../types").Modal} */
  const self = this
  self.state.set(() => false)
  self.onClose()
}
Modal.prototype.open = function open() {
  /** @type {import("../types").Modal} */
  const self = this
  self.state.set(() => true)
  self.onOpen()
  self.node().focus()
}
