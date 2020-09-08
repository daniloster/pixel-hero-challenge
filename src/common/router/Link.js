import ObservableState from '../ObservableState'
import Component from '../ui/Component'

export default function Link(props) {
  return new Component('a', {
    ...props,
    attrs: {
      ...props?.attrs,
      href: ObservableState.observeTransform(props.to, (href) => `#${href}`),
    },
  })
}
