/* Add numeric Weblio learning levels to the legacy explorer without rewriting its embedded 12 MB HTML. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || !/\/etymon-explorer\.html$/.test(location.pathname)) return;
  const source = document.createElement('script');
  source.src = new URL('data/generated-etymon/weblio-learning-levels.js?v=47f938f8294e', document.baseURI).href;
  source.async = true;
  source.onload = () => {
    const payload = window.ETYMON_WEBLIO_LEVELS;
    if (payload?.scheme !== 'Weblio' || !Array.isArray(payload.entries)) return;
    const levels = new Map();
    for (const entry of payload.entries) {
      if (typeof entry.w === 'string' && Number.isInteger(entry.level) && entry.level >= 1 && entry.level <= 30) {
        levels.set(entry.w, entry.level);
      }
    }
    function attach() {
      const wrap = document.getElementById('tableWrap');
      if (!wrap) return;
      const css = document.createElement('style');
      css.textContent = 'th.cWeblio,td.cWeblio{min-width:70px;text-align:center;white-space:nowrap;font-variant-numeric:tabular-nums}td.cWeblio{font-weight:700}';
      document.head.append(css);
      function sync() {
        const header = wrap.querySelector('thead tr');
        const kanaHeading = header?.querySelector('th.cK');
        if (kanaHeading && !header.querySelector('th.cWeblio')) {
          const th = document.createElement('th');
          th.className = 'cWeblio';
          th.textContent = 'Weblio Lv';
          th.title = 'Weblio学習レベル（1～30）。値が未確認の場合は空欄';
          kanaHeading.after(th);
        }
        for (const tr of wrap.querySelectorAll('tbody tr[data-i]')) {
          if (tr.querySelector('td.cWeblio')) continue;
          const kana = tr.querySelector('td.cK');
          const word = tr.querySelector('td.cW .spk')?.dataset.say;
          if (!kana || !word) continue;
          const td = document.createElement('td');
          td.className = 'cWeblio';
          td.textContent = levels.has(word) ? String(levels.get(word)) : '';
          kana.after(td);
        }
      }
      new MutationObserver(sync).observe(wrap, { childList: true, subtree: true });
      sync();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach, { once: true });
    else attach();
  };
  document.head.append(source);
})();
