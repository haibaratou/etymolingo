// Generated compatibility view. Load before or after catalog.js; never copy stale rows into the game.
((root) => {
  'use strict';
  Object.defineProperty(root, 'PICTURE_WORDS_DICTIONARY_LINKS', {
    configurable: true,
    get() {
      const meta = root.PICTURE_WORDS_CATALOG_META, rows = root.PICTURE_WORDS_CATALOG;
      if (meta?.schema !== 2 || !Array.isArray(rows)) return Object.freeze([]);
      return Object.freeze(rows.filter(row => row.bindingStatus === 'bound'));
    }
  });
})(window);
