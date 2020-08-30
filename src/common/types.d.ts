export interface Subscriber<T> {
  next(value: T): void
}

export interface Subscription {
  unsubscribe(): void
}

export interface Subject extends Subscriber<T> {
  private subscribers: Subscriber<T>[]
  subscribe(subscriber: Subscriber<T>): Subscription
}

export interface TransformerState<T> {
  (state: T): T
}

export interface ObservableState<T> {
  get: () => T
  set: (transformer: TransformerState<T>) => void
  subscribe: (subscriber: Subscriber<T>) => Subscription
}
