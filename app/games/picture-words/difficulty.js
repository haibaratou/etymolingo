/* Shared word order: language switches keep the same illustration and rarity. */
((root) => {
  'use strict';
  const tiers = [
    { key: 'common', code: 'C', name: 'COMMON', ja: 'はじめの一歩', en: 'First steps', color: '#688b62', decoys: 1 },
    { key: 'uncommon', code: 'UC', name: 'UNCOMMON', ja: 'ひとつ上の挑戦', en: 'A step further', color: '#398b8b', decoys: 2 },
    { key: 'rare', code: 'R', name: 'RARE', ja: '手ごわいことば', en: 'Tricky words', color: '#527cbb', decoys: 3 },
    { key: 'epic', code: 'SR', name: 'EPIC', ja: 'むずかしいことば', en: 'Expert words', color: '#9466b3', decoys: 4 },
    { key: 'legendary', code: 'SSR', name: 'LEGENDARY', ja: 'ことばの達人', en: 'Word master', color: '#b88a35', decoys: 5 },
    { key: 'mythic', code: 'UR', name: 'MYTHIC', ja: '熟練のことば', en: 'Master spellings', color: '#bc617d', decoys: 6 },
    { key: 'extreme', code: 'EX', name: 'EXTREME', ja: '超難関のことば', en: 'Extreme vocabulary', color: '#6960ae', decoys: 6 },
    { key: 'master', code: 'Ω', name: 'BILINGUAL BOSS', ja: '熟語・最終試練', en: 'Compound word mastery', color: '#ad7440', decoys: 7 },
  ];
  const repeats = text => [...text].length - new Set([...text]).size;
  // A game-specific spelling score, not a language proficiency / frequency level.
  function wordScore(word) {
    const kana = [...word.w], english = [...word.en];
    const small = kana.filter(ch => 'ぁぃぅぇぉゃゅょっ'.includes(ch)).length;
    const voiced = kana.filter(ch => /[がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ]/.test(ch)).length;
    return kana.length * 2 + english.length + small * 2 + voiced * .5 + (repeats(word.w) + repeats(word.en)) * .6 + (word.challengeBand || 0) * 24;
  }
  function buildCatalog(words) {
    return words.map((word, sourceIndex) => ({ ...word, sourceIndex, difficultyScore: wordScore(word) }))
      .sort((a, b) => a.difficultyScore - b.difficultyScore || a.sourceIndex - b.sourceIndex)
      .map((word, order) => ({ ...word, order, tier: Math.min(tiers.length - 1, Math.floor(order / 10)) }));
  }
  function challenge(word, language) {
    const tier = tiers[word.tier], length = [...(language === 'ja' ? word.w : word.en)].length;
    const dual = length > 6;
    const innerCount = dual ? 6 : length;
    // Each language has exactly its own spelling's letters. No padding choices.
    const decoys = 0;
    return { ...tier, rank: word.tier + 1, length, choices: length + decoys, decoys, dual, innerCount, batches: dual ? 2 : 1 };
  }
  function resumeIndex(raw, old, original, ordered) {
    if (old.wordId) { const found = ordered.findIndex(word => word.id === old.wordId); if (found >= 0) return found; }
    if (!Number.isInteger(old.index)) return 0;
    const source = raw.routeVersion === 1 ? ordered : original;
    const id = source[Math.max(0, Math.min(source.length - 1, old.index))]?.id;
    return Math.max(0, ordered.findIndex(word => word.id === id));
  }
  const api = { tiers, wordScore, buildCatalog, challenge, resumeIndex };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WordBloomDifficulty = api;
})(typeof window === 'undefined' ? globalThis : window);
