/* Public JSON over HTTP; generated classic scripts for direct file:// viewing. */
(function (root) {
  'use strict';
  const local = root.location.protocol === 'file:';
  const base = new URL('../../data/ja/', document.currentScript.src);
  const pending = new Map(), loaded = new Map();
  let manifestPromise, manifestWaiter;

  function script(url, accept) {
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.src = url.href;
      element.async = true;
      const finish = error => {
        clearTimeout(timer);
        element.remove();
        error ? reject(error) : resolve();
      };
      const timer = setTimeout(() => finish(new Error('データの読み込みがタイムアウトしました。')), 30000);
      element.onload = () => {
        try { accept(); finish(); } catch (error) { finish(error); }
      };
      element.onerror = () => finish(new Error('データファイルを読み込めません: ' + url.pathname));
      document.head.appendChild(element);
    });
  }

  function manifest() {
    if (!manifestPromise) {
      manifestPromise = (async () => {
        let value;
        manifestWaiter = data => { value = data; };
        try {
          await script(new URL('file/manifest.js', base), () => {
            if (!value || value.schema !== 1 || !value.index || !value.shards)
              throw new Error('ローカル閲覧用の索引情報が正しくありません。');
          });
          return value;
        } finally { manifestWaiter = null; }
      })().catch(error => { manifestPromise = null; throw error; });
    }
    return manifestPromise;
  }

  async function localData(key) {
    const meta = await manifest();
    const entry = key === 'index' ? meta.index : meta.shards[key];
    if (!entry || !/^[a-z0-9-]+\.js$/.test(entry.file) || !/^[a-f0-9]{64}$/.test(entry.sha256))
      throw new Error('ローカル閲覧用の本文情報がありません: ' + key);
    if (loaded.has(key)) return loaded.get(key);
    if (!pending.has(key)) {
      const state = { hash: entry.sha256, received: false, value: undefined };
      state.promise = script(new URL('file/' + entry.file, base), () => {
        if (!state.received) throw new Error('データの形式または世代が一致しません: ' + key);
        loaded.set(key, state.value);
      }).then(() => state.value).finally(() => pending.delete(key));
      pending.set(key, state);
    }
    return pending.get(key).promise;
  }

  async function json(path) {
    const response = await root.fetch(new URL(path, base));
    if (!response.ok) throw new Error('データを取得できませんでした (' + response.status + ')');
    return response.json();
  }

  root.JaDictData = Object.freeze({
    loadIndex: () => local ? localData('index') : json('ja_index.json'),
    loadShard: row => local ? localData(row) : json('ja_det/' + encodeURIComponent(row) + '.json'),
    registerManifest: value => { if (manifestWaiter) manifestWaiter(value); },
    register: (key, hash, value) => {
      const state = pending.get(key);
      if (state && state.hash === hash) {
        state.value = value;
        state.received = true;
      }
    }
  });
})(globalThis);
