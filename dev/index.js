import PixelHeroMinimal from 'pixel-hero'
import pwa from 'worker!pixel-hero/common/pwa'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(pwa)
    .then((reg) => console.log('[Service Worker] | Success: ', reg.scope))
    .catch((err) => console.log('[Service Worker] | Failure: ', err))
}

window.addEventListener('DOMContentLoaded', () => {
  const rootMinimal = document.createElement('div')
  document.body.appendChild(rootMinimal)

  new PixelHeroMinimal().bootstrap(rootMinimal)
})
