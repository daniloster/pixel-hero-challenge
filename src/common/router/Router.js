import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import Route from './Route'
import routerState from './routerState'

window.addEventListener('popstate', (event) => {
  const { isSynthetic, path } = event.state || {}
  const { hash } = location
  routerState.set(() => (isSynthetic ? '/#' + path : hash))
})

export default function Router({ routes: routesDefinition }) {
  return new Component('div', {
    children: ObservableState.observeTransform([routesDefinition], (routes) => {
      return routes.map(
        ([path, factoryPage]) => new Route({ path: `#${path}`, factoryPage }),
      )
    }),
  })
}
