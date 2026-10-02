/* WORD BLOOM — standalone play, browser voices, and a curated dictionary excerpt. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const originalCatalog = window.PICTURE_WORDS_CATALOG || [];
  const difficulty = window.WordBloomDifficulty;
  const catalog = difficulty.buildCatalog(originalCatalog);
  const { advanceSelection, sweptHits, activeBatch, canSelectRing, planLetters } = window.WordBloomGesture;
  const KEY = 'word-bloom-v1';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    ja: {
      gardens: ['はじまりの庭', 'おいしい小道', 'どうぶつの森', '暮らしのアトリエ', '自然のたからもの', 'まだ見ぬ世界へ'],
      title: 'この絵、なんのことば？', instruction: '文字をなぞって、つなげよう',
      release: '', note: '途中で離すとキャンセル',
      shuffle: 'まぜる', hint: 'ヒント', next: '次の単語をゲット', footer: '正解するたび、辞書が育つ。',
      collection: '日本語・英語の辞書', found: '単語ゲット',
      connect: 'つなぐ', undo: 'もどす', correct: '単語ゲット！', wrong: 'おしい！ もう一度つないでみよう',
      short: '最後の文字まで、つないでみよう', mix: '新しい並びで、ひらめこう',
      tap: '', soundOff: '音声と効果音をオフ', soundOn: '音声と効果音をオン',
      help: '遊び方', levels: '好きなところから、ひとつずつ。', choose: 'ステージを選ぶ', stageSelect: 'ステージ選択',
      close: '閉じる', error: 'イラストを読み込めませんでした', retry: 'もう一度読み込む', skip: '次の絵へ',
      completed: '庭いっぱいに、ことばが咲いた。', chapterComplete: 'ひとつの庭が、花いっぱいに。',
      replay: 'もう一度、庭を歩く', allHinted: 'ヒントの文字を、順番につなごう',
      saved: '獲得した単語が辞書の1ページに。', replayed: '獲得済みの単語です。ベストの星を保存しました。',
    },
    en: {
      gardens: ['The first garden', 'A tasty little path', 'Animal friends', 'Everyday wonders', 'Treasures of nature', 'A world to discover'],
      title: 'One picture. Which word?', instruction: 'Swipe the letters. Find the word.',
      release: '', note: 'Release an unfinished word to cancel',
      shuffle: 'Shuffle', hint: 'Hint', next: 'Collect the next word', footer: 'Every word fills another page.',
      collection: 'Your dictionaries', found: 'words collected',
      connect: 'connect', undo: 'undo', correct: 'WORD GET!', wrong: 'Almost! Give it another go.',
      short: 'Keep going to the last letter', mix: 'A fresh arrangement. A fresh idea.',
      tap: '', soundOff: 'Turn sound and voice off', soundOn: 'Turn sound and voice on',
      help: 'How to play', levels: 'A little wonder, wherever you begin.', choose: 'Choose a puzzle', stageSelect: 'STAGES',
      close: 'Close', error: 'This picture could not be loaded', retry: 'Try loading again', skip: 'Try the next picture',
      completed: 'A whole garden of words in bloom.', chapterComplete: 'Another garden, full of little wonders.',
      replay: 'Wander through again', allHinted: 'Connect the revealed letters in order',
      saved: 'A new page in your dictionary.', replayed: 'Already collected. Your best stars are saved.',
    },
  };

  function readSave() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { /* Storage is optional. */ }
    const value = { mode: raw.mode === 'en' ? 'en' : 'ja', sound: raw.sound !== false, theme: raw.theme === 'dark' ? 'dark' : 'light', layout: raw.layout === 'mobile' || raw.layout === 'desktop' ? raw.layout : 'auto', targetTier: Number.isInteger(raw.targetTier) && raw.targetTier >= 0 && raw.targetTier < difficulty.tiers.length ? raw.targetTier : 6, routeVersion: 1,
      combo: Number.isInteger(raw.combo) && raw.combo > 0 ? raw.combo : 0, bestCombo: Number.isInteger(raw.bestCombo) && raw.bestCombo > 0 ? raw.bestCombo : 0 };
    for (const lang of ['ja', 'en']) {
      const old = raw[lang] || {};
      const stars = {};
      for (const word of catalog) if ([1, 2, 3].includes(old.stars?.[word.id])) stars[word.id] = old.stars[word.id];
      value[lang] = { index: difficulty.resumeIndex(raw, old, originalCatalog, catalog), stars };
    }
    return value;
  }
  const saved = readSave();
  let mode = saved.mode;
  let index = saved[mode].index;
  let entry, answer = [], nodes = [], selected = [], hintCount = 0, mistakes = 0;
  let phase = 'loading', generation = 0, pointer = null, wheelRect = null, shuffleBusy = false;
  let feedbackTimer = 0;
  let dictionaryLanguage = mode, dictionaryFilter = 'all', lastAcquired = null;
  let advanceTimers = [];
  let keyboardNavigation = false;
  let comboEligible = true;
  const COMBO_STEP = 5;
  const comboLevel = value => value >= 10 ? 3 : value >= COMBO_STEP ? 2 : value >= 2 ? 1 : 0;
  let ringBatches = [[]], lastActiveBatch = -1;
  const PRAISE_TIME = 620; // praise pops over the board before the card flies in
  const REWARD_DURATION = 2350;
  const pending = new Set();
  const text = () => copy[mode];
  const progress = () => saved[mode];
  const rarityStars = tier => '★'.repeat(Math.ceil((tier + 1) * 3 / difficulty.tiers.length));
  const collectedCount = lang => catalog.filter(word => saved[lang].stars[word.id]).length;
  const bookName = lang => mode === 'ja' ? (lang === 'ja' ? '日本語辞書' : '英語辞書') : (lang === 'ja' ? 'Japanese dictionary' : 'English dictionary');
  const nextUncollected = (lang, after) => {
    for (let step = 1; step <= catalog.length; step++) {
      const candidate = (after + step + catalog.length) % catalog.length;
      if (catalog[candidate].tier === saved.targetTier && !saved[lang].stars[catalog[candidate].id]) return candidate;
    }
    const firstInTier = catalog.findIndex(word => word.tier === saved.targetTier);
    return firstInTier >= 0 ? firstInTier : (after + 1) % catalog.length;
  };
  const nextBilingualWord = after => {
    for (let step = 1; step <= catalog.length; step++) {
      const candidate = (after + step) % catalog.length, word = catalog[candidate];
      if (!saved.ja.stars[word.id] || !saved.en.stars[word.id]) return candidate;
    }
    return (after + 1) % catalog.length;
  };
  const persist = () => { saved.mode = mode; try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* Private browsing may deny writes. */ } };
  const later = (fn, ms) => {
    const version = generation;
    const id = setTimeout(() => { pending.delete(id); if (version === generation) fn(); }, ms);
    pending.add(id);
    return id;
  };
  const clearPending = () => { for (const id of pending) clearTimeout(id); pending.clear(); clearTimeout(feedbackTimer); };
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const imgURL = word => `../../assets/word/${encodeURIComponent(word.pic)}.png`;
  const shuffle = values => {
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  };

  class Sound {
    constructor() { this.ctx = null; this.voices = new Set(); }
    unlock() {
      if (!saved.sound) return;
      try {
        if (!this.ctx) {
          const Audio = window.AudioContext || window.webkitAudioContext;
          if (!Audio) return;
          this.ctx = new Audio();
          this.master = this.ctx.createGain();
          this.master.gain.value = .28;
          this.master.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      } catch { /* Sound must never block a puzzle. */ }
    }
    tone(frequency, duration = .17, delay = 0, volume = .3, pan = 0, type = 'sine') {
      if (!saved.sound || !this.ctx || this.ctx.state !== 'running') return;
      const ctx = this.ctx, at = ctx.currentTime + delay;
      const oscillator = ctx.createOscillator(), gain = ctx.createGain();
      oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(volume, at + .008);
      gain.gain.exponentialRampToValueAtTime(.001, at + duration);
      oscillator.connect(gain);
      const stereo = ctx.createStereoPanner?.();
      if (stereo) { stereo.pan.value = pan; gain.connect(stereo); stereo.connect(this.master); }
      else gain.connect(this.master);
      this.voices.add(oscillator);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); stereo?.disconnect(); this.voices.delete(oscillator); };
      oscillator.start(at); oscillator.stop(at + duration + .02);
    }
    pick(count, x) {
      this.unlock();
      const scale = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5];
      const frequency = scale[Math.min(count - 1, scale.length - 1)];
      this.tone(frequency, .21, 0, .32, (x / 360 - .5) * .7);
      this.tone(frequency * 2, .09, 0, .05, 0, 'triangle');
    }
    undo() { this.tone(330, .12, 0, .13); }
    mix() { [293.66, 392, 440].forEach((f, i) => this.tone(f, .1, i * .035, .12)); }
    hint() { this.tone(659.25, .3, 0, .2); this.tone(880, .4, .1, .13); }
    wrong() {
      this.stop(); this.unlock(); this.duck(false);
      // Two low, slightly dissonant pulses, distinct from the rising pick notes.
      this.tone(180, .16, 0, .3, 0, 'triangle');
      this.tone(187, .16, 0, .1, 0, 'square');
      this.tone(120, .25, .14, .3, 0, 'triangle');
      this.tone(127, .25, .14, .1, 0, 'square');
    }
    win(combo = 0) {
      // Each clean solve lifts the fanfare a little, so a streak is audible.
      const lift = Math.pow(2, Math.min(Math.max(combo - 1, 0), 7) / 12);
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f * lift, .7, i * .075, .22));
      [261.63, 329.63, 392].forEach(f => this.tone(f * lift, 1.1, .15, .1, 0, 'triangle'));
      if (combo >= 2) {
        const sparkle = [1567.98, 1760, 2093, 2349.32, 2637.02, 3135.96];
        sparkle.slice(0, Math.min(combo, sparkle.length)).forEach((f, i) => this.tone(f, .22, .42 + i * .055, .07, (i % 2 ? .4 : -.4), 'triangle'));
      }
      if (combo >= 2 && combo % COMBO_STEP === 0) [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => this.tone(f, .9, .8 + i * .06, .14, 0, 'square'));
    }
    comboBreak() { this.unlock(); this.tone(523.25, .14, .3, .09, 0, 'triangle'); this.tone(392, .18, .4, .09, 0, 'triangle'); this.tone(261.63, .3, .5, .08, 0, 'triangle'); }
    duck(speaking) {
      if (this.ctx && this.master) this.master.gain.setTargetAtTime(speaking ? .055 : .28, this.ctx.currentTime, .07);
    }
    stop() { for (const voice of this.voices) { try { voice.stop(); } catch {} } this.voices.clear(); }
  }
  const sound = new Sound();
  const speech = new window.WordBloomSpeech.Pronunciation({
    onState: event => {
      sound.duck(event.state === 'queued' || event.state === 'speaking');
      document.querySelectorAll('.pronunciation').forEach(panel => {
        if (panel.dataset.word !== event.wordId || panel.dataset.language !== event.language) return;
        panel.dataset.state = event.state;
        panel.classList.toggle('is-speaking', event.state === 'speaking');
        panel.setAttribute('aria-busy', String(event.state === 'queued' || event.state === 'speaking'));
        let message = '';
        if (event.state === 'queued') message = mode === 'ja' ? '発音を準備中…' : 'Getting the voice ready…';
        if (event.state === 'speaking') message = mode === 'ja' ? `「${event.text}」を発音中` : `Listen: ${event.text}`;
        if (event.state === 'finished') message = mode === 'ja' ? '聞けたら、まねして言ってみよう！' : 'Your turn. Say it out loud!';
        if (event.state === 'muted') message = mode === 'ja' ? '右上の音声をオンにすると聞けます' : 'Turn sound on at the top to listen';
        if (event.state === 'unavailable') message = mode === 'ja' ? 'この端末では、この言語の音声を利用できません' : 'This language’s voice is unavailable on this device';
        if (event.state === 'error') message = event.error === 'not-allowed'
          ? (mode === 'ja' ? '「発音を聞く」を押してね' : 'Tap Listen to hear the word')
          : (mode === 'ja' ? '音声を再生できませんでした。ボタンでもう一度どうぞ' : 'Voice playback failed. Tap Listen to try again.');
        if (event.state === 'idle') message = mode === 'ja' ? '何度でも聞いて、声に出してみよう' : 'Listen again, then try saying it';
        panel.querySelector('.pronunciation-status').textContent = message;
      });
    },
  });
  speech.setEnabled(saved.sound);

  function pronunciationPanel(word, language) {
    const panel = document.createElement('div'); panel.className = 'pronunciation';
    panel.dataset.word = word.id; panel.dataset.language = language; panel.dataset.state = 'idle';
    panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', mode === 'ja' ? '発音を聞く' : 'Word pronunciation');
    const heading = document.createElement('div'); heading.className = 'pronunciation-heading';
    const spoken = language === 'ja' ? word.w : word.en;
    heading.innerHTML = '<span class="voice-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    const label = document.createElement('span'); label.textContent = `${spoken} · ${language === 'ja' ? '日本語' : 'ENGLISH'}`; heading.append(label);
    const buttons = document.createElement('div'); buttons.className = 'pronunciation-buttons';
    for (const slow of [false, true]) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.slow = String(slow);
      button.innerHTML = `${icon('sound')}<span>${mode === 'ja' ? (slow ? 'ゆっくり' : '発音を聞く') : (slow ? 'Slow' : 'Listen')}</span>`;
      button.setAttribute('aria-label', mode === 'ja' ? `「${spoken}」の発音を${slow ? 'ゆっくり' : ''}聞く` : `${slow ? 'Slow pronunciation' : 'Listen to'} ${spoken}`);
      button.addEventListener('click', () => speech.speak(word, language, slow)); buttons.append(button);
    }
    const status = document.createElement('span'); status.className = 'pronunciation-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    status.textContent = saved.sound ? (mode === 'ja' ? '何度でも聞いて、声に出してみよう' : 'Listen again, then try saying it') : (mode === 'ja' ? '右上の音声をオンにすると聞けます' : 'Turn sound on at the top to listen');
    panel.append(heading, buttons, status);
    buttons.querySelectorAll('button').forEach(button => { button.disabled = !saved.sound; });
    return panel;
  }

  class Petals {
    constructor() {
      this.canvas = $('particles'); this.ctx = this.canvas.getContext('2d'); this.items = []; this.frame = 0;
      this.resize(); window.addEventListener('resize', () => this.resize());
    }
    resize() {
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = innerWidth * this.dpr; this.canvas.height = innerHeight * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    burst(x, y, count, celebration = false) {
      if (reducedMotion.matches || document.hidden) return;
      const colors = celebration === 'gold' ? ['#ffc93c', '#ffe27a', '#ff9a1f', '#fff6c2', '#ff7a45'] : celebration ? ['#ff7a45', '#ffc93c', '#2ecc9a', '#3fa9f5', '#ff5c8a', '#9b6bff'] : [getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff7a45', '#ffc93c', '#ffffff'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2, velocity = celebration ? 130 + Math.random() * 320 : 25 + Math.random() * 75;
        this.items.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity - (celebration ? 140 : 0),
          size: celebration ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2, life: celebration ? 1.5 + Math.random() : .4 + Math.random() * .2,
          age: 0, angle, spin: (Math.random() - .5) * 10, color: colors[i % colors.length], celebration, shape: celebration ? ['star', 'circle', 'rect', 'rect'][i % 4] : 'circle' });
      }
      this.items = this.items.slice(-320);
      if (!this.frame) { this.last = performance.now(); this.frame = requestAnimationFrame(time => this.draw(time)); }
    }
    draw(time) {
      const dt = Math.min((time - this.last) / 1000, .032); this.last = time;
      const ctx = this.ctx; ctx.clearRect(0, 0, innerWidth, innerHeight);
      this.items = this.items.filter(item => item.age < item.life);
      for (const p of this.items) {
        p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.celebration ? 220 : 35) * dt; p.angle += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
        ctx.fillStyle = p.color; ctx.beginPath();
        if (p.shape === 'star') { for (let k = 0; k < 10; k++) { const r = k % 2 ? p.size * .55 : p.size * 1.4, a = k * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); }
        else if (p.shape === 'rect') ctx.rect(-p.size, -p.size * .45, p.size * 2, p.size * .9);
        else ctx.arc(0, 0, p.size * .8, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      this.frame = this.items.length ? requestAnimationFrame(t => this.draw(t)) : 0;
    }
    clear() { cancelAnimationFrame(this.frame); this.frame = 0; this.items = []; this.ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  const petals = new Petals();
  function vibrate(pattern) { if (pointer?.kind === 'touch' && navigator.vibrate) navigator.vibrate(pattern); }

  function setFeedback(message, kind = '', reset = false) {
    clearTimeout(feedbackTimer); $('feedback').textContent = message; $('feedback').className = `feedback ${kind}`;
    if (reset) feedbackTimer = setTimeout(() => { if (phase === 'playing') setFeedback(text().release); }, 2300);
  }
  function updateLabels() {
    const t = text(); document.documentElement.lang = mode;
    document.title = mode === 'ja' ? 'WORD BLOOM — ことばの庭' : 'WORD BLOOM — A garden of words';
    $('modeJa').setAttribute('aria-pressed', String(mode === 'ja')); $('modeEn').setAttribute('aria-pressed', String(mode === 'en'));
    const labels = { clueHeading: 'title', instruction: 'instruction', gestureNote: 'note', shuffleLabel: 'shuffle', hintLabel: 'hint',
      footerNote: 'footer', collectionLabel: 'collection', foundLabel: 'found',
      imageErrorText: 'error', retryImage: 'retry', skipImage: 'skip' };
    for (const [id, key] of Object.entries(labels)) $(id).textContent = t[key];
    $('levels').setAttribute('aria-label', t.choose); $('help').setAttribute('aria-label', t.help);
    $('stageSelectLabel').textContent = t.stageSelect;
    $('difficulty').setAttribute('aria-label', mode === 'ja' ? '難易度を選ぶ' : 'Choose difficulty');
    $('difficultyLabel').textContent = mode === 'ja' ? '出題' : 'PLAYING';
    $('undo').setAttribute('aria-label', mode === 'ja' ? '一文字もどす' : 'Undo the last letter');
    $('closeModal').setAttribute('aria-label', t.close);
    $('wheel').setAttribute('aria-label', mode === 'ja' ? 'なぞって答える文字盤' : 'Connect letters to answer');
    updateSound();
    updateTheme();
    updateLayout();
  }
  function updateAnswerDisclosure() {
    const otherLanguage = mode === 'ja' ? 'en' : 'ja';
    const otherAnswer = [...(otherLanguage === 'ja' ? entry.w : entry.en.toUpperCase())];
    const label = document.createElement('b'); label.className = 'caption-lang';
    label.textContent = otherLanguage === 'ja' ? (mode === 'ja' ? '日本語' : 'JAPANESE') : (mode === 'ja' ? '英語' : 'ENGLISH');
    const masked = document.createElement('span'); masked.className = 'caption-mask';
    masked.textContent = otherAnswer.map((char, i) => i < hintCount ? char : '●').join('');
    $('pictureCaption').replaceChildren(label, masked);
    $('pictureCaption').title = mode === 'ja' ? 'もう一方の言語での答え（文字数）' : 'The same word in the other language (letter count)';
    $('pictureCaption').classList.add('masked-answer');
    $('pictureCaption').lang = otherLanguage;
  }
  function updateTheme() {
    const dark = saved.theme === 'dark';
    document.documentElement.dataset.theme = saved.theme;
    $('theme').setAttribute('aria-pressed', String(dark));
    $('theme').setAttribute('aria-label', mode === 'ja'
      ? (dark ? 'ライトモードにする' : 'ダークモードにする')
      : (dark ? 'Use light mode' : 'Use dark mode'));
    $('theme').innerHTML = icon(dark ? 'sun' : 'moon');
    $('themeColor').content = dark ? '#071126' : '#f6f4ec';
  }
  // "auto" uses the compact one-screen board on phones and the regular board elsewhere.
  const effectiveLayout = () => saved.layout !== 'auto' ? saved.layout : (innerWidth <= 860 ? 'mobile' : 'auto');
  function updateLayout() {
    document.documentElement.dataset.layout = effectiveLayout();
    document.querySelectorAll('[data-layout-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layoutChoice === saved.layout)));
  }
  function renderCombo(event = '') {
    const value = saved.combo, level = comboLevel(value), meter = $('combo');
    meter.dataset.level = String(level); $('game').dataset.comboLevel = String(level);
    $('comboCount').textContent = String(value);
    const filled = value === 0 ? 0 : value % COMBO_STEP || COMBO_STEP;
    [...$('comboPips').children].forEach((pip, i) => pip.classList.toggle('on', i < filled));
    $('comboBest').textContent = `BEST ${saved.bestCombo}`;
    meter.setAttribute('aria-label', mode === 'ja' ? `${value} コンボ、最高 ${saved.bestCombo}` : `${value} combo, best ${saved.bestCombo}`);
    if (event) { meter.classList.remove('bump', 'break'); void meter.offsetWidth; meter.classList.add(event); }
    const risky = value > 0;
    $('freeTag').textContent = risky ? (mode === 'ja' ? 'COMBO終了' : 'ENDS COMBO') : 'FREE';
    $('hint').classList.toggle('combo-risk', risky);
  }
  function breakCombo() {
    comboEligible = false;
    if (saved.combo <= 0) return 0;
    const lost = saved.combo; saved.combo = 0; persist(); renderCombo('break'); sound.comboBreak(); vibrate([20, 40, 20]);
    return lost;
  }
  function updateSound() {
    $('sound').setAttribute('aria-label', saved.sound ? text().soundOff : text().soundOn);
    $('sound').setAttribute('aria-pressed', String(saved.sound));
    $('sound').innerHTML = icon(saved.sound ? 'sound' : 'mute');
    document.querySelectorAll('.pronunciation').forEach(panel => {
      panel.querySelectorAll('button').forEach(button => { button.disabled = !saved.sound; });
      panel.querySelector('.pronunciation-status').textContent = saved.sound ? (mode === 'ja' ? '何度でも聞いて、声に出してみよう' : 'Listen again, then try saying it') : (mode === 'ja' ? '右上の音声をオンにすると聞けます' : 'Turn sound on at the top to listen');
    });
  }
  function updateProgress() {
    const group = Math.floor(index / 10), stars = progress().stars;
    const profile = difficulty.challenge(entry, mode);
    $('game').style.setProperty('--rarity', profile.color); $('game').dataset.rarity = profile.key;
    $('chapterNumber').textContent = `${mode === 'ja' ? 'この絵' : 'THIS WORD'} · RANK ${profile.rank}/${difficulty.tiers.length}`;
    const target = difficulty.tiers[saved.targetTier];
    $('difficultyText').innerHTML = `<span class="pill-stars">${rarityStars(saved.targetTier)}</span> <span class="tier-name">${target.name}</span><span class="tier-code">${target.code}</span>`;
    $('chapterName').textContent = mode === 'ja' ? profile.ja : profile.en;
    $('rarityBadge').innerHTML = `<span class="rarity-stars">${rarityStars(entry.tier)}</span> ${profile.code} · ${profile.name}`;
    $('rarityBadge').setAttribute('aria-label', `${mode === 'ja' ? '難度' : 'Difficulty'} ${profile.rank} / ${difficulty.tiers.length} · ${profile.name}`);
    const jaOwned = !!saved.ja.stars[entry.id], enOwned = !!saved.en.stars[entry.id];
    $('jaClearMark').textContent = jaOwned ? '✓' : '';
    $('enClearMark').textContent = enOwned ? '✓' : '';
    $('modeJa').dataset.cleared = String(jaOwned); $('modeEn').dataset.cleared = String(enOwned);
    $('connectLabel').textContent = `${profile.name} CHALLENGE`;
    $('levelText').textContent = `${String(index + 1).padStart(2, '0')} / ${catalog.length}`;
    $('pictureNumber').textContent = `NO. ${String(index + 1).padStart(3, '0')}`;
    const count = collectedCount(mode);
    $('foundCount').textContent = count;
    $('collectionCount').textContent = String(collectedCount('ja') + collectedCount('en'));
    $('collection').setAttribute('aria-label', mode === 'ja'
      ? `辞書を開く：日本語 ${collectedCount('ja')} / ${catalog.length} 語、英語 ${collectedCount('en')} / ${catalog.length} 語`
      : `Open dictionaries: Japanese ${collectedCount('ja')} of ${catalog.length}, English ${collectedCount('en')} of ${catalog.length}`);
    $('progress').replaceChildren(...catalog.slice(group * 10, group * 10 + 10).map((word, i) => {
      const dot = document.createElement('span'); dot.className = `progress-dot${stars[word.id] ? ' done' : ''}${i === index % 10 ? ' current' : ''}`;
      return dot;
    }));
    $('progress').setAttribute('aria-label', mode === 'ja' ? `この庭で ${catalog.slice(group * 10, group * 10 + 10).filter(word => stars[word.id]).length} / 10 語発見` : `Garden ${group + 1} progress`);
  }
  // Rings breathe with progress: the ring you are working on is big and roomy,
  // the other one shrinks out of the way (locked outer letters wait small at the rim,
  // used inner letters tuck in toward the centre once the outer ring opens).
  function ringRadius(batch, active) {
    if (ringBatches.length === 1) return 124;
    if (batch === 0) return active === 0 ? 100 : 64;
    return active === 0 ? 161 : 140;
  }
  function layoutNodes() {
    const active = activeBatch(selected, ringBatches);
    $('wheel').dataset.activeRing = active === 0 ? 'inner' : 'outer';
    for (let batch = 0; batch < ringBatches.length; batch++) {
      const group = nodes.filter(node => node.batch === batch), radius = ringRadius(batch, active);
      group.forEach((node, i) => {
        const angle = -Math.PI / 2 + (i + (batch > 0 ? .5 : 0)) * Math.PI * 2 / group.length;
        node.x = 180 + Math.cos(angle) * radius; node.y = 180 + Math.sin(angle) * radius;
        node.button.style.left = `${node.x / 3.6}%`; node.button.style.top = `${node.y / 3.6}%`;
      });
    }
  }
  function makeWheel() {
    const profile = difficulty.challenge(entry, mode);
    const plan = planLetters(answer, [], profile.innerCount, profile.dual); ringBatches = plan.batches; lastActiveBatch = -1;
    $('wheel').classList.toggle('dual-ring', ringBatches.length > 1);
    nodes = shuffle(plan.letters).map((node, order) => {
      const { char, id } = node;
      const button = document.createElement('button'); button.type = 'button'; button.className = `letter${profile.dual ? ' ring-letter' : ''}`;
      button.dataset.ring = node.batch === 0 ? 'inner' : 'outer'; button.dataset.batch = String(node.batch); button.style.setProperty('--i', order);
      button.textContent = char; button.dataset.node = String(id); button.setAttribute('aria-label', char); button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', event => { if (event.detail === 0 && phase === 'playing' && !shuffleBusy) { sound.unlock(); selectNode(id); if (selected.length >= answer.length) checkAnswer(); else setFeedback(text().tap); } });
      return { ...node, button, x: 0, y: 0 };
    });
    $('letters').replaceChildren(...nodes.map(node => node.button)); layoutNodes();
    $('letters').classList.add('intro'); later(() => $('letters').classList.remove('intro'), 520 + nodes.length * 55);
  }
  function updateAnswer() {
    const word = selected.map(id => nodes.find(node => node.id === id).char);
    [...$('answer').children].forEach((tile, i) => {
      const content = phase === 'solved' ? answer[i] : word[i] || (i < hintCount ? answer[i] : '');
      // Do not restart each tile's entrance animation on every pointer sample.
      if (tile.textContent !== content) tile.textContent = content;
      tile.className = `answer-tile${phase === 'solved' ? ' solved' : word[i] ? ' entered' : i < hintCount ? ' hinted' : ''}`;
    });
    const spoken = phase === 'solved' ? answer.join('') : word.join('');
    $('answer').setAttribute('aria-label', mode === 'ja' ? `答え ${spoken || '未入力'}、${answer.length}文字` : `Answer ${spoken || 'empty'}, ${answer.length} letters`);
    $('wheel').classList.toggle('has-selection', !!selected.length);
    $('centerLabel').textContent = selected.length ? text().undo : text().connect;
    for (const node of nodes) {
      node.button.classList.toggle('selected', selected.includes(node.id));
      node.button.setAttribute('aria-pressed', String(selected.includes(node.id)));
    }
    const batch = activeBatch(selected, ringBatches), dual = ringBatches.length > 1;
    for (const node of nodes) {
      node.button.disabled = phase === 'solved';
      node.button.classList.remove('ring-locked');
      node.button.classList.toggle('outer-pending', dual && batch === 0 && node.batch > 0);
    }
    $('wheel').dataset.activeRing = batch === 0 ? 'inner' : 'outer';
    if (dual && phase !== 'solved') {
      $('instruction').textContent = mode === 'ja' ? '指を離さず、ことばをつなごう' : 'Keep swiping to complete the word';
      $('centerLabel').textContent = selected.length ? text().undo : text().connect;
    }
    if (batch !== lastActiveBatch && lastActiveBatch >= 0) layoutNodes();
    if (batch > lastActiveBatch && lastActiveBatch >= 0 && phase === 'playing') {
      sound.hint(); $('wheel').classList.remove('ring-unlock'); void $('wheel').offsetWidth; $('wheel').classList.add('ring-unlock');
    }
    lastActiveBatch = batch;
  }
  function drawTrail(tip = null) {
    const points = selected.map(id => { const n = nodes.find(item => item.id === id); return `${n.x},${n.y}`; });
    if (tip && points.length) points.push(`${tip.x},${tip.y}`);
    $('trailLine').setAttribute('points', points.join(' ')); $('trailGlow').setAttribute('points', points.join(' '));
    if (tip) { $('trailTip').setAttribute('cx', tip.x); $('trailTip').setAttribute('cy', tip.y); }
  }
  function resetSelection() {
    selected = []; updateAnswer(); drawTrail();
    for (const node of nodes) node.button.classList.remove('hint-target');
  }
  function selectNode(id) {
    if (phase !== 'playing') return;
    const candidate = nodes.find(node => node.id === id);
    if (selected.includes(id)) return;
    if (candidate.button.hidden || !canSelectRing(candidate, selected, ringBatches)) return;
    const next = advanceSelection(selected, id, answer.length);
    if (next === selected) return;
    selected = next;
    const node = nodes.find(item => item.id === id);
    node.button.classList.remove('hint-target');
    sound.pick(selected.length, node.x); vibrate(7);
    const rect = $('wheel').getBoundingClientRect();
    petals.burst(rect.left + node.x / 360 * rect.width, rect.top + node.y / 360 * rect.height, 10);
    updateAnswer(); drawTrail();
  }

  function pauseAdvance() {
    advanceTimers.forEach(id => { clearTimeout(id); pending.delete(id); }); advanceTimers = [];
    $('game').classList.remove('stage-out');
  }
  function queueAdvance(delay = REWARD_DURATION) {
    pauseAdvance();
    if (phase !== 'solved' || $('modal').open || document.hidden) return;
    advanceTimers.push(later(() => $('game').classList.add('stage-out'), delay - 180));
    advanceTimers.push(later(() => {
      // Keep the pace: a solved word always leads to a different picture.
      // The paired language remains available through the central switch.
      loadLevel(nextUncollected(mode, index), true, true);
    }, delay));
  }
  function loadLevel(nextIndex, focusNext = false, keepPronunciation = false, keepHints = false, keepPicture = false) {
    const previousTier = entry?.tier;
    const retainedHintCount = keepHints ? hintCount : 0;
    pauseAdvance(); generation++; clearPending(); cancelGesture();
    if (!keepPronunciation) speech.stop();
    sound.stop(); petals.clear();
    document.querySelectorAll('.flying-letter, .collected-word').forEach(el => el.remove());
    $('wordReward').hidden = true; $('collection').classList.remove('word-added');
    $('rewardScene').hidden = true; $('rewardScene').classList.remove('page-filled');
    if ($('rewardScene').hidePopover && $('rewardScene').matches(':popover-open')) $('rewardScene').hidePopover();
    $('rewardBackdrop').hidden = true;
    $('rankUp').hidden = true;
    $('winPronunciation').hidden = true; $('winPronunciation').replaceChildren();
    index = (nextIndex + catalog.length) % catalog.length; progress().index = index;
    entry = catalog[index]; progress().wordId = entry.id; persist();
    answer = [...(mode === 'ja' ? entry.w : entry.en.toUpperCase())];
    selected = []; hintCount = Math.min(retainedHintCount, answer.length); mistakes = 0; shuffleBusy = false; phase = 'loading';
    comboEligible = hintCount === 0;
    $('rewardCombo').hidden = true; $('game').classList.remove('combo-win'); $('praise').classList.remove('show');
    $('game').dataset.state = phase; $('gameActions').hidden = false;
    $('wheel').classList.remove('mistake'); $('answer').classList.remove('mistake');
    $('hint').disabled = false; $('shuffle').disabled = false; $('imageError').hidden = true;
    updateLabels(); updateProgress(); renderCombo();
    updateAnswerDisclosure();
    $('answer').className = `answer${answer.length > 10 ? ' extra-long' : answer.length > 7 ? ' long' : ''}`;
    $('answer').replaceChildren(...answer.map((_, i) => { const tile = document.createElement('span'); tile.className = 'answer-tile'; tile.style.setProperty('--i', i); return tile; }));
    const profile = difficulty.challenge(entry, mode);
    $('answerInfo').textContent = mode === 'ja' ? `難度 ${profile.rank} · ${answer.length}文字 / ${profile.choices}択` : `LEVEL ${profile.rank} · ${answer.length} LETTERS / ${profile.choices} CHOICES`;
    makeWheel(); resetSelection(); setFeedback(text().release);
    $('gestureNote').textContent = mode === 'ja' ? '途中で離すとキャンセル' : 'Release an unfinished word to cancel';
    const version = generation, image = $('clueImage');
    image.alt = mode === 'ja' ? '答えを考えるためのイラスト' : 'Picture clue. What does it show?';
    if (keepPicture && image.complete && image.naturalWidth > 0 && image.src.endsWith(encodeURIComponent(entry.pic) + '.png')) {
      image.style.opacity = '1';
      image.style.animation = 'none';
      phase = 'playing'; $('game').dataset.state = phase;
      if (focusNext && keyboardNavigation) nodes[0]?.button.focus({ preventScroll: true });
    } else {
      image.style.opacity = '0';
      image.onload = () => {
        if (version !== generation) return;
        image.style.opacity = '1'; phase = 'playing'; $('game').dataset.state = phase;
        // Restart the picture entrance only when the picture itself changes.
        image.style.animation = 'none'; void image.offsetWidth; image.style.animation = '';
        if (previousTier !== undefined && entry.tier > previousTier) showRankUp(profile);
        if (focusNext && keyboardNavigation) nodes[0]?.button.focus({ preventScroll: true });
      };
      image.onerror = () => {
        if (version !== generation) return;
        phase = 'error'; $('game').dataset.state = phase; $('imageError').hidden = false;
        $('hint').disabled = true; $('shuffle').disabled = true; setFeedback(text().error, 'wrong');
      };
      image.src = imgURL(entry);
    }
    const preload = new Image(); preload.src = imgURL(catalog[nextBilingualWord(index)]);
  }

  function showRankUp(profile) {
    $('rankUpName').textContent = `${profile.code} · ${profile.name}`;
    $('rankUpDetail').textContent = mode === 'ja' ? `難度 ${profile.rank}へ · ${profile.choices}択から見つけよう` : `Difficulty ${profile.rank} · ${profile.choices} letters to choose from`;
    $('rankUpDiamonds').textContent = '◆'.repeat(profile.rank) + '◇'.repeat(difficulty.tiers.length - profile.rank);
    $('rankUp').hidden = false;
    const rect = $('pictureCard').getBoundingClientRect(); petals.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, true);
    later(() => { $('rankUp').hidden = true; }, 1150);
  }

  function flyLetters() {
    if (reducedMotion.matches) return;
    const slots = [...$('answer').children];
    selected.forEach((id, i) => {
      const node = nodes.find(item => item.id === id), from = node.button.getBoundingClientRect(), to = slots[i].getBoundingClientRect();
      const letter = document.createElement('span'); letter.className = 'flying-letter'; letter.textContent = node.char;
      letter.style.left = `${from.left + from.width / 2 - 21}px`; letter.style.top = `${from.top + from.height / 2 - 21}px`; document.body.append(letter);
      const dx = to.left + to.width / 2 - from.left - from.width / 2, dy = to.top + to.height / 2 - from.top - from.height / 2;
      const animation = letter.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * .5}px,${dy * .5 - 70}px) scale(.85)`, opacity: .9, offset: .5 },
        { transform: `translate(${dx}px,${dy}px) scale(.65)`, opacity: 0 },
      ], { duration: 540, delay: i * 45, easing: 'cubic-bezier(.3,.6,.3,1)', fill: 'forwards' });
      animation.onfinish = () => letter.remove();
    });
  }
  function checkAnswer() {
    if (phase !== 'playing' || !selected.length) return;
    const word = selected.map(id => nodes.find(node => node.id === id).char).join('');
    if (word === answer.join('')) { win(); return; }
    const tooShort = selected.length < answer.length;
    if (!tooShort) mistakes++;
    phase = 'checking'; $('game').dataset.state = phase; sound.wrong(); vibrate([35, 30, 45]);
    const lost = tooShort ? 0 : breakCombo();
    resetSelection();
    setFeedback(tooShort ? text().short : lost ? (mode === 'ja' ? `おしい！ ${lost} COMBO でストップ` : `Almost! Your ${lost} combo ended.`) : text().wrong, 'wrong');
    for (const element of [$('answer'), $('wheel')]) {
      element.classList.remove('mistake'); void element.offsetWidth; element.classList.add('mistake');
    }
    later(() => {
      phase = 'playing'; $('game').dataset.state = phase;
      $('answer').classList.remove('mistake'); $('wheel').classList.remove('mistake');
      resetSelection(); setFeedback(text().release);
    }, 480);
  }
  const praiseWords = {
    ja: { gold: ['てんさい！', 'かんぺき！', 'さいこう！'], great: ['すごい！', 'やったね！', 'ナイス！', 'いいね！'], ok: ['できた！', 'クリア！', 'せいかい！'] },
    en: { gold: ['GENIUS!', 'PERFECT!', 'AMAZING!'], great: ['GREAT!', 'NICE!', 'AWESOME!', 'SUPER!'], ok: ['GOT IT!', 'SOLVED!', 'CORRECT!'] },
  };
  function showPraise(stars, combo) {
    const tier = combo >= COMBO_STEP || (stars === 3 && answer.length >= 6) ? 'gold' : stars === 3 ? 'great' : 'ok';
    const words = praiseWords[mode][tier], praise = $('praise');
    praise.textContent = words[Math.floor(Math.random() * words.length)];
    praise.dataset.tier = tier;
    praise.classList.remove('show'); void praise.offsetWidth; praise.classList.add('show');
  }
  function win() {
    $('rankUp').hidden = true;
    phase = 'solved'; $('game').dataset.state = phase; flyLetters(); vibrate([12, 35, 20]);
    if (comboEligible) { saved.combo++; saved.bestCombo = Math.max(saved.bestCombo, saved.combo); }
    const combo = comboEligible ? saved.combo : 0, newBest = combo >= 2 && combo === saved.bestCombo;
    sound.win(combo); renderCombo(combo ? 'bump' : '');
    const stars = Math.max(1, 3 - Math.min(2, hintCount + (mistakes > 0 ? 1 : 0)));
    const first = !progress().stars[entry.id];
    progress().stars[entry.id] = Math.max(progress().stars[entry.id] || 0, stars); persist();
    if (first) lastAcquired = { lang: mode, id: entry.id };
    updateAnswer();
    $('answerInfo').textContent = `${'✦'.repeat(stars)}${'✧'.repeat(3 - stars)}  ${mode === 'ja' ? entry.ja : entry.en.toUpperCase()}`;
    const complete = collectedCount(mode) === catalog.length;
    const both = !!saved.ja.stars[entry.id] && !!saved.en.stars[entry.id];
    setFeedback(first ? (complete ? `${bookName(mode)} ${mode === 'ja' ? 'コンプリート！' : 'complete!'}` : text().correct) : (mode === 'ja' ? '正解！ この単語は獲得済み' : 'Correct! Already collected.'), 'success');
    $('pictureStamp').textContent = first ? 'WORD GET!' : 'GOT IT!';
    $('rewardBadge').textContent = both ? 'BILINGUAL CLEAR!' : first ? (complete ? 'BOOK COMPLETE' : 'NEW WORD GET!') : (mode === 'ja' ? '獲得済み' : 'COLLECTED');
    $('rewardScene').classList.toggle('bilingual-clear', both);
    $('rewardScene').style.setProperty('--rarity', difficulty.tiers[entry.tier].color);
    $('rewardScene').dataset.rarity = difficulty.tiers[entry.tier].key;
    $('rewardWord').textContent = mode === 'ja' ? entry.ja : entry.en.toUpperCase();
    $('rewardReading').textContent = mode === 'ja' ? entry.w : entry.ja;
    $('rewardBookName').textContent = bookName(mode);
    $('rewardArt').src = imgURL(entry);
    $('rewardPageNumber').textContent = `${difficulty.tiers[entry.tier].code} · PAGE ${String(index + 1).padStart(3, '0')}`;
    $('rewardBefore').textContent = String(collectedCount(mode) - (first ? 1 : 0));
    $('rewardAfter').textContent = String(collectedCount(mode));
    $('rewardTotal').textContent = ` / ${catalog.length}`;
    $('rewardProgress').textContent = `${difficulty.tiers[entry.tier].name}\n${mode === 'ja' ? (first ? '新しいページが埋まった！' : 'このページは登録済み') : (first ? 'A new page filled!' : 'Already in your book')}`;
    $('rewardSeal').textContent = both ? 'JA + EN' : mode === 'ja' ? (first ? '登録！' : '正解！') : (first ? 'ADDED!' : 'GOT IT!');
    $('advanceLabel').textContent = mode === 'ja' ? '次の問題へ →' : 'Next picture →';
    const library = $('rewardShelf'); library.className = 'book-shelf book-library-grid';
    library.replaceChildren(...catalog.map((word, pageIndex) => {
      const page = document.createElement('span');
      const owned = !!progress().stars[word.id], newest = word.id === entry.id && first;
      page.className = `library-page${owned ? ' owned' : ''}${newest ? ' newest' : ''}`;
      page.dataset.wordId = word.id; page.dataset.page = String(pageIndex + 1);
      page.setAttribute('aria-hidden', 'true');
      return page;
    }));
    $('wordReward').setAttribute('aria-label', `${bookName(mode)} ${mode === 'ja' ? 'を開く' : '— open'}`);
    $('rewardStars').replaceChildren(...[0, 1, 2].map(i => { const star = document.createElement('i'); star.textContent = '★'; star.style.setProperty('--i', i); star.className = i < stars ? 'on' : ''; return star; }));
    $('hint').disabled = true; $('shuffle').disabled = true;
    showPraise(stars, combo);
    const wheelRect = $('wheel').getBoundingClientRect();
    petals.burst(wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2, 60 + Math.min(combo, 8) * 8, combo >= COMBO_STEP ? 'gold' : true);
    $('centerLabel').textContent = 'bloom!';
    const comboBanner = $('rewardCombo'), milestone = combo >= COMBO_STEP && combo % COMBO_STEP === 0;
    comboBanner.hidden = combo < 2; comboBanner.dataset.level = String(comboLevel(combo)); comboBanner.classList.toggle('milestone', milestone);
    $('rewardComboCount').textContent = String(combo);
    $('rewardComboNote').textContent = milestone ? (combo >= 10 ? 'FEVER!' : 'GREAT STREAK!') : newBest ? (mode === 'ja' ? '自己ベスト更新！' : 'NEW BEST!') : (mode === 'ja' ? 'ノーヒント・ノーミス' : 'No hints, no misses');
    $('game').classList.toggle('combo-win', combo >= 2);
    $('rewardScene').classList.toggle('has-combo', combo >= 2);
    later(() => {
      $('wordReward').hidden = false; $('rewardScene').hidden = false;
      $('rewardScene').showPopover?.(); $('rewardBackdrop').hidden = false;
      const rect = $('wordReward').getBoundingClientRect();
      petals.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, 130 + Math.min(combo, 8) * 20, combo >= COMBO_STEP ? 'gold' : true);
      if (milestone) later(() => petals.burst(innerWidth / 2, innerHeight * .25, 100, 'gold'), 380);
      later(() => { $('rewardScene').classList.add('page-filled'); updateProgress(); }, 760);
      if (first) later(animateAcquisition, 900);
    }, reducedMotion.matches ? 0 : PRAISE_TIME);
    $('winPronunciation').replaceChildren(pronunciationPanel(entry, mode)); $('winPronunciation').hidden = false;
    speech.speak(entry, mode);
    queueAdvance();
  }

  function animateAcquisition() {
    $('collection').classList.remove('word-added'); void $('collection').offsetWidth; $('collection').classList.add('word-added');
    if (reducedMotion.matches) return;
    const from = $('rewardArt').getBoundingClientRect();
    const target = $('rewardShelf').querySelector(`[data-word-id="${entry.id}"]`) || $('collection');
    const to = target.getBoundingClientRect();
    const token = document.createElement('span'), image = document.createElement('img');
    token.className = 'collected-word'; token.setAttribute('aria-hidden', 'true'); image.src = imgURL(entry); image.alt = '';
    token.append(image); token.style.left = `${from.right - 60}px`; token.style.top = `${from.bottom - 60}px`; document.body.append(token);
    const dx = to.left + to.width / 2 - from.right + 30, dy = to.top + to.height / 2 - from.bottom + 30;
    const animation = token.animate([
      { transform: 'translate(0,0) rotate(-12deg) scale(.5)', opacity: 0 },
      { transform: 'translate(0,-24px) rotate(8deg) scale(1.12)', opacity: 1, offset: .25 },
      { transform: `translate(${dx}px,${dy}px) rotate(-8deg) scale(.2)`, opacity: 0 },
    ], { duration: 620, easing: 'cubic-bezier(.25,.7,.3,1)', fill: 'both' });
    animation.onfinish = () => token.remove();
  }

  function pointFrom(event) {
    const rect = wheelRect || $('wheel').getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width * 360, y: (event.clientY - rect.top) / rect.height * 360 };
  }
  function hitRadius(node) { return Math.min(52, node.button.offsetWidth / (wheelRect.width / 360) / 2 + 5); }
  function nearest(point) {
    return nodes.filter(node => !node.button.hidden && canSelectRing(node, selected, ringBatches)).map(node => ({ node, distance: Math.hypot(node.x - point.x, node.y - point.y) }))
      .filter(hit => hit.distance <= hitRadius(hit.node)).sort((a, b) => a.distance - b.distance)[0]?.node;
  }
  // Swept-segment intersection keeps fast swipes from skipping a letter between events.
  // Passing over a letter needs a firmer touch than starting on one, so grazing a neighbour
  // on the way across a crowded ring does not pick it up by accident.
  function passRadius(node) { return node.button.offsetWidth / (wheelRect.width / 360) / 2 * .85; }
  function sweep(from, to) {
    for (const id of sweptHits(nodes.filter(node => !node.button.hidden), from, to, passRadius)) selectNode(id);
    repeatLetter(to);
  }
  // Double letters (CORRECT, ROLL, もも…): leaving the last letter and coming back onto it
  // takes its unused twin, so the same circle can be "used twice" naturally.
  function repeatLetter(position) {
    const last = nodes.find(node => node.id === selected.at(-1));
    if (!pointer || !last) return;
    const distance = Math.hypot(position.x - last.x, position.y - last.y), radius = hitRadius(last);
    if (distance > radius * 1.1) { pointer.exited = last.id; return; }
    if (pointer.exited !== last.id || distance > radius * .9) return;
    pointer.exited = null;
    const twin = nodes.find(node => node.char === last.char && !selected.includes(node.id) && !node.button.hidden);
    if (twin) selectNode(twin.id);
  }
  function cancelGesture() {
    if (pointer && $('wheel').hasPointerCapture?.(pointer.id)) $('wheel').releasePointerCapture(pointer.id);
    pointer = null; wheelRect = null; $('wheel').classList.remove('dragging');
    if (nodes.length && phase !== 'solved') { selected = []; updateAnswer(); drawTrail(); }
  }
  $('wheel').addEventListener('pointerdown', event => {
    if (phase !== 'playing' || shuffleBusy || pointer || !event.isPrimary || event.button !== 0 || event.target.closest('#undo')) return;
    wheelRect = $('wheel').getBoundingClientRect();
    const position = pointFrom(event), node = nearest(position); if (!node) { wheelRect = null; return; }
    event.preventDefault(); sound.unlock();
    pointer = { id: event.pointerId, kind: event.pointerType, start: position, last: position, moved: false, exited: null };
    $('wheel').setPointerCapture(event.pointerId); $('wheel').classList.add('dragging');
    selectNode(node.id); drawTrail(position); setFeedback(text().release);
  });
  $('wheel').addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    event.preventDefault();
    const samples = event.getCoalescedEvents?.();
    for (const sample of samples?.length ? samples : [event]) {
      const position = pointFrom(sample);
      if (Math.hypot(position.x - pointer.start.x, position.y - pointer.start.y) > 8) pointer.moved = true;
      sweep(pointer.last, position); pointer.last = position;
    }
    drawTrail(pointer.last);
  });
  $('wheel').addEventListener('pointerup', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const end = pointFrom(event); sweep(pointer.last, end);
    if ($('wheel').hasPointerCapture(event.pointerId)) $('wheel').releasePointerCapture(event.pointerId);
    $('wheel').classList.remove('dragging'); drawTrail();
    if (selected.length >= answer.length) checkAnswer();
    else { resetSelection(); setFeedback(text().release); }
    pointer = null; wheelRect = null;
  });
  $('wheel').addEventListener('pointercancel', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('lostpointercapture', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('contextmenu', event => event.preventDefault());
  window.addEventListener('blur', cancelGesture);
  window.addEventListener('resize', () => { if (pointer) cancelGesture(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseAdvance(); cancelGesture(); speech.stop(); sound.stop(); petals.clear(); }
    else queueAdvance(850);
  });
  window.addEventListener('pagehide', () => speech.stop());

  $('undo').addEventListener('click', () => {
    if (phase !== 'playing' || !selected.length) return;
    selected.pop(); sound.undo(); updateAnswer(); drawTrail();
  });
  $('shuffle').addEventListener('click', () => {
    if (phase !== 'playing' || shuffleBusy) return;
    cancelGesture(); sound.unlock(); sound.mix(); shuffleBusy = true;
    const old = nodes.map(node => node.id).join(','); shuffle(nodes);
    if (nodes.map(node => node.id).join(',') === old) nodes.push(nodes.shift());
    layoutNodes(); setFeedback(text().mix, '', true);
    later(() => { shuffleBusy = false; }, reducedMotion.matches ? 0 : 470);
  });
  $('hint').addEventListener('click', () => {
    if (phase !== 'playing' || shuffleBusy) return;
    cancelGesture(); sound.unlock(); sound.hint(); breakCombo(); hintCount = Math.min(answer.length, hintCount + 1); updateAnswer(); updateAnswerDisclosure();
    const target = nodes.find(node => node.answerIndex === hintCount - 1);
    if (target) { target.button.classList.remove('hint-target'); void target.button.offsetWidth; target.button.classList.add('hint-target'); }
    const jaHint = [...entry.w][hintCount - 1];
    const enHint = [...entry.en.toUpperCase()][hintCount - 1];
    const bilingualHint = [jaHint ? `日本語「${jaHint}」` : '', enHint ? `ENGLISH「${enHint}」` : ''].filter(Boolean).join(' / ');
    setFeedback(hintCount === answer.length ? text().allHinted : mode === 'ja' ? `${hintCount}文字め：${bilingualHint}` : `Hint ${hintCount}: ${bilingualHint}`, '', true);
    if (hintCount === answer.length) $('hint').disabled = true;
  });
  $('sound').addEventListener('click', () => {
    saved.sound = !saved.sound; speech.setEnabled(saved.sound); persist(); updateSound();
    if (saved.sound) { sound.unlock(); sound.hint(); } else sound.stop();
  });
  $('theme').addEventListener('click', () => {
    saved.theme = saved.theme === 'dark' ? 'light' : 'dark'; persist(); updateTheme();
  });
  window.addEventListener('resize', updateLayout);
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    if (mode === button.dataset.mode) return;
    mode = button.dataset.mode; loadLevel(index, false, false, true, true);
  }));
  $('retryImage').addEventListener('click', () => loadLevel(index));
  $('skipImage').addEventListener('click', () => loadLevel(index + 1));

  function openModal(title, body) {
    pauseAdvance(); cancelGesture(); speech.stop(); $('modalTitle').textContent = title; $('modalBody').replaceChildren();
    if (typeof body === 'string') $('modalBody').innerHTML = body; else $('modalBody').append(body);
    if (!$('modal').open) $('modal').showModal();
    $('modal').scrollTop = 0;
  }
  $('closeModal').addEventListener('click', () => $('modal').close());
  $('modal').addEventListener('close', () => { speech.stop(); queueAdvance(850); });
  $('modal').addEventListener('click', event => { if (event.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('modal').close(); } });
  function layoutSettings() {
    const choices = [['auto', 'desktop', mode === 'ja' ? '自動' : 'Auto'], ['mobile', 'phone', mode === 'ja' ? '縦持ち' : 'Phone'], ['desktop', 'desktop', 'PC']];
    return `<div class="settings-row"><span>${mode === 'ja' ? '画面レイアウト' : 'Layout'}</span><div class="layout-choice" role="group" aria-label="${mode === 'ja' ? '画面レイアウト' : 'Layout'}">${choices.map(([value, iconName, label]) => `<button type="button" data-layout-choice="${value}" aria-pressed="${saved.layout === value}">${value === 'auto' ? '' : icon(iconName)}<span>${label}</span></button>`).join('')}</div></div>`
      + `<div class="settings-row"><span>${mode === 'ja' ? 'テーマ' : 'Theme'}</span><div class="layout-choice" role="group">${[['light', 'sun', mode === 'ja' ? 'ライト' : 'Light'], ['dark', 'moon', mode === 'ja' ? 'ダーク' : 'Dark']].map(([value, iconName, label]) => `<button type="button" data-theme-choice="${value}" aria-pressed="${saved.theme === value}">${icon(iconName)}<span>${label}</span></button>`).join('')}</div></div>`
      + `<p class="settings-best">${mode === 'ja' ? '最高 COMBO' : 'Best combo'} <b>${saved.bestCombo}</b></p>`;
  }
  $('help').addEventListener('click', () => {
    const steps = mode === 'ja' ? [
      'イラストを見て、ことばを思い浮かべます。日本語はひらがな、英語はアルファベットで答えます。絵の下の伏字は、もう一方の言語での文字数です。',
      '文字から文字へ、指をはなさずになぞります。最後までつないで離すと答え合わせ。途中で離すと選択を取り消します。',
      'ヒントなし・ミスなしで正解し続けると COMBO が伸び、演出と音がどんどん華やかに。5の倍数で大きなボーナス演出。ヒントや誤答で COMBO は 0 に戻ります。',
      '正解すると発音とともに図鑑の1ページが埋まり、自動で次の問題へ。獲得したページは文字盤右上の辞書ボタンから開いて、何度でも発音を聞き直せます。',
    ] : [
      'Look at the picture and find its word. Choose Japanese for hiragana, or English for the alphabet. The dots under the picture show the word length in the other language.',
      'Swipe through the entire word and release to check. Releasing an unfinished word cancels the selection.',
      'Solve in a row with no hints and no misses to build a COMBO. The fanfare grows with it, with a big burst every 5. A hint or a wrong answer resets it.',
      'Get it right, hear the word, and watch a dictionary page fill in. The next puzzle starts automatically. Open your dictionaries from the book button by the wheel to listen again.',
    ];
    const note = mode === 'ja' ? '選んだ文字を横切っても取り消されません。同じ文字が続くとき（CORRECT の RR など）は、もう一つの丸へ進むか、いったん外へ出て同じ丸に戻ればOK。外側の文字は、内側の文字をすべて使うと選べるようになります。一文字戻すときは中央の矢印、または Backspace。ヒントを使っても単語を獲得できます。キーボードは Tab / Enter / Backspace。' : 'Crossing selected letters keeps your word intact. For a double letter (the RR in CORRECT), slide to its twin or slip off the letter and back onto it. Outer letters unlock once every inner letter is used. Use the center arrow or Backspace to undo a letter. Hints still let you collect the word. Keyboard: Tab / Enter / Backspace.';
    openModal(text().help, `<div class="help-steps">${steps.map((line, i) => `<div class="help-step"><b>${i + 1}</b><p>${line}</p></div>`).join('')}</div><p class="help-note">${note}</p>${layoutSettings()}<button class="modal-primary" id="startPlaying" type="button">${mode === 'ja' ? 'ことばを咲かせよう' : 'Let it bloom'}</button>`);
    $('startPlaying').addEventListener('click', () => $('modal').close());
    $('modalBody').querySelectorAll('[data-layout-choice]').forEach(button => button.addEventListener('click', () => { saved.layout = button.dataset.layoutChoice; persist(); updateLayout(); }));
    $('modalBody').querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => {
      saved.theme = button.dataset.themeChoice; persist(); updateTheme();
      $('modalBody').querySelectorAll('[data-theme-choice]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    }));
    updateLayout();
  });
  $('difficulty').addEventListener('click', () => {
    const title = mode === 'ja' ? '挑戦する難易度を選ぶ' : 'Choose your challenge';
    const intro = document.createElement('p'); intro.className = 'modal-copy'; intro.textContent = mode === 'ja' ? '選んだランクの未獲得語だけを、次の問題として出します。' : 'Your next puzzles will come from this rank.';
    const grid = document.createElement('div'); grid.className = 'difficulty-grid';
    difficulty.tiers.forEach((tier, tierIndex) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'difficulty-choice';
      button.dataset.tier = String(tierIndex); button.style.setProperty('--tier-color', tier.color);
      button.setAttribute('aria-pressed', String(saved.targetTier === tierIndex));
      button.innerHTML = `<strong class="choice-stars">${rarityStars(tierIndex)}</strong><b>${tier.code} · ${tier.name}</b><span>${mode === 'ja' ? tier.ja : tier.en}</span>`;
      button.addEventListener('click', () => {
        saved.targetTier = tierIndex; persist(); $('modal').close();
        const first = catalog.findIndex(word => word.tier === tierIndex && !saved[mode].stars[word.id]);
        loadLevel(first >= 0 ? first : catalog.findIndex(word => word.tier === tierIndex), true);
      });
      grid.append(button);
    });
    const panel = document.createElement('div'); panel.append(intro, grid); openModal(title, panel);
  });
  $('levels').addEventListener('click', () => {
    const container = document.createElement('div'), intro = document.createElement('p'), grid = document.createElement('div');
    intro.className = 'modal-copy'; intro.textContent = text().levels; grid.className = 'level-grid'; container.append(intro, grid);
    catalog.forEach((word, i) => {
      const profile = difficulty.challenge(word, mode);
      if (i % 10 === 0) {
        const heading = document.createElement('h3'); heading.className = 'stage-rank-heading'; heading.style.setProperty('--rarity', profile.color);
        heading.innerHTML = `<b>${profile.code} · ${profile.name}</b><span>${mode === 'ja' ? `難度 ${profile.rank} · ${profile.ja}` : `Difficulty ${profile.rank} · ${profile.en}`}</span>`; grid.append(heading);
      }
      const button = document.createElement('button'); button.type = 'button';
      button.className = `level-cell${i === index ? ' current' : ''}${progress().stars[word.id] ? ' done' : ''}`;
      button.style.setProperty('--rarity', profile.color);
      button.textContent = String(i + 1).padStart(2, '0'); button.dataset.level = String(i);
      button.setAttribute('aria-label', `${mode === 'ja' ? 'ステージ' : 'Puzzle'} ${i + 1} · ${profile.name}`);
      if (progress().stars[word.id]) { const score = document.createElement('small'); score.textContent = '✦'.repeat(progress().stars[word.id]); button.append(score); }
      button.addEventListener('click', () => { $('modal').close(); loadLevel(i); }); grid.append(button);
    });
    openModal(text().choose, container);
  });
  function openDictionary() { dictionaryLanguage = mode; dictionaryFilter = 'all'; renderDictionary(); }
  $('collection').addEventListener('click', openDictionary);
  $('wordReward').addEventListener('click', openDictionary);

  function beginDictionaryPuzzle(lang, targetIndex) {
    $('modal').close(); mode = lang; loadLevel(targetIndex, true);
    $('clueHeading').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }

  function renderDictionary(focusControl = '') {
    const lang = dictionaryLanguage, count = collectedCount(lang), percent = Math.floor(count / catalog.length * 100);
    const container = document.createElement('div'); container.className = 'dictionary';
    const tabs = document.createElement('div'); tabs.className = 'dictionary-tabs'; tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', mode === 'ja' ? '表示する辞書' : 'Choose a dictionary');
    for (const language of ['ja', 'en']) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.book = language;
      button.setAttribute('aria-pressed', String(language === lang));
      button.innerHTML = `${icon('book')}<span>${bookName(language)}<small>${collectedCount(language)} / ${catalog.length}</small></span>`;
      button.addEventListener('click', () => { dictionaryLanguage = language; renderDictionary('book'); }); tabs.append(button);
    }
    const summary = document.createElement('div'); summary.className = 'dictionary-summary';
    summary.innerHTML = `<div><span class="eyebrow">${count === catalog.length ? 'DICTIONARY COMPLETE' : 'GROW YOUR DICTIONARY'}</span><p><b>${count}</b> / ${catalog.length} <span>${mode === 'ja' ? '語ゲット' : 'words collected'}</span></p></div><strong>${percent}<small>%</small></strong>`;
    const meter = document.createElement('div'); meter.className = 'dictionary-meter'; meter.setAttribute('role', 'progressbar');
    meter.setAttribute('aria-label', bookName(lang)); meter.setAttribute('aria-valuenow', String(count)); meter.setAttribute('aria-valuemin', '0'); meter.setAttribute('aria-valuemax', String(catalog.length));
    const fill = document.createElement('span'); fill.style.width = `${percent}%`; meter.append(fill);
    const caption = document.createElement('p'); caption.className = 'dictionary-caption';
    caption.textContent = count === catalog.length ? (mode === 'ja' ? '全ページが埋まりました！ もう一冊の辞書も育てよう。' : 'Every page is filled! Keep growing your other dictionary.') : (mode === 'ja' ? `あと ${catalog.length - count} 語で完成。未獲得のページを選んで挑戦しよう。` : `${catalog.length - count} words to go. Pick a missing page to collect next.`);
    const filters = document.createElement('div'); filters.className = 'dictionary-filters'; filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', mode === 'ja' ? '獲得状況で絞り込む' : 'Filter by collection status');
    for (const [value, label, total] of [['all', mode === 'ja' ? 'すべて' : 'All', catalog.length], ['owned', mode === 'ja' ? '獲得済み' : 'Collected', count], ['missing', mode === 'ja' ? '未獲得' : 'Missing', catalog.length - count]]) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = `${label} ${total}`; button.dataset.filter = value;
      button.setAttribute('aria-pressed', String(dictionaryFilter === value)); button.addEventListener('click', () => { dictionaryFilter = value; renderDictionary('filter'); }); filters.append(button);
    }
    const grid = document.createElement('div'); grid.className = 'dictionary-grid';
    const collator = new Intl.Collator(lang);
    const words = catalog.map((word, wordIndex) => ({ word, wordIndex })).sort((a, b) => collator.compare(lang === 'ja' ? a.word.w : a.word.en, lang === 'ja' ? b.word.w : b.word.en));
    for (const { word, wordIndex } of words) {
      const owned = !!saved[lang].stars[word.id];
      if ((dictionaryFilter === 'owned' && !owned) || (dictionaryFilter === 'missing' && owned)) continue;
      const card = document.createElement('button'); card.type = 'button'; card.className = `dictionary-card ${owned ? 'owned' : 'missing'}`; card.dataset.wordId = word.id;
      const rarity = difficulty.tiers[word.tier]; card.dataset.rarity = rarity.key; card.style.setProperty('--rarity', rarity.color);
      const number = document.createElement('span'); number.className = 'dictionary-number'; number.textContent = `NO. ${String(wordIndex + 1).padStart(3, '0')}`;
      const title = document.createElement('strong'), subtitle = document.createElement('small');
      card.append(number);
      if (owned) {
        const image = document.createElement('img'); image.src = imgURL(word); image.alt = ''; image.loading = 'lazy'; card.append(image);
        title.textContent = lang === 'ja' ? word.ja : word.en; subtitle.textContent = lang === 'ja' ? word.w : word.ja;
        const mark = document.createElement('span'); mark.className = 'dictionary-owned-mark'; mark.innerHTML = icon('check'); card.append(mark);
        card.setAttribute('aria-label', `${title.textContent} · ${mode === 'ja' ? '獲得済み、詳細を見る' : 'collected, view entry'}`);
        if (lastAcquired?.lang === lang && lastAcquired.id === word.id) card.classList.add('just-collected');
        card.addEventListener('click', () => showDictionaryEntry(word, wordIndex, lang));
      } else {
        const placeholder = document.createElement('span'); placeholder.className = 'dictionary-placeholder'; placeholder.textContent = '?'; card.append(placeholder);
        title.textContent = mode === 'ja' ? '未獲得' : 'Not collected'; subtitle.textContent = mode === 'ja' ? 'タップして挑戦' : 'Tap to discover';
        card.setAttribute('aria-label', mode === 'ja' ? `未獲得 No.${String(wordIndex + 1).padStart(3, '0')} に挑戦` : `Discover missing word ${wordIndex + 1}`);
        card.addEventListener('click', () => beginDictionaryPuzzle(lang, wordIndex));
      }
      const rarityTag = document.createElement('span'); rarityTag.className = 'dictionary-rarity'; rarityTag.textContent = `${rarity.code} · ${rarity.name}`;
      card.append(title, subtitle, rarityTag); grid.append(card);
    }
    container.append(tabs, summary, meter, caption, filters, grid);
    if (!grid.childElementCount) { const empty = document.createElement('p'); empty.className = 'dictionary-empty'; empty.textContent = mode === 'ja' ? (dictionaryFilter === 'owned' ? '最初の正解で、最初の1ページをゲット。' : '未獲得のページはありません。辞書コンプリート！') : (dictionaryFilter === 'owned' ? 'Your first correct answer will unlock your first page.' : 'No missing pages. Dictionary complete!'); container.append(empty); }
    openModal(text().collection, container);
    if (focusControl === 'book') tabs.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
    if (focusControl === 'filter') filters.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
  }

  function showDictionaryEntry(word, wordIndex, lang) {
    const container = document.createElement('div'); container.className = 'dictionary-entry';
    const back = document.createElement('button'); back.type = 'button'; back.className = 'dictionary-back'; back.textContent = mode === 'ja' ? '← 辞書にもどる' : '← Back to dictionary';
    back.addEventListener('click', () => { renderDictionary(); $('modalBody').querySelector(`[data-word-id="${word.id}"]`)?.focus(); });
    const image = document.createElement('img'); image.src = imgURL(word); image.alt = word.ja;
    const heading = document.createElement('h3'); heading.textContent = lang === 'ja' ? word.ja : word.en;
    const profile = difficulty.challenge(word, lang), rarity = document.createElement('p'); rarity.className = 'entry-rarity'; rarity.style.setProperty('--rarity', profile.color);
    rarity.textContent = `${profile.code} · ${profile.name} · ${mode === 'ja' ? '難度' : 'DIFFICULTY'} ${profile.rank} / ${difficulty.tiers.length}`;
    const reading = document.createElement('p'); reading.className = 'entry-reading'; reading.textContent = lang === 'ja' ? word.w : `${word.ja} · ${word.w}`;
    const translation = document.createElement('p'); translation.className = 'entry-translation'; translation.textContent = lang === 'ja' ? `ENGLISH · ${word.en}` : `JAPANESE · ${word.w}`;
    const badges = document.createElement('div'); badges.className = 'entry-books';
    for (const language of ['ja', 'en']) {
      const owned = !!saved[language].stars[word.id], badge = document.createElement('span'); badge.className = owned ? 'owned' : '';
      badge.textContent = `${bookName(language)} · ${mode === 'ja' ? (owned ? '獲得済み' : '未獲得') : (owned ? 'collected' : 'missing')}`; badges.append(badge);
    }
    const best = document.createElement('p'); best.className = 'entry-stars'; best.textContent = '✦'.repeat(saved[lang].stars[word.id]);
    const other = lang === 'ja' ? 'en' : 'ja', challengeLang = saved[other].stars[word.id] ? lang : other;
    const challenge = document.createElement('button'); challenge.type = 'button'; challenge.className = 'modal-primary';
    challenge.textContent = challengeLang === lang ? (mode === 'ja' ? 'もう一度、この単語で遊ぶ' : 'Play this word again') : mode === 'ja' ? `${other === 'ja' ? '日本語' : '英語'}でもゲットする` : `Collect it in ${other === 'ja' ? 'Japanese' : 'English'}`;
    challenge.addEventListener('click', () => beginDictionaryPuzzle(challengeLang, wordIndex));
    container.append(back, image, heading, rarity, reading, translation, pronunciationPanel(word, lang), best, badges, challenge);
    openModal(bookName(lang), container); back.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') keyboardNavigation = true;
    if ($('modal').open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Backspace' && phase === 'playing') { event.preventDefault(); $('undo').click(); }
    if (event.key === 'Escape' && phase === 'playing') { cancelGesture(); resetSelection(); }
  });
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, { passive: true });
  if (catalog.length) loadLevel(index);
  else { $('game').dataset.state = 'error'; setFeedback('出題データを読み込めませんでした。ページを再読み込みしてください。', 'wrong'); }
})();
