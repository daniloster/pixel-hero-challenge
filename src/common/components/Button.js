import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('button')
className.scope('padding: 6px;')
className.scope(
  'button',
  `
    --bg-color: #92CD41;
    --shadow-color: #4AA52E;
    --hover-color: #76c442;
    background: var(--bg-color);
    display: inline-block;
    position: relative;
    text-align: center;
    padding: 1.5rem;
    font-family: 'Press Start 2P', cursive;
    cursor: pointer;
    text-decoration: none;
    outline: none;
    color: white;
    box-shadow: inset -4px -4px 0px 0px var(--shadow-color);
  `,
)
className.scope(
  ['button:hover', 'button:focus'],
  `
  background: var(--hover-color);
  box-shadow: inset -6px -6px 0px 0px var(--shadow-color);
`,
)
className.scope(
  'button:active',
  `
  box-shadow: inset 4px 4px 0px 0px var(--shadow-color);
`,
)
className.scope(
  ['button:before', 'button:after'],
  `
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: content-box;
`,
)
className.scope(
  'button:before',
  `
  top: -6px;
  left: 0;
  border-top: 6px black solid;
  border-bottom: 6px black solid;
`,
)
className.scope(
  'button:after',
  `
  left: -6px;
  top: 0;
  border-left: 6px black solid;
  border-right: 6px black solid;
`,
)
className.scope(
  '.danger',
  `
  --bg-color: #E76E55;
  --shadow-color: #8C2022;
  --hover-color: #CE372B;
`,
)
className.scope(
  '.warning',
  `
  --bg-color: #F7D51D;
  --shadow-color: #E59400;
  --hover-color: #F2C409;
`,
)

export default function Button(props = {}) {
  return new Component('div', {
    className,
    children: [
      new Component('button', {
        ...props,
        classList: ObservableState.observeTransform(
          [props.state, props.classList],
          (state, classList) => ({
            [className.for(state)]: true,
            ...(classList ? classList : {}),
          }),
        ),
        attrs: { type: 'button', ...(props.attrs ? props.attrs : {}) },
      }),
    ],
  })
}
