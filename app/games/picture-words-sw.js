/* Offline shell and explicitly saved illustration pack. Other games pass through. */
const CACHE = 'nicolingo-offline-v2';
const SHELL = ['picture-words.html', ...['style.css','catalog.js','difficulty.js','gesture.js','pronunciation.js','progression.js','offline.js','game.js','manifest.webmanifest'].map(name => 'picture-words/' + name)];
const shellPaths = new Set(SHELL.map(path => new URL(path, self.location).pathname));
self.addEventListener('install', event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL.map(path => new Request(new URL(path, self.location), {cache:'reload'})));
  await self.skipWaiting();
})()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;
  if (url.searchParams.has('connection-check')) return; // A real network probe, never a cached success.
  const shell = shellPaths.has(url.pathname);
  const art = url.pathname.startsWith(new URL('../../assets/word/', self.location).pathname) && url.pathname.endsWith('.png');
  if (!shell && !art) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE), key = new Request(url.origin + url.pathname);
    if (art) { const saved = await cache.match(key); if (saved) return saved; }
    try {
      const response = await fetch(shell ? new Request(event.request, {cache:'no-cache'}) : event.request);
      if (!response.ok) throw new Error('Unavailable');
      try { if (shell) await cache.put(key, response.clone()); } catch { /* Quota must not break online play. */ }
      return response;
    } catch {
      const saved = await cache.match(key);
      return saved || Response.error();
    }
  })());
});
