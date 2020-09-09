import Message from '../../common/components/Message'
import ObservableState from '../../common/ObservableState'
import history from '../../common/router/history'
import Service from '../../common/Service'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import { serializeMap } from '../../MapEditor/Tilemap'
import GamePlay from '../GamePlay'

const className = new CSS('game-play-by-id')
className.scope(`
  display: flex;
  flex-direction: row;
  flex-flow: wrap;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  width: 100%;
`)
className.scope(
  '> div',
  `
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  flex-flow: wrap;
`,
)

export default function GamePlayById({ id }) {
  const map = ObservableState.create(null)
  const error = ObservableState.create(null)
  Service.getMap(id)
    .then((value) => {
      map.set(() => value.tilemap)
    })
    .catch(() => {
      error.set(() => `Sorry, we could not load the map [${id}].`)
    })

  return new Component('div', {
    className,
    key: id,
    children: ObservableState.observeTransformSync(map, (mapValue) => {
      if (mapValue) {
        const gamePlay = new GamePlay({
          viewport: {
            width: () => window.innerWidth,
            height: () => {
              console.log({
                height: window.innerHeight,
                top: gamePlay.node().offsetTop,
              })
              return window.innerHeight - gamePlay.node().offsetTop * 2
            },
          },
          serialized: ObservableState.observeTransform(
            [mapValue],
            serializeMap,
          ),
          isMapEditor: false,
          onExit: () => {
            gamePlay.restart()
            history.push('/')
          },
        })
        gamePlay.restart()

        return [gamePlay]
      }
      return new Component('div', {
        children: [
          new Message({ message: 'Loading secret map...' }),
          new Message({ message: error, isError: true }),
        ],
      })
    }),
  })
}
