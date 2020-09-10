import ObservableState from '../ObservableState'
import Component from '../ui/Component'
import CSS from '../ui/CSS'

const className = new CSS('button')
className.scope(
  // 'padding: 0.5rem; border: 0; background-color: transparent; outline: none; transition: background-color 0.1s ease-in;',
  `
    --bg-color: #92CD41;
    --shadow-color: #4AA52E;
    --hover-color: #76c442;
    background: var(--bg-color);
    display: inline-block;
    position: relative;
    text-align: center;
    font-size: 30px;
    padding: 20px;
    font-family: 'Press Start 2P', cursive;
    text-decoration: none;
    color: white;
    box-shadow: inset -4px -4px 0px 0px var(--shadow-color);
  `,
)
className.modifier(
  [':hover', ':focus'],
  `
  background: var(--hover-color);
  box-shadow: inset -6px -6px 0px 0px var(--shadow-color);
`,
)
className.modifier(
  ':active',
  `
  box-shadow: inset 4px 4px 0px 0px var(--shadow-color);
`,
)
className.modifier(
  [':before', ':after'],
  `
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: content-box;
`,
)
className.modifier(
  ':before',
  `
  top: -6px;
  left: 0;
  border-top: 6px black solid;
  border-bottom: 6px black solid;
`,
)
className.modifier(
  ':after',
  `
  left: -6px;
  top: 0;
  border-left: 6px black solid;
  border-right: 6px black solid;
`,
)
className.modifier(
  '.danger',
  `
  --bg-color: #E76E55;
  --shadow-color: #8C2022;
  --hover-color: #CE372B;
`,
)
className.modifier(
  '.warning',
  `
  --bg-color: #F7D51D;
  --shadow-color: #E59400;
  --hover-color: #F2C409;
`,
)

export default function Button(props = {}) {
  new Component('button', {
    ...props,
    className: `${className} ${props.className || ''}`.trim(),
    classList: ObservableState.observeTransform(
      [props.state, props.classList],
      (state, classList) => ({
        [className.for(state)]: true,
        ...classList,
      }),
    ),
    attrs: { type: 'button', ...props.attrs },
  })
}
