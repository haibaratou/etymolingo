/* Four-picture listening rounds. No puzzle save data or generated content. */
((root) => {
  'use strict';
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[.!?。！？]+$/, '').trim();
  const mentions = (sentence, word) => new RegExp('(^|[^a-z])' + normalize(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z]|$)').test(normalize(sentence));
  function shuffled(items, random = Math.random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.min(i, Math.max(0, Math.floor(random() * (i + 1))));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function eligibleCatalog(words, reviewed, offline) {
    const ids = new Map();
    for (const word of words) ids.set(word?.id, (ids.get(word?.id) || 0) + 1);
    return words.filter(word => ids.get(word?.id) === 1 && reviewed.supportsLanguage(word, 'en') &&
      reviewed.validCaption(word) && offline.canPlay(word));
  }
  // Same artwork, headword or sentence cannot appear twice in one question.
  function distinct(word, choices) {
    return choices.every(other => other.id !== word.id && other.image.path !== word.image.path &&
      other.image.sha256 !== word.image.sha256 && normalize(other.en) !== normalize(word.en) &&
      normalize(other.description.en) !== normalize(word.description.en) &&
      !mentions(other.description.en, word.en) && !mentions(word.description.en, other.en));
  }
  function chooseRound(words, previousId, random = Math.random) {
    const candidates = shuffled(words, random);
    for (const target of [...candidates.filter(word => word.id !== previousId), ...candidates.filter(word => word.id === previousId)]) {
      const choices = [target];
      for (const word of candidates) if (distinct(word, choices)) {
        choices.push(word);
        if (choices.length === 4) break;
      }
      if (choices.length !== 4) continue;
      const ordered = shuffled(choices, random);
      return { target, choices: ordered, answerIndex: ordered.indexOf(target) };
    }
    return null;
  }
  class Session {
    constructor({ words, prepare, speech, random = Math.random }) {
      Object.assign(this, { words, prepare, speech, random });
      this.failed = new Set(); this.serial = 0; this.number = 0;
      this.round = null; this.state = 'loading'; this.heard = false; this.answer = null;
    }
    async next() {
      const serial = ++this.serial, previousId = this.round?.target.id;
      this.speech.stop(); this.state = 'loading'; this.heard = false; this.answer = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        const round = chooseRound(this.words.filter(word => !this.failed.has(word.id)), previousId, this.random);
        if (!round) break;
        const prepared = await Promise.all(round.choices.map(word => Promise.resolve().then(() => this.prepare(word)).catch(() => null)));
        if (serial !== this.serial) return false;
        const bad = prepared.map((result, i) => result?.status === 'reviewed' && result.playable === true &&
          result.ttsAllowed === true && result.imageVerified === true && typeof result.imageURL === 'string' &&
          result.entry?.w === round.choices[i].en && result.entry?.art === round.choices[i].pic &&
          JSON.stringify(result.entry?.p) === JSON.stringify(round.choices[i].roots) &&
          result.entry?.scene?.en === round.choices[i].description.en ? -1 : i).filter(i => i >= 0);
        if (!bad.length) {
          this.round = { ...round, prepared }; this.number++; this.state = 'playing'; return true;
        }
        for (const i of bad) this.failed.add(round.choices[i].id);
        if (bad.length === 4) break; // A stale dataset must not trigger a whole-catalog download.
      }
      if (serial === this.serial) { this.round = null; this.state = 'error'; }
      return false;
    }
    replay() {
      if (!this.round || !['playing', 'answered'].includes(this.state)) return false;
      const ok = this.speech.speakScene(this.round.target, this.round.prepared[this.round.answerIndex], 'en');
      if (ok) this.heard = true;
      return ok;
    }
    choose(index) {
      if (this.state !== 'playing' || !this.heard || !Number.isInteger(index) || index < 0 || index >= 4) return null;
      this.speech.stop();
      this.answer = { index, correct: index === this.round.answerIndex };
      this.state = 'answered';
      return this.answer;
    }
    stop() { this.serial++; this.speech.stop(); }
  }
  const api = { normalize, mentions, distinct, eligibleCatalog, chooseRound, Session };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PictlingoListeningCore = api;
})(typeof window === 'undefined' ? globalThis : window);
