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
      `${selector.trim()} ${nextSelector.trim()}`,
    )
  }
  shortcut.modifier = (nextSelector) => {
    validateSelector(nextSelector)
    return buildContext(
      shortcut,
      css,
      'modifier',
      `${selector.trim()}${nextSelector.trim()}`,
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

function validateSelector(selector) {
  if (!selector || !selector.trim()) {
    throw new Error(`[StyleBuilder] selector is required for builder`)
  }
}
