class Subject {
  constructor() {
    this.subscribers = []
  }

  next(value) {
    setTimeout(() => {
      this.subscribers.forEach((subscriber) => {
        subscriber.next(value)
      })
    })
  }

  subscribe(subscriber) {
    const self = this
    self.subscribers.push(subscriber)

    return {
      unsubscribe: () => {
        self.subscribers = self.subscribers.filter((s) => s !== subscriber)
      },
    }
  }
}

export default ObservableState

/** @type {import("./types").ObservableState} */
function ObservableState() {}

ObservableState.prototype.get = () => null
ObservableState.prototype.set = () => null
ObservableState.prototype.subscribe = (subscriber) => () => null
ObservableState.observe = (value, next) => observe(value, next, false)
ObservableState.observeSync = (value, next, hash) => observe(value, next, hash)
ObservableState.observeTransform = (observableChain, transform) =>
  observeTransform(observableChain, transform, false)
ObservableState.observeTransformSync = (observableChain, transform, hash) =>
  observeTransform(observableChain, transform, hash)
/**
 * @param {T} initialValue
 * @returns {import('@daniloster/i18n/lib/types').ObservableState<T>}
 * @template T
 */
ObservableState.create = (initialValue) => {
  let value = initialValue
  const subject = new Subject()
  const observableState = new ObservableState()

  observableState.get = () => value
  observableState.set = (transformer) => {
    const newValue = transformer(value)
    if (value !== newValue) {
      value = newValue
      subject.next(value)
    }
  }
  observableState.subscribe = (subscriber) => subject.subscribe(subscriber)
  return observableState
}

function isEqual(node, oldNode, hash) {
  if (oldNode === undefined) {
    return false
  }

  const nodes = [].concat(node)
  const oldNodes = [].concat(oldNode)

  const hashedNodes = !!hash && hash(nodes)
  const hashedOldNodes = !!hash && hash(oldNodes)
  const same =
    nodes.length === oldNodes.length &&
    hashedNodes !== '' &&
    hashedOldNodes !== '' &&
    hashedNodes === hashedOldNodes

  return same
}

function observe(value, next, hash) {
  let oldValues = undefined
  const currentStates = []
  const subscribers = []
  const values = Array.isArray(value) ? value : [value]
  values.forEach((item, indexChain) => {
    /** @type {import("./types").ObservableState} */
    const observableCandidate = item
    const isObservable = observableCandidate instanceof ObservableState
    currentStates.push(
      isObservable ? observableCandidate.get : () => observableCandidate,
    )

    if (isObservable) {
      subscribers.push(
        observableCandidate.subscribe({
          next: (newValue) => {
            const newValues = currentStates.map((get, index) =>
              index === indexChain ? newValue : get(),
            )
            if (!hash || !isEqual(newValues, oldValues, hash)) {
              next(...newValues)
            }
            oldValues = newValues
          },
        }),
      )
    }
  })
  const stateValues = currentStates.map((get) => get())

  next(...stateValues)

  return {
    unsubscribe: () => subscribers.forEach(({ unsubscribe }) => unsubscribe()),
  }
}

function observeTransform(observableChain, transform, hash) {
  const observable = ObservableState.create(null)
  observable.unsubscribe = observe(
    observableChain,
    (...values) => {
      observable.set((old) => (transform || ((v) => v))(...values, old))
    },
    hash,
  )

  return observable
}
