/* Share candidate choices without copying review comments or changing them. */
(() => {
  'use strict';
  const key = 'wildwordopia.root-candidate-review.v1';
  const keys = ['wildwordopia.root-candidate-review.top100-backup.v1',
    'wildwordopia.root-candidate-review.backup.v1', key];
  const frameName = 'wildwordopia-selection-bridge';
  const requestType = 'wildwordopia-selection-request-v1';
  const responseType = 'wildwordopia-selection-response-v1';
  const isBridge = window.parent !== window && window.name === frameName;

  function clean(value) {
    const result = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
    for (const [root, candidate] of Object.entries(value)) {
      if (/^[a-z][a-z0-9]*$/.test(root) && /^v\d{3,}$/.test(candidate)) result[root] = candidate;
    }
    if (!result.genu1 && result.genu) result.genu1 = result.genu;
    return result;
  }
  function read() {
    const previews = {};
    for (const storageKey of keys) {
      try { Object.assign(previews, clean(JSON.parse(localStorage.getItem(storageKey) || '{}').previews)); }
      catch { /* A damaged backup must not hide another valid saved choice. */ }
    }
    return clean(previews);
  }
  function query() {
    try { return clean(JSON.parse(new URLSearchParams(location.search).get('selected') || '{}')); }
    catch { return {}; }
  }
  window.WILDWORDOPIA_SELECTION_SYNC = {isBridge, read, query, connect};

  // Load the exact review URL so file-specific storage belongs to the review page.
  // Bridge mode never renders the gallery or writes/adopts review records.
  if (isBridge) {
    let token = null, previous = '';
    const send = () => {
      if (!token) return;
      const previews = read(), signature = JSON.stringify(previews);
      if (signature === previous) return;
      previous = signature;
      window.parent.postMessage({type:responseType, token, previews},
        location.protocol === 'file:' ? '*' : location.origin);
    };
    window.addEventListener('message', event => {
      if (event.source !== window.parent || event.data?.type !== requestType ||
          (location.protocol !== 'file:' && event.origin !== location.origin) ||
          typeof event.data.token !== 'string' || !/^[a-z0-9-]{16,100}$/i.test(event.data.token)) return;
      token = event.data.token; previous = ''; send();
    });
    window.addEventListener('storage', send);
    setInterval(send, 1000);
  }

  function connect(onChange) {
    window.addEventListener('storage', event => {
      if (keys.includes(event.key) || event.key === null) onChange(read());
    });
    window.addEventListener('focus', () => {
      if (location.protocol !== 'file:') onChange(read());
    });
    if (location.protocol !== 'file:') return;
    const attach = () => {
      const frame = document.createElement('iframe');
      const token = crypto.randomUUID();
      frame.name = frameName; frame.hidden = true; frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      frame.src = new URL('wildwordopia.html', location.href).href;
      window.addEventListener('message', event => {
        if (event.source === frame.contentWindow && event.data?.type === responseType &&
            event.data.token === token) onChange(clean(event.data.previews));
      });
      frame.addEventListener('load', () => frame.contentWindow.postMessage({type:requestType, token}, '*'));
      document.body.append(frame);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach, {once:true});
    else attach();
  }
})();
