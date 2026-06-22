const CACHE = 'convrt-v3';
const PRECACHE = [
  './index.html',
  './style.css',
  './manifest.json',
  './js/main.js',
  './js/dom.js',
  './js/i18n.js',
  './js/state.js',
  './js/toast.js',
  './js/settings.js',
  './js/faq.js',
  './js/dock.js',
  './js/carousel.js',
  './js/gif-worker.js',
  './js/helpers.js',
  './js/sw-update.js',
  './js/install-prompt.js',
  './js/network-indicator.js',
  './js/converters/image.js',
  './js/converters/pdf.js',
  './js/converters/word.js',
  './js/converters/video-gif.js',
  './js/converters/bg-remove.js',
  './js/converters/url-download.js',
  './js/bg-worker.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).catch(() => {})
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => {
      self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      });
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response(null, { status: 503, statusText: 'Offline' }));
    })
  );
});
