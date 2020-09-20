import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'
import routerState from './routerState'

/**
 * Parse the URI into regex to capture groups
 * e.g. /path/{id}/list |
 * @param {string} path
 * @returns {[RegExp, string[]]}
 */
function toRegExp(uri) {
  const groups = uri.matchAll(/\{(?<param>[^}$]*)/gi)
  let group
  let path = uri.replace(/\//g, '\\/')
  const paramKeys = []
  while ((group = groups.next()).value && !group.done) {
    const param = group.value.groups.param
    if (paramKeys.includes(param)) {
      throw new Error(
        `You cannot have multiple parameters with same identification. e.g. "${param}"`,
      )
    }
    path = path.replace(`{${param}}`, `(?<${param}>[^\\/$]*)`)
    paramKeys.push(param)
  }
  return [new RegExp(`${path}$`, 'gi'), paramKeys]
}

/**
 * Creates params out of the current path
 * @param {string} currentPath
 * @param {string} path
 * @returns {{ [key: string]: string }}
 */
function toParams(currentPath, path) {
  const [regex, paramKeys] = toRegExp(path)
  const groups = currentPath.matchAll(regex)
  let group
  let index = 0
  const params = {}
  while ((group = groups.next()).value && !group.done) {
    const paramKey = paramKeys[index]
    if (paramKey) {
      const paramValue = group.value.groups[paramKey]
      params[paramKeys] = paramValue
    }
  }

  return params
}

const className = new CSS('route')
className.scope('display: none;')
className.modifier('.is-active', 'display: block;')

export default function Route({ path, factoryPage }) {
  const route = ObservableState.observeTransform(routerState, (currentPath) => [
    path === currentPath || toRegExp(path)[0].test(currentPath),
    currentPath,
  ])
  const params = ObservableState.observeTransform(
    route,
    ([isActive, currentPath]) => toParams(currentPath, path),
  )
  let component = null

  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(route, ([isActive]) => ({
      [className.for('is-active')]: isActive,
    })),
    children: ObservableState.observeTransform(route, ([isActive]) => {
      if (isActive) {
        if (!component) {
          component = factoryPage({ params })
        }
        return [component]
      }

      return []
    }),
  })
}
