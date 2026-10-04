/* One bilingual pack, stored only after the player chooses to save it. */
((root) => {
  const CACHE = 'nicolingo-offline-v2';
  const state = {online:navigator.onLine, pictures:new Set(), supported:'serviceWorker' in navigator && 'caches' in root && root.isSecureContext};
  const artStem = word => word.pic + (/^[0-9a-f]{64}$/.test(word.imageRevision || '') ? '@' + word.imageRevision : '');
  const artURL = word => new URL('../../assets/word/' + encodeURIComponent(artStem(word)) + '.png', location.href).href;
  async function refresh() {
    if (!state.supported) return;
    const keys = await (await caches.open(CACHE)).keys();
    state.pictures = new Set(keys.filter(key => new URL(key.url).pathname.endsWith('.png')).map(key => decodeURIComponent(new URL(key.url).pathname.split('/').pop().slice(0,-4))));
  }
  function canPlay(word) { return (state.online && navigator.onLine) || state.pictures.has(artStem(word)); }
  async function bounded(task, milliseconds) {
    let timer;
    try { return await Promise.race([task, new Promise(resolve => { timer = setTimeout(resolve, milliseconds); })]); }
    finally { clearTimeout(timer); }
  }
  async function ready() {
    if (state.supported) {
      // Optional storage setup must never hold the game's event handlers hostage.
      Promise.resolve().then(() => navigator.serviceWorker.register('picture-words-sw.js', {scope:'./'}))
        .then(registration => { state.registration = registration; }).catch(() => {});
      await bounded(refresh().catch(() => {}), 500);
    }
    if (navigator.onLine && state.supported) {
      await bounded(Promise.resolve().then(() => fetch('picture-words.html?connection-check', {cache:'no-store'}))
        .catch(() => {
          // A failed probe is useful only when a saved fallback exists. A slow
          // connection or blocked probe must not disable ordinary online play.
          if (state.pictures.size) state.online = false;
        }), 500);
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
      state.pictures.add(artStem(word)); progress(++done, pack.length);
    }
    return done;
  }
  root.addEventListener('offline', () => { state.online = false; refresh().catch(() => {}); });
  root.addEventListener('online', () => { state.online = true; });
  const api = {state,ready,refresh,canPlay,save};
  root.NicolingoOffline = api;
})(window);
