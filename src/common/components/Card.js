import noop from '../noop'
import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('card')

export default function Card({ className: _className, children, button = {} }) {
  return new Component('section', {
    className: `${className} nes-container with-title`,
    children: [
      new Component('div', {
        className: `${className.for('content')} ${_className} item`,
        children: ObservableState.observeTransform(
          Array.isArray(children) ? [children] : children,
        ),
      }),
      new Component('button', {
        attrs: { type: 'button' },
        className: ObservableState.observeTransform(
          button.state,
          (state) => `nes-btn is-${state || 'primary'} showcode`,
        ),
        children: ObservableState.observeTransform(
          Array.isArray(button.children) ? [button.children] : button.children,
          (btnChildren) => btnChildren || '&lt;&gt;',
        ),
        events: {
          click: ObservableState.observeTransform(
            button.click,
            (click) => click || noop,
          ),
        },
      }),
    ],
  })
}
