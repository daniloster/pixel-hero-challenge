import Confetti from './common/Confetti'
import ObservableState from './common/ObservableState'
import history from './common/router/history'
import Link from './common/router/Link'
import Router from './common/router/Router'
import Service from './common/Service'
import Component from './common/ui/Component'
import CSS from './common/ui/CSS'
import StyleBuilder from './common/ui/StyleBuilder'
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

CSS.global`
    html, body {
      max-height: 100vh;
      // background: lightgray;
    }
    *:not(.fa):not(.nes-icon) {
      font-family: 'Press Start 2P', cursive;
    }
    #canvas {
      display: none;
      position: absolute;
      z-index: 1;
      pointer-events: none;
    }
    .nes-btn.showcode {
      position: absolute;
      font-size: 12px;
      bottom: 0px;
      right: -4px;
    }
`

const className = new StyleBuilder('pixel-hero')
className`
  padding: 0.5rem;
  `.scope('h1')`
    padding: 0 0 1rem 0;
    margin: 0;
    color: #F2B409;
    `
className.scope('> *', 'width: 100%;')
className.scope('.game')`
  display: none;
  padding: 0.5rem 0;
  `.modifier('.navigation > *:not(:last-child)')`
    padding: 0 1rem 0 0;
    border-right: 1px solid;
    `
  .pop()
  .scope('a:not(:last-child)')`
    margin-right: 1rem;
    `
className.modifier('.loaded').scope('.loading')`
    display: none;
    `
  .pop()
  .scope('.game')`
    display: block;
    `
className.scope('.loading')`
display: block;
`

export default function PixelHero() {
  const state = ObservableState.create('loading')

  Service.init(state)
  Service.syncCountMaps()

  history.onChange((pathname) => {
    if (!/^\/challenge\//gi.test(pathname)) {
      Confetti.stop()
    }
  })

  return new Component('div', {
    className: ObservableState.observeTransform(
      state,
      (newState) => `${className} ${className.for(newState)}`,
    ),
    children: [
      new Component('div', {
        children: '<span style="font-size: 0.2rem;">v1.8</span>',
        html: true,
      }),
      new Component('h1', { children: 'Pixel Hero' }),
      new Component('div', {
        className: className.with('game', 'navigation'),
        children: [
          new Link({ to: '/', children: 'Challenges' }),
          new Link({ to: '/editor', children: 'Create Map' }),
        ],
      }),
      new Component('div', {
        className: className.for('game'),
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
        className: className.for('loading'),
        children: 'Loading...',
      }),
    ],
  })
}
