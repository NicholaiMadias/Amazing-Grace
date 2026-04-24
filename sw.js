const CACHE_NAME = 'amazing-grace-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/logo.png',
    '/matchMakerState.js',
    '/match-maker-ui.js',
    '/badges.js'
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
    // Network First strategy to ensure updates are seen
    event.respondWith(
        fetch(event.request).then(response => {
            if (response && response.ok) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
        }).catch(() => caches.match(event.request))
    );
});
