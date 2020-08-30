import ObservableState from '../../ObservableState'

export default function factoryAssignment(element, property, observable) {
  return ObservableState.observe(observable, (newValue) => {
    element[property] = newValue
  })
}
