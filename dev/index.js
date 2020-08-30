import PixelHeroMinimal from 'pixel-hero'

window.addEventListener('DOMContentLoaded', () => {
  const rootMinimal = document.createElement('div')
  document.body.appendChild(rootMinimal)

  new PixelHeroMinimal().bootstrap(rootMinimal)
})
