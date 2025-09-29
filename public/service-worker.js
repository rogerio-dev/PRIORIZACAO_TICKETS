self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('fluig-suporte-cache').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
      });
    })
  );
});
