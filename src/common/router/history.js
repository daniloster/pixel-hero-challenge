import routerState from './routerState'

function push(path) {
  location.hash = path
}

function onChange(callback) {
  return routerState.subscribe({
    next: callback,
  })
}

export default {
  push,
  onChange,
}
