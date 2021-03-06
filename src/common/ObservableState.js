export default ObservableState

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

/** @type {import("./types").ObservableState} */
function ObservableState() {}
ObservableState.prototype.get = () => null
ObservableState.prototype.subscribe = (subscriber) => () => null

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
ObservableState.observe = (value, next) => observe(value, next, false)
ObservableState.observeSync = (value, next, hash) => observe(value, next, hash)
ObservableState.observeTransform = (observableChain, transform) =>
  observeTransform(observableChain, transform, false)
ObservableState.observeTransformSync = (observableChain, transform, hash) =>
  observeTransform(observableChain, transform, hash)

function isEqual(node, oldNode, hash) {
  if (oldNode === undefined) {
    return false
  }

  const hashedNodes = !!hash && hash([].concat(node))
  const hashedOldNodes = !!hash && hash([].concat(oldNode))
  const same =
    node?.length === oldNode?.length &&
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

const setRef = Symbol('set')
function observeTransform(observableChain, transform, hash) {
  const observable = ObservableState.create(null)
  Object.defineProperty(observable, setRef, {
    writable: false,
    enumerable: false,
    configurable: false,
    value: observable.set,
  })
  delete observable.set
  observable.unsubscribe = observe(
    observableChain,
    (...values) => {
      observable[setRef]((old) => (transform || ((v) => v))(...values, old))
    },
    hash,
  )

  return observable
}
