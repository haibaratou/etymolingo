/* One bilingual pack, stored only after the player chooses to save it. */
((root) => {
  const CACHE = 'nicolingo-offline-v2';
  const state = {online:navigator.onLine, pictures:new Set(), supported:'serviceWorker' in navigator && 'caches' in root && root.isSecureContext};
  const artURL = word => new URL('../../assets/word/' + encodeURIComponent(word.pic) + '.png', location.href).href;
  async function refresh() {
    if (!state.supported) return;
    const keys = await (await caches.open(CACHE)).keys();
    state.pictures = new Set(keys.filter(key => new URL(key.url).pathname.endsWith('.png')).map(key => decodeURIComponent(new URL(key.url).pathname.split('/').pop().slice(0,-4))));
  }
  function canPlay(word) { return (state.online && navigator.onLine) || state.pictures.has(word.pic); }
  async function ready() {
    if (state.supported) {
      try {
        const registration = await navigator.serviceWorker.register('picture-words-sw.js', {scope:'./'});
        state.registration = registration;
        await refresh();
      } catch { await refresh().catch(() => {}); }
    }
    if (navigator.onLine && state.supported) {
      try {
        await fetch('picture-words.html?connection-check', {cache:'no-store', signal:AbortSignal.timeout(2500)});
      } catch { state.online = false; }
    }
    return api;
  }
  async function save(words, progress) {
    if (!state.supported) throw new Error('unsupported');
    await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))]);
    const pool = words.filter(word => word.updatedArt && word.w && word.en);
    const candy = pool.find(word => word.en === 'candy');
    const pack = [candy, ...pool.filter(word => word !== candy)].filter(Boolean).slice(0,20);
    const cache = await caches.open(CACHE);
    let done = 0, bytes = 0;
    for (const word of pack) {
      const url = artURL(word);
      const cached = await cache.match(url);
      if (cached) {
        bytes += (await cached.blob()).size;
      } else {
        const response = await fetch(url, {signal:AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error('download');
        const announced = Number(response.headers.get('content-length'));
        if (announced && bytes + announced > 4500000) { await response.body?.cancel(); throw new Error('size'); }
        bytes += (await response.clone().blob()).size;
        if (bytes > 4500000) throw new Error('size');
        await cache.put(url, response);
      }
      state.pictures.add(word.pic); progress(++done, pack.length);
    }
    return done;
  }
  root.addEventListener('offline', () => { state.online = false; refresh().catch(() => {}); });
  root.addEventListener('online', () => { state.online = true; });
  const api = {state,ready,refresh,canPlay,save};
  root.NicolingoOffline = api;
})(window);
