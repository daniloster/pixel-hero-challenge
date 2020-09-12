// import MapInput from './MapInput'
import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'

const className = new CSS('validation-messages')
className.scope('color: red; width: 100%;')

export default function ValidationMessages({
  className: extClassName,
  messages,
}) {
  return new Component('div', {
    className: className.with([extClassName]),
    children: [
      new Component('ul', {
        children: ObservableState.observeTransform(messages, (values) =>
          values.map((value) => new Component('li', { children: value })),
        ),
      }),
    ],
  })
}
