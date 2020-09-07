import ObservableState from '../ObservableState'

export default ObservableState.create(location.hash || '#/')
