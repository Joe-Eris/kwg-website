const CACHE_NAME = 'kwgm-shell-v3-youtube';

const APP_SHELL = [
  './',
  './index.html',
  './about.html',
  './contact.html',
  './funds.html',
  './form.html',
  './ussd.html',
  './videos.html',
  './offline.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/js/about.js',
  './assets/js/contact.js',
  './assets/js/pwa.js',
  './assets/js/videos-youtube.js',
  './assets/images/logo.png',
  './assets/images/hero-worship.webp',
  './assets/images/white-bible.webp',
  './assets/images/dangote.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* Do not try to cache YouTube or other cross-origin media streams. */
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('./offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
