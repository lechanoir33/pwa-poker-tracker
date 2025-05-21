const CACHE_NAME = 'pwa-poker-tracker-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Lorsque le service worker est installé
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE).catch((error) => {
        console.error('Erreur lors de la mise en cache des fichiers :', error);
      });
    })
  );
});

// Lorsque les fichiers sont demandés, répondre avec le cache ou le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Si la ressource est en cache, on la renvoie
        return cachedResponse;
      }
      // Sinon, on va essayer de la récupérer depuis le réseau
      return fetch(event.request).catch(() => {
        // Si la requête échoue, renvoyer une page de secours (ex : offline.html)
        return caches.match('/offline.html');
      });
    })
  );
});
