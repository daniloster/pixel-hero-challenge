import countMaps from '../countMaps'
import { convertTileToToken, convertTokenToTile } from '../MapEditor/Tilemap'
import uid from '../uid'
import ObservableState from './ObservableState'

const ROW_SEPARATOR = '+'
const COLUMN_SEPARATOR = ''
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

export function serializeMapAsId(map) {
  const tilemap = map || []
  return tilemap
    .map((columns) =>
      columns
        .map((cells) => convertTileToToken(cells.join(CELL_SEPARATOR)))
        .join(COLUMN_SEPARATOR),
    )
    .join(ROW_SEPARATOR)
}

export function deserializeMapFromId(mapHashed) {
  return mapHashed
    .split(ROW_SEPARATOR)
    .map((columns) =>
      columns
        .split(COLUMN_SEPARATOR)
        .map((cell) => [convertTokenToTile(Number(cell))]),
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
          .set({ uid: uidValue, key }, (error) => {
            if (error) {
              return reject(error)
            }

            const data = {
              uid: uidValue,
              id: key,
              dimension,
              serialized,
              score: 1,
              timestamp: Date.now(),
            }
            firebase
              .database()
              .ref('maps/' + key)
              .set(data, (error) => {
                if (error) {
                  return reject(error)
                }
                resolve(data)
              })
          })
      }
    })
  })
}

function syncCountMaps() {
  return new Promise((resolve) => {
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        firebase
          .database()
          .ref('maps')
          .on('value', (snapshot) => {
            const count = snapshot.numChildren()
            countMaps.set(() => count)
            resolve(count)
          })
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
          .limitToLast(PAGE_SIZE)
          .once('value', (snapshot) => {
            resolve(
              Object.values(snapshot.val()).map((mapDefinition) => ({
                ...mapDefinition,
                tilemap: deserializeMapFromId(mapDefinition.serialized),
              })),
            )
          })
      }
    })
  })
}

function getMap(id) {
  return new Promise((resolve, reject) => {
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        firebase
          .database()
          .ref('maps/' + id)
          .once('value', (snapshot) => {
            const map = snapshot.val()
            resolve({
              ...map,
              tilemap: deserializeMapFromId(map.serialized),
            })
          })
      }
    })
  })
}

function score(id) {
  return new Promise((resolve, reject) => {
    const unsubscriber = ObservableState.observe(uid, (uidValue) => {
      if (uidValue) {
        setTimeout(() => unsubscriber.unsubscribe())

        const userScoreRef = firebase
          .database()
          .ref(`users/${uidValue}/score/${id}`)
        userScoreRef.transaction(
          () => true,
          (errorUser, commitedUser) => {
            if (!errorUser && commitedUser) {
              const scoreRef = firebase.database().ref(`maps/${id}/score`)
              scoreRef.transaction(
                (score) => (score || 0) + 1,
                (error, committed) => {
                  if (error || !committed) {
                    console.error(error)
                    reject(error)
                  } else {
                    console.log('scored')
                    resolve()
                  }
                },
              )
            }
          },
        )
      }
    })
  })
}

export default {
  init,
  syncCountMaps,
  getMap,
  listMaps,
  saveMap,
  score,
}
