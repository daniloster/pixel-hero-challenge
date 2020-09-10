import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('message')
className.scope('')
className.modifier('.is-error', 'color: red;')

export default function Message({ message, isError = false }) {
  return new Component('p', {
    className,
    children: message,
    classList: {
      [className.for('is-error')]: isError,
    },
    style: {
      display: ObservableState.observeTransform(message, (val) =>
        !!val ? 'block' : 'none',
      ),
    },
  })
}
