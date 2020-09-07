import countMaps from '../countMaps'
import { convertTileToToken, convertTokenToTile } from '../MapEditor/Tilemap'
import uid from '../uid'
import ObservableState from './ObservableState'

const ROW_SEPARATOR = '|'
const COLUMN_SEPARATOR = '+'
const CELL_SEPARATOR = ''
const PAGE_SIZE = 10

function init(state) {
  firebase.auth().signInAnonymously()
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      state.set(() => 'loaded')
      uid.set(() => user.uid)
    } else {
      firebase.auth().signInAnonymously()
      uid.set(() => user.uid)
    }
  })
}

function serializeMapAsId(map) {
  const tilemap = map || []
  return tilemap
    .map((columns) =>
      columns
        .map((cells) => cells.map(convertTileToToken).join(CELL_SEPARATOR))
        .join(COLUMN_SEPARATOR),
    )
    .join(ROW_SEPARATOR)
}

function deserializeMapFromId(mapHashed) {
  return mapHashed
    .split(ROW_SEPARATOR)
    .map((columns) =>
      columns
        .split(COLUMN_SEPARATOR)
        .map((cells) => cells.split(CELL_SEPARATOR).map(convertTokenToTile)),
    )
}

function saveMap(map) {
  return new Promise((resolve, reject) => {
    const rows = map.length
    const columns = (map[0] || []).length
    const dimension = rows * columns
    const serialized = serializeMapAsId(map)
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        const key = firebase.database().ref('maps/').push({}).key
        firebase
          .database()
          .ref('saved_maps/' + serialized)
          .set({ uid: uidValue, key })
          .then(() => {
            firebase
              .database()
              .ref('maps/' + key)
              .set({
                uid: uidValue,
                id: key,
                dimension,
                serialized,
                score: 1,
                timestamp: Date.now(),
              })
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      }
    })
  })
}

function syncCountMaps() {
  return new Promise((resolve, reject) => {
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        firebase
          .database()
          .ref('maps')
          .on('value')
          .then((snapshot) => {
            countMaps.set(() => snapshot.numChildren())
          })
          .catch(reject)
      }
    })
  })
}

function listMaps(page = 0, total) {
  return new Promise((resolve, reject) => {
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        firebase
          .database()
          .ref('maps')
          // .endAt(page * PAGE_SIZE)
          .limitToLast(PAGE_SIZE)
          .once('value')
          .then((snapshot) => {
            resolve(Object.values(snapshot.val()))
          })
          .catch(reject)
      }
    })
  })
}

//   [
//     [['None'], ['RescuableBlock'], ['RescuePoint']],
//     [['None'], ['Player'], ['None']],
//     [['None'], ['MoveableBlock'], ['None']],
//   ]

export default {
  init,
  syncCountMaps,
  listMaps,
  saveMap,
}
