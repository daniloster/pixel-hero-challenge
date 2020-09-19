const CACHE_NAME = 'pixel-hero-v1'
const whitelistedFiles = [
  'index.html',
  'offline.html',
  'index.js',
  'manifest.json',
]

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install')
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all: whitelisted app content')
        return cache.addAll(whitelistedFiles)
      })
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Fetch', e.request.url)
  e.respondWith(
    caches
      .match(e.request)
      .then(() => fetch(e.request).catch(() => caches.match('offline.html'))),
  )
})

self.addEventListener('activate', (e) => {
  console.log('[Service Worker] Activate')
  const cacheWhitelisted = [CACHE_NAME]

  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelisted.includes(cacheName)) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
})
