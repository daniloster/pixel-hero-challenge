import Component from './common/ui/Component'
import CSS from './common/ui/CSS'
import MapEditor from './MapEditor/MapEditor'

CSS.animation('pulse')
  .step('0%', 'transform: scale(1);')
  .step('50%', 'transform: scale(1.3);')
  .step('100%', 'transform: scale(1);')
  .build()

CSS.animation('fly-stand')
  .step('0%', 'transform: scale(1);')
  .step('50%', 'transform: scale(1.02);')
  .step('100%', 'transform: scale(1);')
  .build()

CSS.animation('fly-move')
  .step('0%', 'transform: translateY(7px);')
  .step('50%', 'transform: translateY(-5px);')
  .step('100%', 'transform: translateY(0px);')
  .build()

CSS.animation('pulse-color')
  .preset(
    `
  --pulse-color: white;
  --pulse-min-scale: 0.95;
  --pulse-max-scale: 1;
  `,
  )
  .step(
    '0%',
    `
  transform: scale(var(--pulse-min-scale));
  box-shadow: 0 0 0 0 var(--pulse-color);
  opacity: 0.7;
  `,
  )
  .step(
    '80%',
    `
  transform: scale(var(--pulse-max-scale));
  box-shadow: 0 0 0 10px var(--pulse-color);
  opacity: 0;
  `,
  )
  .step(
    '100%',
    `
  transform: scale(var(--pulse-min-scale));
  box-shadow: 0 0 0 0 var(--pulse-color);
  opacity: 0;
  `,
  )
  .build()

const className = new CSS('container')
className.scope('padding: 0.5rem;')
className.scope('h1', 'padding: 0 0 1.5rem 0;')

export default function PixelHero() {
  return new Component('div', {
    className,
    children: [
      new Component('h1', { children: 'Pixel Hero' }),
      new MapEditor(),
    ],
  })
}
