import CSS from './CSS'

/**
 * Creates CSS object namespaced
 * @param {string} namespace
 * @returns {StyleBuilder}
 */
export default function StyleBuilder(namespace) {
  const css = new CSS(namespace)
  return buildContext(null, css, 'scope')
}

/**
 * @param {string} selector
 * @return {string}
 */
StyleBuilder.prototype.for = (nextSelector) => null
/**
 * @param {string} nextSelector
 * @return {StyleBuilder}
 */
StyleBuilder.prototype.scope = (nextSelector) => null
/**
 * @param {string} nextSelector
 * @return {StyleBuilder}
 */
StyleBuilder.prototype.modifier = (nextSelector) => null
/**
 * @param {string} nextSelector
 * @return {StyleBuilder}
 */
StyleBuilder.prototype.media = (nextSelector) => null

function buildContext(context, css, macro, selector = '') {
  /**
   * Apply styles to a context and return the context builder
   * @param {StyleSheet|string} styles
   * @returns {StyleBuilder}
   */
  const shortcut = (styles) => {
    const values = Array.isArray(styles) ? styles.join('').trim() : styles
    console.log({ context, css, macro, selector, styles: values })
    if (selector) {
      css[macro](selector, values)
      return shortcut
    } else {
      css[macro](values)
      return shortcut
    }
  }

  shortcut.scope = (nextSelector) => {
    validateSelector(nextSelector)
    return buildContext(
      shortcut,
      css,
      macro === 'modifier' ? macro : 'scope',
      combine(' ', selector, nextSelector),
    )
  }
  shortcut.modifier = (nextSelector) => {
    validateSelector(nextSelector)
    return buildContext(
      shortcut,
      css,
      'modifier',
      combine('', selector, nextSelector),
    )
  }
  shortcut.media = (nextSelector) => {
    validateSelector(nextSelector)
    return buildContext(shortcut, css, 'media', nextSelector.trim())
  }
  shortcut.for = (...args) => css.for(...args)
  shortcut.pop = () => (context ? context : shortcut)
  shortcut.toString = () => css.toString()

  return shortcut
}

function combine(separator, parentSelector, selector) {
  if (Array.isArray(parentSelector)) {
    return selector.map((current) => combine(separator, current, selector))
  }
  if (Array.isArray(selector)) {
    return selector.map((current) =>
      combine(separator, parentSelector, current),
    )
  }

  return `${parentSelector.trim()}${separator}${selector.trim()}`
}

function validateSelector(selector) {
  if (!Array.isArray(selector) && (!selector || !selector.trim())) {
    throw new Error(`[StyleBuilder] selector is required for builder`)
  }
}
