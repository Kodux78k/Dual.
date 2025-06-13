
const CACHE_NAME = 'dualchat-cache-v1';
const FILES_TO_CACHE = [
  './',
  './dual-chat-0-94-15-fix-72-2.html',
  './manifest.json'
  './index.html'
  './splash.html'
  './data/Superfetch.json'
  './data/site-structure.json'


];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
