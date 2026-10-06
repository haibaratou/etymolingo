/* All eligible images are bundled; playing never downloads image data. */
(() => {
  const ids=new Set(window.PICTLINGO_BUNDLED_IDS);
  const api={state:{online:false,supported:false},ready:async()=>api,refresh:async()=>{},canPlay:w=>ids.has(w.id),hasSavedScene:w=>ids.has(w.id)};
  window.NicolingoOffline=api;
})();