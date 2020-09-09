import ObservableState from '../../ObservableState'

const TOGGLE_ATTRS = ['selected', 'disabled']

export default function factoryAttrs(element, attrs, withNamespace) {
  const subscribers = []
  const setAttribute = withNamespace
    ? (attr, value) => element.setAttributeNS(null, attr, value)
    : (attr, value) => element.setAttribute(attr, value)
  const removeAttribute = withNamespace
    ? (attr) => element.removeAttributeNS(attr)
    : (attr) => element.removeAttribute(attr)
  Object.entries(attrs).forEach(([attribute, value]) => {
    subscribers.push(
      ObservableState.observe(value, (newValue) => {
        if (TOGGLE_ATTRS.includes(attribute) || value instanceof Boolean) {
          if (newValue) {
            setAttribute(attribute, newValue)
          } else {
            removeAttribute(attribute)
          }
        } else {
          setAttribute(attribute, newValue)
        }
      }),
    )
  })
  return {
    unsubscribe: () => subscribers.forEach(({ unsubscribe }) => unsubscribe()),
  }
}
