import ObservableState from '../../common/ObservableState'
import Component from '../../common/ui/Component'
import CSS from '../../common/ui/CSS'
import GameState from '../GameState'

const className = new CSS('game-finished')
className.scope(
  `
padding: 0.5rem 0;
display: none;
flex-direction: column;
align-content: center;
justify-items: center;
`,
)

className.modifier('.finished', 'display: flex;')
className.modifier('.finished .share-url', 'display: block;')

export default function GameFinished({ state, map, isMapEditor }) {
  const shareURL = ObservableState.create('')
  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(state, (value) => {
      const finished = value.includes(GameState.Succeed)
      if (finished) {
        shareURL.set(() => null)
      }
      return {
        finished,
      }
    }),
    children: [
      new Component('div', {
        html: true,
        children: isMapEditor
          ? `
          <h3>
            Congratulations! You rock!
          </h3>
          <p>
            Click outside to close or share with friends.
          </p>
          `
          : `
          <h3>
            Congratulations! You rock!
          </h3>
          `,
      }),
      new Component('button', {
        attrs: { type: 'button' },
        style: { display: isMapEditor ? 'block' : 'none' },
        children: ObservableState.observeTransformSync(
          shareURL,
          (shareURLValue) => (shareURLValue ? 'Copy' : 'Share'),
        ),
        events: {
          click: (e) => {
            const url = shareURL.get()
            if (url) {
              copyToClipboard(url)
            } else {
              shareURL.set(() => hashMap(map.get().tilemap))
            }
          },
        },
      }),
      new Component('div', {
        children: ObservableState.observeTransformSync(
          shareURL,
          (shareURLValue) => {
            return shareURLValue ? `URL: ${shareURLValue}` : ''
          },
        ),
      }),
    ],
  })
}
