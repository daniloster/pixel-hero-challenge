import CSS from './ui/CSS'

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
  observe: (
    value: T | ObservableState<T>,
    subscriber: Subscriber<T>,
  ) => Subscription
  observeTransform: (
    value: T | ObservableState<T>,
    subscriber: Subscriber<T>,
  ) => ObservableState<K>
}

export interface Events {
  blur: EventListener | ObservableState<EventListener>
  click: EventListener | ObservableState<EventListener>
}

export interface Attrs {
  [key: string]: any | ObservableState<any>
}

export type Node = Array<Component | string>

export interface ComponentProps {
  attrs: Attrs
  attrs: Attrs
  classList:
    | { [key: string]: boolean }
    | ObservableState<{ [key: string]: boolean }>
  className: string | ObservableState<string> | CSS
  key: string
  children: Node | ObservableState<Node>
  events: Events
}
export interface Component {
  node: () => HTMLElement
  bootstrap: (root: HTMLElement) => HTMLElement
  children: Node | ObservableState<Node>
  tag: string
}

export interface ModalProps {
  children: Node | ObservableState<Node>
  /**
   * @default false
   */
  isInitiallyOpen?: boolean
  onClose: () => void
  onOpen: () => void
}

export interface Modal {
  state: ObservableState<boolean>
  open: () => void
  close: () => void
}
