import ObservableState from './reactive/ObservableState'

function random(max) {
  return (Math.floor(Math.random() * max) * 7) % max
}

const RandomPrefix = Array.from({ length: 100 }).map((_, index) =>
  Array.from({ length: 10 })
    .map((_, index) => String.fromCharCode((Math.random() * 100) % 100) + index)
    .join('')
    .replace(/[\W]/gi, ''),
)

const globalStyles = []
const globalMarkup = document.createElement('style')
const pending = [globalMarkup]
let loaded = false
let count = 0

/**
 * Converts selector into unique hash
 * @param {string} selector
 */
export default function CSS(selector) {
  count += 1
  this.className = `c${RandomPrefix[random(100)]}_${
    RandomPrefix[random(100)]
  }__${selector}-${count}`
  this.styles = []
  /** @type {HTMLElement} */
  this.styleMarkup = document.createElement('style')
  init(this.styleMarkup)
}

CSS.prototype.toString = function toString() {
  init(this.styleMarkup)
  return this.className
}

/**
 * Adds scoped styles
 * @param  {string} selector - when style is not present, selector is supposed to be style
 * @param  {string} style
 */
CSS.prototype.scope = function scope(...args) {
  let [selector, style] = args
  // if style is not present, selector gets styles
  if (!style) {
    style = selector
    selector = ''
  }
  selector = Array.isArray(selector) ? selector : [selector]
  const index = this.styles.length
  this.styles.push('')

  ObservableState.observeTransform(style || selector, (value) => {
    this.styles[index] = `${selector
      .map((itemSelector) => ('.' + this.className + ' ' + itemSelector).trim())
      .join(', ')} { ${value} }`
    this.styleMarkup.innerHTML = this.styles.join('\n\n')
  })
}

/**
 * Adds scoped styles to pseudo element or class modifiers
 * @param  {string} selector - when style is not present, selector is supposed to be style
 * @param  {string} style
 */
CSS.prototype.modifier = function modifier(selector, style) {
  const index = this.styles.length
  this.styles.push('')
  const allSelector = Array.isArray(selector) ? selector : [selector]

  ObservableState.observeTransform(style, (value) => {
    this.styles[index] = `${allSelector
      .map((itemSelector) => '.' + this.className + itemSelector)
      .join(', ')} { ${value} }`
    this.styleMarkup.innerHTML = this.styles.join('\n\n')
  })
}

/**
 * Adds global styles
 * @param  {string} style
 */
CSS.global = function global(style) {
  const index = globalStyles.length
  globalStyles.push('')

  ObservableState.observeTransform(style, (style) => {
    globalStyles[index] = style
    globalMarkup.innerHTML = globalStyles.join('\n\n')
  })
}

CSS.animation = animation

/**
 * @typedef AnimationBuilder
 * @property {(preset: string) => AnimationBuilder} preset
 * @property {(step: string, styles: string) => AnimationBuilder} step
 * @property {() => void} build
 */

/**
 * Adds animation
 * @param  {string} name
 * @returns {AnimationBuilder}
 */
function animation(name) {
  const presets = []
  const animationSteps = []
  const builder = {
    preset: (preset) => {
      presets.push(preset)
      return builder
    },
    step: (step, styles) => {
      animationSteps.push(`${step} { ${styles} }`)
      return builder
    },
    build: () => {
      CSS.global(`
        body {
          ${presets.join('\n\n')}
        }

        @keyframes ${name} {
          ${animationSteps.join('\n\n')}
        }
      `)
    },
  }

  return builder
}

function init(styleMarkup) {
  if (loaded) {
    if (!styleMarkup.parentNode) {
      document.head.appendChild(styleMarkup)
    }
  } else {
    if (!pending.includes(styleMarkup)) {
      pending.push(styleMarkup)
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loaded = true
  pending.forEach((markup) => {
    init(markup)
  })
})
