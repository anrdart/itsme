// Service Worker untuk caching efektif
const CACHE_NAME = 'itsme-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Aset yang akan di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/src/main.js',
  '/src/style.css',
  '/img/profile.png',
  '/img/skills/reactjs.svg',
  '/img/skills/nextjs.svg',
  '/img/skills/laravel.svg',
  '/img/skills/python.svg',
  '/img/skills/flutter.svg',
  '/img/skills/tailwindcss.svg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache
          return cachedResponse;
        }

        // Network request with dynamic caching
        return fetch(request)
          .then(networkResponse => {
            // Clone response for caching
            const responseClone = networkResponse.clone();

            // Cache dynamic content
            if (networkResponse.status === 200) {
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(request, responseClone);
                });
            }

            return networkResponse;
          })
          .catch(() => {
            // Fallback for offline
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for performance
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks
      console.log('Service Worker: Background sync')
    );
  }
});

// Push notifications (optional)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/img/favicon/android-chrome-192x192.png',
      badge: '/img/favicon/favicon-32x32.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});