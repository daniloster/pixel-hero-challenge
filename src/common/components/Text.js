import ObservableState from '../ObservableState'
import Component from '../ui/Component'

// state = primary | success | warning | error | disabled
export default function Text({ children, state }) {
  return new Component('div', {
    className: 'item',
    children: [
      new Component('span', {
        className: ObservableState.observeTransform(
          state,
          (value) => `nes-text is-${value}`,
        ),
        children: ObservableState.observeTransform(children),
      }),
    ],
  })
}
