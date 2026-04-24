const CACHE_NAME = 'amazing-grace-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/logo.svg',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/icon-512-maskable.png',
    '/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Only cache same-origin GET requests to avoid errors with non-GET or cross-origin/opaque responses
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network First strategy to ensure updates are seen
    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.ok) {
                const clone = response.clone();
                event.waitUntil(
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {})
                );
            }
            return response;
        }).catch(() => caches.match(event.request))
    );
});
