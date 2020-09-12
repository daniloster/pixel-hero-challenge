import ObservableState from '../ObservableState'
import getRandomHash from './getRandomHash'
import random from './random'

const RandomPrefix = getRandomHash()

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
  this.mapClasses = {}
  /** @type {HTMLElement} */
  this.styleMarkup = document.createElement('style')
  this.styleMarkup.setAttribute('id', this.className)
  init(this.styleMarkup)
}

CSS.prototype.with = function (...args) {
  return args
    .map((className) =>
      Array.isArray(className) ? className.join(' ') : this.for(className),
    )
    .concat(this.className)
    .join(' ')
}

CSS.prototype.toString = function toString() {
  init(this.styleMarkup)
  return this.className.trim()
}

CSS.prototype.for = function (className) {
  if (!className.trim()) {
    return className
  }

  const pureClassName = clearClassNotation(className).trim()
  if (!this.mapClasses[pureClassName]) {
    this.mapClasses[pureClassName] = `${this.className}_${pureClassName}`
  }

  return className.replace(pureClassName, this.mapClasses[pureClassName])
}

/**
 * Adds scoped styles
 * @param  {string} selector - when style is not present, selector is supposed to be style
 * @param  {string} style
 */
CSS.prototype.scope = function (...args) {
  return applyStyle.apply(this, [(value) => value, ' '].concat(args))
}

/**
 * Adds scoped styles to pseudo element or class modifiers
 * @param  {string} selector - when style is not present, selector is supposed to be style
 * @param  {string} style
 */
CSS.prototype.modifier = function (...args) {
  if (args.length < 2) {
    throw new Error(`[CSS] modifier require (selector: string, style: string)`)
  }
  return applyStyle.apply(this, [(value) => value, ''].concat(args))
}

/**
 * Adds scoped styles to pseudo element or class modifiers
 * @param  {string} selector - when style is not present, selector is supposed to be style
 * @param  {string} style
 */
CSS.prototype.media = function (media, ...args) {
  if (args.length < 2) {
    throw new Error(
      `[CSS] media require (media: string, selector?: string, style: string)`,
    )
  }
  return applyStyle.apply(
    this,
    [
      (value) => `@media ${media} { ${value} }`,
      args.length === 2 ? '' : ' ',
    ].concat(args),
  )
}

function applyStyle(...args) {
  let [wrap, separator, selector, style] = args
  // if style is not present, selector gets styles
  if (!style) {
    style = selector
    selector = ''
  }
  selector = Array.isArray(selector) ? selector : [selector]
  const index = this.styles.length
  const namespace = this.className.trim()
  this.styles.push('')

  ObservableState.observeTransform(style || selector, (value) => {
    this.styles[index] = `${selector
      .map(
        (itemSelector) =>
          `.${namespace}${separator}${parseItemSelector(
            this,
            itemSelector.trim(),
          )}`,
      )
      .join(', ')
      .trim()} { ${value} }`
    this.styleMarkup.innerHTML = wrap(this.styles.join('\n\n'))
  })
}

function clearClassNotation(className) {
  return className.replace(/^\./g, '')
}

function parseItemSelector(self, itemSelector) {
  console.log({ itemSelector })
  return itemSelector
    .split('.')
    .map((current, index) =>
      (index === 0 && itemSelector.indexOf(current) === 0) ||
      !/^[a-z]/gi.test(current)
        ? current
        : self.for(current),
    )
    .join('.')
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

/**
 * Refreshes animation on element
 * @param  {HTMLElement} element
 * @returns {void}
 */
CSS.refreshAnimation = function refreshAnimation(element, className) {
  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
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
