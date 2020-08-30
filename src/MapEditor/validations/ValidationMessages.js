// import MapInput from './MapInput'
import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'

const className = new CSS('container')
className.scope('color: red; width: 100%;')

export default function ValidationMessages({ messages }) {
  return new Component('div', {
    className,
    children: [
      new Component('ul', {
        children: ObservableState.observeTransform(messages, (values) =>
          values.map((value) => new Component('li', { children: value })),
        ),
      }),
    ],
  })
}
