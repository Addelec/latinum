/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'latinum-v1';
const ASSETS_CACHE = 'latinum-assets-v1';
const RUNTIME_CACHE = 'latinum-runtime-v1';

// Files to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    Promise.all([
      caches.open(ASSETS_CACHE).then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      }),
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Caching core files');
      })
    ]).then(() => {
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== ASSETS_CACHE &&
            cacheName !== RUNTIME_CACHE
          ) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and non-GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Cache-first strategy for assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg')
  ) {
    event.respondWith(
      (caches.match(request) as Promise<Response | undefined>).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(ASSETS_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Return a fallback if available
          return caches.match('/index.html') as Promise<Response | undefined>;
        }) as Promise<Response>;
      })
    );
    return;
  }

  // Network-first strategy for HTML and other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return (caches.match(request) as Promise<Response | undefined>).then((response) => {
          if (response) {
            return response;
          }
          // Fallback to offline page if available
          if (request.destination === 'document') {
            return caches.match('/index.html') as Promise<Response | undefined>;
          }
        }) as Promise<Response>;
      })
  );
});
