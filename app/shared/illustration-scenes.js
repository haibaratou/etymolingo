/* Image-bound bilingual explanations. Text is rendered only after visual-asset binding verifies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IllustrationScenes = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const normalized = value => String(value || '').normalize('NFKC').replace(/[‘’]/g, "'").replace(/[‐‑]/g, '-').trim().replace(/\s+/g, ' ');
  const firstJa = text => normalized(String(text || '').split('、')[0]);
  const firstEn = text => normalized(String(text || '').split(' / ')[0]);
  const identity = (w, p, art) => JSON.stringify([w, p || [], art]);
  const key = entry => identity(entry.w, entry.p, entry.art);
  const firstSenseMatches = (entry, word) => word && entry.w === word.w && JSON.stringify(entry.p) === JSON.stringify(word.p || []) && firstJa(word.ja) === normalized(entry.sense.ja) && firstEn(word.en) === normalized(entry.sense.en);
  const loads = new Map();
  async function load(url) {
    if (!loads.has(url)) loads.set(url, fetch(url, {cache:'no-cache'}).then(response => {
      if (!response.ok) throw new Error('Explanation data unavailable');
      return response.json();
    }).then(data => {
      if (data.schema !== 1 || !Array.isArray(data.entries)) throw new Error('Unsupported explanation schema');
      return data;
    }).catch(error => { loads.delete(url); throw error; }));
    return loads.get(url);
  }
  function find(data, word, art) {
    return data.entries.find(entry => key(entry) === identity(word.w, word.p, art)) || null;
  }
  async function verify(entry, options = {}) {
    if (!entry) return {status:'unreviewed',entry:null};
    const status = entry.status || entry.review?.status || 'unreviewed';
    if (status !== 'reviewed') return {status,entry};
    if (options.word && !firstSenseMatches(entry, options.word)) return {status:'stale_sense',entry};
    if (!/^[a-f0-9]{64}$/.test(entry.image?.sha256 || '') || !options.imageUrl) return {status:'unavailable',entry};
    try {
      // Revalidate the same URL used by the visible artwork. A replaced PNG cannot
      // inherit a previous picture's explanation, even if its filename is unchanged.
      const response = await fetch(options.imageUrl, {cache:'no-cache'});
      if (!response.ok || !globalThis.crypto?.subtle) return {status:'unavailable',entry};
      const bytes = await response.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const sha = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
      return {status:sha === entry.image.sha256 ? 'reviewed' : 'stale_image',entry};
    } catch { return {status:'unavailable',entry}; }
  }
  function render(container, result) {
    container.replaceChildren();
    container.classList.add('illustration-explanation');
    container.dataset.sceneStatus = result.status;
    const make = (tag, text, lang) => {
      const node = document.createElement(tag); node.textContent = text;
      if (lang) node.lang = lang;
      container.append(node); return node;
    };
    if (result.status === 'reviewed') {
      make('p', result.entry.scene.en, 'en');
      make('p', result.entry.scene.ja, 'ja');
    } else {
      const labels = {unreviewed:'イラスト解説は未作成・未確認です',mismatch:'語義との一致を確認中です',stale_image:'画像が更新されたため、解説を再確認中です',stale_sense:'語義が更新されたため、解説を再確認中です',missing_image:'対応する画像を確認できません',unavailable:'イラスト解説を確認できませんでした'};
      make('small', labels[result.status] || labels.unavailable).className = 'illustration-explanation-status';
    }
  }
  return {load,find,verify,render,key,firstSenseMatches};
});
