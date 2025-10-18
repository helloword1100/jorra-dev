// Service Worker for PWA
const CACHE_NAME = "jorra-v2"
const urlsToCache = ["/", "/dashboard", "/gallery", "/profile"]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clonedResponse = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse)
        })
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      }),
  )
})
