class Subject {
  constructor() {
    this.subscribers = []
  }

  next(value) {
    this.subscribers.forEach((subscriber) => {
      subscriber.next(value)
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

function ObservableState() {}
ObservableState.prototype.get = () => null
ObservableState.prototype.set = () => null
ObservableState.prototype.subscribe = (subscriber) => () => null
ObservableState.observe = observe
ObservableState.observeTransform = observeTransform
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

function observe(value, next) {
  const currentStates = []
  const subscribers = []
  ;(Array.isArray(value) ? value : [value]).forEach((item, indexChain) => {
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
            // const transformCall = next || (() => newValues)
            next(...newValues)
          },
        }),
      )
    }
  })
  const stateValues = currentStates.map((get) => get())

  // console.log({ stateValues })
  next(...stateValues)

  return () => subscribers.forEach(({ unsubscribe }) => unsubscribe())
}

function observeTransform(observableChain, transform) {
  const observable = ObservableState.create(null)
  observable.unsubscribe = observe(observableChain, (...values) => {
    observable.set((old) => (transform || ((v) => v))(...values, old))
  })

  return observable
}
