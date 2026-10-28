/* Legacy compatibility entrypoint: Weblio Lv moved into the star-rating detail dialog.
   No visible numeric Weblio column is injected here. */
(() => {
  'use strict';
  if(typeof document==='undefined'||!/\/vocabulary-master\.html$/.test(location.pathname))return;
  if(window.__etyExplorerStarsInitialized)return;
  const script=document.createElement('script');
  script.src=new URL('explorer-numeric-columns.js?v=stars-20261025',document.currentScript.src).href;
  document.head.append(script);
})();
