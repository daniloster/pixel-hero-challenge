# Pixel Hero Challenge

[Play the game here](https://pixel-hero-challenge.web.app/)

Big thanks to the [NES.css](https://nostalgic-css.github.io/NES.css) which allow me give a nice and friendly look and feel.

This project started from [js13kgames](https://js13kgames.com/) which consists in building a web game within 13Kb. I got a point where it was working and it had 12Kb, and my goal was evolving as I was getting more and more excited with the challenge.

I have decided to drop the initial challenge and add more capabilities which would increase the bundle size overall. 2 killer additions were firebase and popperjs. These easily pushed the game far beyond the 13Kb. Not a big deal, and still happy with the result.

The good stuff happened in the journey. I got a minimal setup which allowed me to build web applications with observable states.

As a matter of reference, you may find this setup at

- `src/common/ObservableState.js`
- `src/common/ui/*`
- `src/common/router/*`

And their types at `src/common/types.d.ts`

## What is the game?

The game is a user creation of [Sokoban](https://en.wikipedia.org/wiki/Sokoban). The goal is to move the purple boxes into the portal station. When the user has all the purple boxes on the portal station the game move to the finished state.

One of the funniest parts of this game is that users can create their own map and send to friends. When creating a map, the user needs to proof
that the map is doable by playing it and finishing it.

The application is hosted at firebase and can be located at [https://pixel-hero-challenge.web.app/](https://pixel-hero-challenge.web.app/).

## Dev

**Pulling and running**
Pull this repo, install the dependencies by either `npm install` or `yarn install`, then run the app with `yarn start`.

## Building with no framework

### ObservableState

`src/common/ObservableState.js`

The whole application is based on observable states. There are writable and read-only states.

The first is a state created.

```js
const cart = ObservableState.create([
  { productId: 1, quantity: 3, value: 15, name: 'rice' },
])
```

The last is a state derived.

```js
const total = ObservableState.observeTransform(cart, (cartValues) =>
  cartValues.reduce(
    (totalItems, { quantity, value }) => totalItems + quantity * value,
    0,
  ),
)
```

Every time cart is updated, the total is updated by chaining execution. So, how does it happen?

### How derived states are updated?

Every time a observable state is created `ObservableState.create(...)`, a `Subject` is created within its [closure](http://codeinbox.me/posts/what-is-a-closure).

The result of `create` is a `WritableObservableState` which is defined by the following API.

```ts
interface ObservableState<T> {
  get: () => T
  subscribe: (subscriber: Subscriber<T>) => Subscription
}

interface WritableObservableState<T> extends ObservableState<T> {
  set: (transformer: TransformerState<T>) => void
}
```

This API allows the state to be subscribed through `subscribe` method. Then, every change through `set` triggers the subscribers passing the new value.

**Note**: very important to be aware that only changes in fact notifies subscribers. This mean that a state with string `"Foo"` is set to `"Foo"`, it won't triggers the notifications.

Ok... But, where does the `Subject` fits in?

When a state is subscribed, indeed, it is the `Subject` created within the closure who is subscribed by delegation. Every state create has a subject associated.

```js
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
```

Now that ObservableState is explained, we can deal with components.

### Component

`src/common/ui/Component.js`

The UI is based on this fella. All the attributes, events, classes and children of the component assume that value associated could be a `ObservableState` and it reads its value through either `observe` function or `observeTransform`. By this, it is created a chain of execution through the observable states and the UI elements.

Basically, **UI is derived from state**.

Regarding components, you may think, what about styles, and that is more than fair. In the `common/ui/` realm, there is a `CSS` and `StyleBuilder` classes for objects which allow definition of namespaced styles and inject them into the DOM when the application is loaded.

Reference: `src/common/ui/CSS.js` and `src/common/ui/StyleBuilder.js`

This structure served well for the job, nonetheless, there is always room for improvements.

## Room for improvements

- Dynamic style scoped

The `CSS` and `StyleBuilder` can be associated with ObservableStates, but, in this case, it overrides the `style` tag with new definitions based on the updates. Ideally, these dynamic styles should have its own style tag and be removed when the component is destroy.

- Better event handler for mount and destroy lifecycle

Currently, these are performed when the element is added to the DOM, and when it is removed. But, it feels flaky and could be sharpened.
