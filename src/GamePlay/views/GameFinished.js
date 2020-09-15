import Button from '../../common/components/Button'
import Message from '../../common/components/Message'
import copyToClipboard from '../../common/copyToClipboard'
import ObservableState from '../../common/ObservableState'
import Link from '../../common/router/Link'
import Service from '../../common/Service'
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
className.modifier('.url .share-url', 'display: block;')
className.scope(
  '.share-url',
  'word-break: keep-all; white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; display: none;',
)
className.scope('button', 'padding: 0.5rem;')
className.scope('.trophy', 'display: flex; justify-content: center;')
className.scope(
  '.large-icon',
  'margin: 0; transform: scale(17); transform-origin: center top;',
)

function createButton({ errorMessage, isMapEditor, url, serialized }) {
  return new Button({
    state: ObservableState.observeTransform(url, (text) =>
      text ? '' : 'warning',
    ),
    style: {
      display: ObservableState.observeTransform(
        errorMessage,
        (errorMessageText) =>
          !errorMessageText && isMapEditor ? 'block' : 'none',
      ),
      'align-self': 'center',
    },
    children: ObservableState.observeTransform(url, (text) =>
      !!text ? 'Copy' : 'Share',
    ),
    events: {
      click: ObservableState.observeTransform(
        serialized,
        (serializedMap) => (e) => {
          const text = url.get()
          if (text) {
            copyToClipboard(`${location.origin}/#${text}`)
          } else {
            Service.saveMap(JSON.parse(serializedMap))
              .then(({ id }) => {
                url.set(() => `/challenge/${id}`)
              })
              .catch((reason) => {
                if (reason) {
                  errorMessage.set(
                    () =>
                      'I guess this map already exists, trying creating another map...',
                  )
                }
              })
          }
        },
      ),
    },
  })
}

export default function GameFinished({
  state,
  serialized,
  isMapEditor,
  onExit,
}) {
  const errorMessage = ObservableState.create('')
  const url = ObservableState.create('')

  return new Component('div', {
    className,
    classList: ObservableState.observeTransform(
      [state, url, errorMessage],
      (value, urlText, errorMessageText) => {
        const finished = value.includes(GameState.Succeed)
        return {
          [className.for('finished')]: finished,
          [className.for('url')]: !!urlText,
          [className.for('error')]: !!errorMessageText,
        }
      },
    ),
    children: [
      new Component('div', {
        html: true,
        children: ObservableState.observeTransform(
          errorMessage,
          (errorMessageText) =>
            !errorMessageText && isMapEditor
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
        ),
      }),
      createButton({ errorMessage, isMapEditor, url, serialized }),
      new Component('div', {
        children: [
          new Message({ message: errorMessage, isError: true }),
          new Component('div', {
            className: className.for('share-url'),
            children: [
              new Component('p', {
                children: 'Copy and share with friends...',
              }),
              new Link({
                to: url,
                children: ObservableState.observeTransform(
                  url,
                  (urlText) => `${location.origin}/#${urlText}`,
                ),
                events: {
                  click: onExit,
                },
              }),
            ],
          }),
          new Component('div', {
            className: className.for('trophy'),
            children: [
              new Component('i', {
                className: `${className.for('large-icon')} nes-icon trophy`,
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
