import Component from '../common/Component'
import CSS from '../common/CSS'

export default function HeartIcon({ className: modifierClassName = '' }) {
  const HEART_COLOR = '#e90707'
  const className = new CSS('icon')
  className.scope('width: 100%; height: 100%;')
  className.scope(
    '> svg',
    `fill: ${HEART_COLOR}; position: relative; width: 100%; height: 100%;`,
  )
  const ns = 'http://www.w3.org/2000/svg'

  return new Component('div', {
    className: `${className} ${modifierClassName}`,
    children: [
      new Component('svg', {
        ns,
        attrs: {
          viewBox: '0 0 32 29.6',
        },
        children: [
          new Component('path', {
            ns,
            attrs: {
              d:
                'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2	c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z',
            },
          }),
        ],
      }),
    ],
  })
}
