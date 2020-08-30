import ObservableState from '../../ObservableState'

export default function factoryClassList(element, observable) {
  return ObservableState.observe(observable, (newValue) => {
    Object.entries(newValue).forEach(([currentClassName, isPresent]) => {
      element.classList[isPresent ? 'add' : 'remove'](currentClassName)
    })
  })
}
