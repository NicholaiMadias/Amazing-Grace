const CACHE_NAME = 'amazing-grace-v3';

// Merged assets from both branches to ensure PWA icons and Game Logic are cached
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/logo.svg',
    '/assets/logo.png',
    '/assets/icon-192.png',
    '/assets/icon-512.png',
    '/assets/icon-512-maskable.png',
    '/manifest.json',
    '/matchMakerState.js',
    '/match-maker-ui.js',
    '/badges.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Arcade Cache Opened');
            return cache.addAll(ASSETS_TO_CACHE);
        })
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
    // Only cache same-origin GET requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network First strategy: Fresh data for the mission, fallback to cache if offline
    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.status === 200) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => caches.match(event.request))
    );
});
