// import MapInput from './MapInput'
import Component from '../../common/Component'
import CSS from '../../common/CSS'
import ObservableState from '../../common/reactive/ObservableState'

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
