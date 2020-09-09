import ObservableState from './common/ObservableState'
import Link from './common/router/Link'
import Router from './common/router/Router'
import Service from './common/Service'
import Component from './common/ui/Component'
import CSS from './common/ui/CSS'
import GamePlayById from './GamePlay/views/GamePlayById'
import ListingMaps from './ListingMaps/ListingMaps'
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

CSS.animation('modal-in')
  .step('0%', 'transform: scale(0.1); opacity: 0;')
  .step('100%', 'transform: scale(1); opacity: 1;')
  .build()

CSS.animation('modal-out')
  .step('0%', 'transform: scale(1); opacity: 1;')
  .step('100%', 'transform: scale(0.1); opacity: 0;')
  .build()

const className = new CSS('pixel-hero')
className.modifier('.loaded .loading', 'display: none;')
className.modifier('.loaded .game', 'display: block;')
className.scope('.loading', 'display: block;')
className.scope('.game', 'display: none; padding: 0.5rem 0;')
className.scope('.game a:not(:last-child)', 'margin-right: 1rem;')
className.scope('padding: 0.5rem;')
className.scope('h1', 'padding: 0 0 1.5rem 0;')

export default function PixelHero() {
  const state = ObservableState.create('loading')

  Service.init(state)
  Service.syncCountMaps()

  return new Component('div', {
    className: ObservableState.observeTransform(
      state,
      (newState) => `${className} ${newState}`,
    ),
    children: [
      new Component('h1', { children: 'Pixel Hero' }),
      new Component('div', {
        className: 'game',
        children: [
          new Link({ to: '/', children: 'Challenges' }),
          new Link({ to: '/editor', children: 'Create Map' }),
        ],
      }),
      new Component('div', {
        className: 'game',
        children: [
          new Router({
            routes: [
              ['/', () => new ListingMaps()],
              ['/editor', () => new MapEditor()],
              [
                '/challenge/{id}',
                ({ params }) => new GamePlayById({ id: params.id }),
              ],
            ],
          }),
        ],
      }),
      new Component('div', {
        className: 'loading',
        children: 'Loading...',
      }),
    ],
  })
}
