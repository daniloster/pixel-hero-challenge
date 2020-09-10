import Component from '../ui/Component'
import CSS from '../ui/CSS'
import Icon from './Icon'

const className = new CSS('icon-button')
className.scope(
  `
  --size: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
  border: 0;
  outline: none;
  font-size: var(--size);
`,
)
className.scope('i', 'color: #411eb7; cursor: pointer; font-size: inherit;')

export default function IconButton(props = {}) {
  new Component('button', {
    ...props,
    attrs: { type: 'button', ...(!!props.attrs ? props.attrs : {}) },
    children: [new Icon({ name: props.name })],
    className: `${className} ${
      props.className ? props.className.toString() : ''
    }`,
    style: {
      '--size': props.size || '3rem',
      ...(!!props.style ? props.style : {}),
    },
  })
}
