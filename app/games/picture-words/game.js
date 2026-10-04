/* Pictlingo — standalone play, browser voices, and a curated dictionary excerpt. */
(async () => {
  'use strict';
  if(window.NICOLINGO_PHONE_HOST)return;
  const $ = id => document.getElementById(id);
  $('reloadGame').addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.set('refresh', String(Date.now()));
    location.replace(url.href);
  });
  const originalCatalog = window.PICTURE_WORDS_CATALOG || [];
  $('reloadReviewedData').addEventListener('click', () => $('reloadGame').click());
  if (!window.WordBloomReviewedScenes || !window.PICTURE_WORDS_CATALOG_META) {
    $('startPlay').disabled = true; $('startPlay').hidden = true; $('reloadReviewedData').hidden = false;
    $('offlineStatus').textContent = '確認済みデータを読み込めません。フォルダ一式を更新して、もう一度開いてください。';
    if (!$('launchScreen').open) $('launchScreen').showModal();
    return;
  }
  const difficulty = window.WordBloomDifficulty;
  const offline = await window.NicolingoOffline.ready();
  const sceneRuntime = new window.WordBloomReviewedScenes.Runtime({meta:window.PICTURE_WORDS_CATALOG_META,offline});
  const datasetState = await sceneRuntime.checkDataset();
  let datasetUnavailable = !datasetState.ok;
  const failedEntries = new Set();
  const catalog = datasetState.ok ? difficulty.bilingualCatalog(window.WordBloomReviewedScenes.filterCatalog(originalCatalog)) : [];
  const discovery = window.PictureWordsProgression;
  const byId = new Map(catalog.map(word => [word.id, word]));
  const supports = (word, lang) => !datasetUnavailable && !failedEntries.has(word.id) && offline.canPlay(word) && (lang === 'en' || !!word.w);
  const availableCount = lang => catalog.filter(word => supports(word, lang)).length;
  const { bilingualRound, finishLanguage, areNeighbours, connectedPath, advanceSelection, sweptHits, activeBatch, canSelectRing, planLetters } = window.WordBloomGesture;
  const KEY = 'word-bloom-v1';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    ja: {
      gardens: ['はじまりの庭', 'おいしい小道', 'どうぶつの森', '暮らしのアトリエ', '自然のたからもの', 'まだ見ぬ世界へ'],
      title: 'この絵、なんのことば？', instruction: '文字をなぞって、つなげよう',
      release: '', note: 'ひと筆でつなぎ、離して答える',
      shuffle: 'まぜる', hint: '答え', next: '次の単語をゲット', footer: '正解するたび、辞書が育つ。',
      collection: '辞書', found: '単語ゲット',
      connect: 'つなぐ', undo: 'もどす', correct: '単語ゲット！', wrong: 'おしい！ もう一度つないでみよう',
      short: '最後の文字まで、つないでみよう', mix: '新しい並びで、ひらめこう',
      tap: '', soundOff: '音声と効果音をオフ', soundOn: '音声と効果音をオン',
      help: '遊び方', levels: '好きなところから、ひとつずつ。', choose: 'ことばを選ぶ', stageSelect: 'ことば一覧',
      close: '閉じる', error: 'イラストを読み込めませんでした', retry: 'もう一度読み込む', skip: '次の絵へ',
      completed: '庭いっぱいに、ことばが咲いた。', chapterComplete: 'ひとつの庭が、花いっぱいに。',
      replay: 'もう一度、庭を歩く', allHinted: 'ヒントの文字を、順番につなごう',
      saved: '獲得した単語が辞書の1ページに。', replayed: '獲得済みの単語です。ベストの星を保存しました。',
    },
    en: {
      gardens: ['The first garden', 'A tasty little path', 'Animal friends', 'Everyday wonders', 'Treasures of nature', 'A world to discover'],
      title: 'One picture. Which word?', instruction: 'Swipe the letters. Find the word.',
      release: '', note: 'Connect in one stroke; release to answer',
      shuffle: 'Shuffle', hint: 'Answer', next: 'Collect the next word', footer: 'Every word fills another page.',
      collection: 'Dictionary', found: 'words collected',
      connect: 'connect', undo: 'undo', correct: 'WORD GET!', wrong: 'Almost! Give it another go.',
      short: 'Keep going to the last letter', mix: 'A fresh arrangement. A fresh idea.',
      tap: '', soundOff: 'Turn sound and voice off', soundOn: 'Turn sound and voice on',
      help: 'How to play', levels: 'A little wonder, wherever you begin.', choose: 'Choose a puzzle', stageSelect: 'WORDS',
      close: 'Close', error: 'This picture could not be loaded', retry: 'Try loading again', skip: 'Try the next picture',
      completed: 'A whole garden of words in bloom.', chapterComplete: 'Another garden, full of little wonders.',
      replay: 'Wander through again', allHinted: 'Connect the revealed letters in order',
      saved: 'A new page in your dictionary.', replayed: 'Already collected. Your best stars are saved.',
    },
  };

  function readSave() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { /* Storage is optional. */ }
    const value = { mode: raw.mode === 'ja' ? 'ja' : 'en', sound: raw.sound !== false, theme: raw.theme === 'dark' ? 'dark' : 'light', layout: raw.layout === 'mobile' || raw.layout === 'desktop' ? raw.layout : 'auto', targetTier: raw.routeVersion === 2 && Number.isInteger(raw.targetTier) && raw.targetTier >= -1 && raw.targetTier < difficulty.tiers.length ? raw.targetTier : -1, routeVersion: 2, discovery: discovery.hydrate(raw.discovery),
      answerRecords: raw.answerRecords && typeof raw.answerRecords === 'object' ? raw.answerRecords : {}, combo: 0, bestCombo: Number.isInteger(raw.bestCombo) && raw.bestCombo > 0 ? raw.bestCombo : 0 };
    for (const lang of ['ja', 'en']) {
      const old = raw[lang] || {};
      const stars = {};
      for (const [id, count] of Object.entries(old.stars || {})) if ([1, 2, 3].includes(count)) stars[id] = count;
      value[lang] = { index: difficulty.resumeIndex(raw, old, originalCatalog, catalog), stars };
    }
    return value;
  }
  const saved = readSave();
  let mode = saved.mode;
  let index = saved[mode].index;
  let round = null;
  let entry, roundScene = null, answer = [], nodes = [], selected = [], hintCount = 0, mistakes = 0;
  let phase = 'loading', generation = 0, pointer = null, wheelRect = null, shuffleBusy = false, boardHeight = 360;
  let feedbackTimer = 0;
  let dictionaryLanguage = mode, dictionaryFilter = 'all', lastAcquired = null, dictionaryPage = 0, dictionaryQuery = '';
  const DICTIONARY_PAGE_SIZE = 48;
  let advanceTimers = [];
  let keyboardNavigation = false;
  let comboEligible = true;
  const COMBO_STEP = 5;
  const comboLevel = value => value >= 10 ? 3 : value >= COMBO_STEP ? 2 : value >= 2 ? 1 : 0;
  let ringBatches = [[]], lastActiveBatch = -1;
  const PRAISE_TIME = 260;
  const REWARD_DURATION = 3600;
  const pending = new Set();
  const text = () => copy[mode];
  const progress = () => saved[mode];
  const rarityStars = tier => `<span class="art-stars" role="img" aria-label="${tier+1} stars">${Array.from({length:tier+1},()=>'<img src="../../assets/ui/word_et_star.png" alt="" width="64" height="64">').join('')}</span>`;
  const collectedCount = lang => catalog.filter(word => supports(word, lang) && saved[lang].stars[word.id]).length;
  const uniqueCount = () => catalog.filter(word => saved.ja.stars[word.id] || saved.en.stars[word.id]).length;
  const bookName = lang => lang === 'ja' ? '日本語' : '英語';
  const nextUncollected = (lang, after) => {
    const available = catalog.filter(word => supports(word, lang));
    const next = discovery.selectNext(available, saved, { language: lang, targetTier: saved.targetTier, afterId: catalog[after]?.id });
    return available[next] ? catalog.indexOf(available[next]) : -1;
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
  const imgStem = word => word.pic + (/^[0-9a-f]{64}$/.test(word.imageRevision || '') ? '@' + word.imageRevision : '');
  const imgURL = word => sceneRuntime.imageURL(word);
  let sceneRequest = 0, sceneReadingHold = false;
  const explanationFor = word => sceneRuntime.prepare(word);
  function showRewardExplanation(word) {
    const panel = $('rewardExplanation'); panel.hidden = true; panel.replaceChildren();
    if (phase !== 'solved' || entry.id !== word.id || roundScene?.status !== 'reviewed') return;
    window.IllustrationScenes.render(panel, roundScene); panel.hidden = false;
    sceneReadingHold = true; // Every offered puzzle now has a verified explanation.
  }

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
  let cluePlayback = false;
  const speech = new window.WordBloomSpeech.Pronunciation({
    onState: event => {
      sound.duck(event.state === 'queued' || event.state === 'speaking');
      if (event.kind === 'scene' && ['queued','speaking'].includes(event.state)) {
        $('winPronunciation').dataset.utteranceText = event.text;
        $('winPronunciation').dataset.utteranceLanguage = event.language;
      }
      if (cluePlayback) {
        const busy = event.state === 'queued' || event.state === 'speaking';
        const failed = event.state === 'error' || event.state === 'unavailable';
        $('listenClue').setAttribute('aria-busy', String(busy));
        $('listenClueLabel').textContent = busy ? '再生中' : failed ? '再試行' : '聞く';
        if (!busy) cluePlayback = false;
      }
      document.querySelectorAll('.pronunciation').forEach(panel => {
        if (panel.dataset.word !== event.wordId || panel.dataset.language !== event.language || (panel.dataset.kind === 'scene') !== (event.kind === 'scene')) return;
        panel.dataset.state = event.state;
        panel.classList.toggle('is-speaking', event.state === 'speaking');
        panel.setAttribute('aria-busy', String(event.state === 'queued' || event.state === 'speaking'));
        let message = '';
        if (event.state === 'queued') message = mode === 'ja' ? '発音を準備中…' : 'Getting the voice ready…';
        if (event.state === 'speaking') message = event.kind === 'scene' ? (mode === 'ja' ? '説明を読み上げ中…' : 'Reading the description…') : (mode === 'ja' ? `「${event.text}」を発音中` : `Listen: ${event.text}`);
        if (event.state === 'finished') message = mode === 'ja' ? '聞けたら、まねして言ってみよう！' : 'Your turn. Say it out loud!';
        if (event.state === 'muted') message = mode === 'ja' ? '右上の音声をオンにすると聞けます' : 'Turn sound on at the top to listen';
        if (event.state === 'unavailable') message = mode === 'ja' ? 'この端末では、この言語の音声を利用できません' : 'This language’s voice is unavailable on this device';
        if (event.state === 'error') message = event.error === 'not-allowed'
          ? (mode === 'ja' ? '「もう一度聞く」を押してね' : 'Tap Listen to try again')
          : (mode === 'ja' ? '音声を再生できませんでした。ボタンでもう一度どうぞ' : 'Voice playback failed. Tap Listen to try again.');
        if (event.state === 'idle') message = mode === 'ja' ? '何度でも聞いて、声に出してみよう' : 'Listen again, then try saying it';
        panel.querySelector('.pronunciation-status').textContent = message;
      });
    },
  });
  speech.setEnabled(saved.sound);

  function pronunciationPanel(word, language, sceneResult = null) {
    const narrating = sceneResult?.status === 'reviewed';
    const panel = document.createElement('div'); panel.className = 'pronunciation';
    panel.dataset.word = word.id; panel.dataset.language = language; panel.dataset.state = 'idle'; panel.dataset.kind = narrating ? 'scene' : 'word';
    panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', narrating ? (mode === 'ja' ? '説明を聞く' : 'Description audio') : (mode === 'ja' ? '単語の発音を聞く' : 'Word pronunciation'));
    const heading = document.createElement('div'); heading.className = 'pronunciation-heading';
    const spoken = narrating ? sceneResult.entry.scene[language] : (language === 'ja' ? word.w : word.en);
    heading.innerHTML = '<span class="voice-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    const label = document.createElement('span'); label.textContent = narrating ? (language === 'ja' ? '日本語' : 'ENGLISH') : `${spoken} · ${language === 'ja' ? '日本語' : 'ENGLISH'}`; heading.append(label);
    const buttons = document.createElement('div'); buttons.className = 'pronunciation-buttons';
    for (const slow of [false, true]) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.slow = String(slow);
      button.innerHTML = icon('sound') + `<span>${slow ? '0.65×' : '1×'}</span>`;
      button.title = `${narrating ? '解説' : '単語'}を${slow ? 'ゆっくり' : '通常速度で'}再生`;
      button.setAttribute('aria-label', mode === 'ja' ? `「${spoken}」を${slow ? 'ゆっくり' : 'もう一度'}聞く` : `${slow ? 'Listen slowly to' : 'Listen again to'} ${spoken}`);
      button.addEventListener('click', () => narrating ? speech.speakScene(word, sceneResult, language, slow) : speech.speak(word, language, slow)); buttons.append(button);
    }
    const status = document.createElement('span'); status.className = 'pronunciation-status'; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    status.textContent = saved.sound ? (mode === 'ja' ? '何度でも聞いて、声に出してみよう' : 'Listen again, then try saying it') : (mode === 'ja' ? '右上の音声をオンにすると聞けます' : 'Turn sound on at the top to listen');
    panel.append(buttons, status);
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
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.ceil(rect.width * this.dpr); this.canvas.height = Math.ceil(rect.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    clearPixels() {
      // Clear the physical backing store, including edges after browser-bar /
      // DPR changes. A transformed CSS-sized clear can leave colored trails.
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      const elapsed = Math.max(0, (time - this.last) / 1000), dt = Math.min(elapsed, .032); this.last = time;
      const ctx = this.ctx; this.clearPixels();
      this.items = this.items.filter(item => item.age < item.life);
      for (const p of this.items) {
        p.age += elapsed; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.celebration ? 220 : 35) * dt; p.angle += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
        ctx.fillStyle = p.color; ctx.beginPath();
        if (p.shape === 'star') { for (let k = 0; k < 10; k++) { const r = k % 2 ? p.size * .55 : p.size * 1.4, a = k * Math.PI / 5; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); }
        else if (p.shape === 'rect') ctx.rect(-p.size, -p.size * .45, p.size * 2, p.size * .9);
        else ctx.arc(0, 0, p.size * .8, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      this.frame = this.items.length ? requestAnimationFrame(t => this.draw(t)) : 0;
    }
    clear() { cancelAnimationFrame(this.frame); this.frame = 0; this.items = []; this.clearPixels(); }
  }
  const petals = new Petals();
  function vibrate(pattern) { if (pointer?.kind === 'touch' && navigator.vibrate) navigator.vibrate(pattern); }

  function setFeedback(message, kind = '', reset = false) {
    clearTimeout(feedbackTimer); $('feedback').textContent = message; $('feedback').className = `feedback ${kind}`;
    if (reset) feedbackTimer = setTimeout(() => { if (phase === 'playing') setFeedback(text().release); }, 2300);
  }
  function updateLabels() {
    $('listenClue').setAttribute('aria-label', '単語の発音を聞く');
    $('listenClue').disabled = !entry || !['playing','answer-demo','solved'].includes(phase);
    $('listenClueLabel').textContent = '';
    $('shuffle').setAttribute('aria-label', '文字をまぜる');
    $('hint').setAttribute('aria-label', '答えを見る');
    const t = text(); document.documentElement.lang = mode;
    document.title = 'Pictlingo';
    $('modeToggle').dataset.mode = mode === 'ja' ? 'en' : 'ja';
    $('modeToggle').setAttribute('aria-label', mode === 'ja' ? '英語に切り替える' : '日本語に切り替える');
    $('modeToggle').dataset.active = mode;
    $('modeLabel').innerHTML = `<span class="mode-ja">日本語</span><span aria-hidden="true">⇄</span><span class="mode-en">英語</span>`;
    const labels = { clueHeading: 'title', instruction: 'instruction', gestureNote: 'note', shuffleLabel: 'shuffle', hintLabel: 'hint',
      footerNote: 'footer', collectionLabel: 'collection', foundLabel: 'found',
      imageErrorText: 'error', retryImage: 'retry', skipImage: 'skip' };
    for (const [id, key] of Object.entries(labels)) $(id).textContent = t[key];
    $('shuffleLabel').textContent = 'まぜる'; $('hintLabel').textContent = '答え'; $('collectionLabel').textContent = '辞書';
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
  const effectiveLayout = () => new URLSearchParams(location.search).has('phone') ? 'mobile' : saved.layout !== 'auto' ? saved.layout : (innerWidth <= 860 ? 'mobile' : 'auto');
  function updateLayout() {
    document.documentElement.style.setProperty('--viewport-height', `${window.visualViewport?.height || innerHeight}px`);
    document.documentElement.dataset.layout = effectiveLayout();
    document.querySelectorAll('[data-layout-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layoutChoice === saved.layout)));
  }
  function renderCombo(event = '') {
    const value = saved.combo, level = comboLevel(value), meter = $('combo');
    meter.dataset.level = String(level); $('game').dataset.comboLevel = String(level);
    meter.hidden = true;
    $('comboCount').textContent = String(value);
    const filled = value === 0 ? 0 : value % COMBO_STEP || COMBO_STEP;
    [...$('comboPips').children].forEach((pip, i) => pip.classList.toggle('on', i < filled));
    $('comboBest').textContent = `BEST ${saved.bestCombo}`;
    meter.setAttribute('aria-label', mode === 'ja' ? `${value} コンボ、最高 ${saved.bestCombo}` : `${value} combo, best ${saved.bestCombo}`);
    if (event) { meter.classList.remove('bump', 'break'); void meter.offsetWidth; meter.classList.add(event); }
    const risky = value > 0;
    $('freeTag').textContent = '';
    $('hint').classList.remove('combo-risk');
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
    $('difficultyText').innerHTML = target ? rarityStars(saved.targetTier) : (mode === 'ja' ? 'おまかせ発見' : 'Discovery');
    $('chapterName').textContent = mode === 'ja' ? profile.ja : profile.en;
    $('rarityBadge').innerHTML = rarityStars(entry.tier);
    $('rarityBadge').setAttribute('aria-label', `${profile.rank} stars`);
    $('connectLabel').textContent = `${profile.name} CHALLENGE`;
    $('levelText').textContent = availableCount(mode).toLocaleString();
    $('pictureNumber').textContent = `NO. ${String(index + 1).padStart(3, '0')}`;
    const count = collectedCount(mode);
    $('foundCount').textContent = count;
    $('collectionCount').textContent = String(uniqueCount());
    $('collection').setAttribute('aria-label', mode === 'ja'
      ? `辞書を開く：日本語 ${collectedCount('ja')} / ${availableCount('ja')} 語、英語 ${collectedCount('en')} / ${availableCount('en')} 語`
      : `Open dictionaries: Japanese ${collectedCount('ja')} of ${availableCount('ja')}, English ${collectedCount('en')} of ${availableCount('en')}`);
    $('progress').replaceChildren(...catalog.slice(group * 10, group * 10 + 10).map((word, i) => {
      const dot = document.createElement('span'); dot.className = `progress-dot${stars[word.id] ? ' done' : ''}${i === index % 10 ? ' current' : ''}`;
      return dot;
    }));
    $('progress').setAttribute('aria-label', mode === 'ja' ? `この庭で ${catalog.slice(group * 10, group * 10 + 10).filter(word => stars[word.id]).length} / 10 語発見` : `Garden ${group + 1} progress`);
    renderDaily();
  }
  function renderDaily() {
    const daily = discovery.summary(saved.discovery);
    $('dailyCollection').classList.toggle('page-complete', daily.pageFilled === 10);
    $('dailyTitle').textContent = mode === 'ja' ? `きょうの ${daily.pageNumber} ページ目` : `TODAY · PAGE ${daily.pageNumber}`;
    $('dailyStreak').textContent = daily.streak ? (mode === 'ja' ? `${daily.streak}日つづいてる` : `${daily.streak} day streak`) : (mode === 'ja' ? '毎日、あたらしい発見' : 'A little discovery, every day');
    $('dailyCount').innerHTML = `${daily.pageFilled}<small> / 10</small>`;
    $('dailyMessage').textContent = mode === 'ja' ? (daily.pageFilled === 10 ? '完成！ もっと集めよう' : `あと${10 - daily.pageFilled}語でページ完成`) : (daily.pageFilled === 10 ? 'Page complete! Keep collecting' : `${10 - daily.pageFilled} ${daily.pageFilled === 9 ? 'discovery' : 'discoveries'} to fill this page`);
    $('dailySlots').replaceChildren(...Array.from({length:10}, (_, i) => {
      const slot = document.createElement('span'), word = byId.get(daily.pageIds[i]);
      slot.className = `daily-slot${word ? ' filled' : ''}${word?.id === lastAcquired?.id ? ' newest' : ''}`;
      if (word) { const img = document.createElement('img'); img.src = imgURL(word); img.alt = word.en; slot.append(img); }
      else slot.textContent = '·';
      return slot;
    }));
    $('dailyCollection').setAttribute('aria-label', mode === 'ja' ? `今日${daily.count}語を発見。${daily.pageNumber}ページ目、10枠中${daily.pageFilled}枠。辞書を開く` : `${daily.count} new words today. Page ${daily.pageNumber}, ${daily.pageFilled} of 10. Open dictionary`);
  }
  // A close-packed hexagonal lattice keeps strokes short without moving targets.
  function tileStep(total){return total<=4?100:total<=8?86:total<=14?68:total<=20?58:48;}
  function letterPositions(count, batch, dual, total = count) {
    const rowsByCount = {2:[2],3:[1,2],4:[2,2],5:[2,3],6:[3,3],7:[2,3,2],8:[3,2,3],9:[3,3,3],10:[3,4,3],11:[4,3,4],12:[4,4,4],13:[3,4,3,3],14:[3,4,3,4]};
    const rowCount=Math.ceil(total/(total>20?6:5));
    const rows=rowsByCount[total] || Array.from({length:rowCount},(_,i)=>Math.floor(total/rowCount)+(i<total%rowCount?1:0)), step=tileStep(total);
    const points=[];
    rows.forEach((length,row)=>{
      const first=-Math.floor((length+row)/2);
      for(let col=0;col<length;col++) points.push({x:(first+col+row/2)*step,y:row*step*Math.sqrt(3)/2});
    });
    const cx=(Math.min(...points.map(p=>p.x))+Math.max(...points.map(p=>p.x)))/2;
    const cy=(Math.min(...points.map(p=>p.y))+Math.max(...points.map(p=>p.y)))/2;
    for(const p of points){p.x+=180-cx;p.y+=180-cy;}
    if(!dual) return points;
    // Opening letters occupy the centre; later letters surround them without a hole.
    points.sort((a,b)=>Math.hypot(a.x-180,a.y-180)-Math.hypot(b.x-180,b.y-180));
    const inner=Math.min(6,Math.ceil(total/2));
    return batch===0?points.slice(0,inner):points.slice(inner);
  }
  function arrangeNodes(){
    const cells=letterPositions(nodes.length,0,false,nodes.length);
    const route=connectedPath(cells,tileStep(nodes.length));
    for(const node of nodes){const p=route[node.id];node.baseX=p.x;node.baseY=p.y;}
  }
  function layoutNodes() {
    const active = activeBatch(selected, ringBatches);
    $('wheel').dataset.activeRing = active === 0 ? 'inner' : 'outer';
    $('wheel').dataset.letterCount = String(nodes.length);
    for(const node of nodes){node.x=node.baseX;node.y=node.baseY;}
    const step=tileStep(nodes.length);
    const tileWidth=step*.94, pad=tileWidth/Math.sqrt(3)+4;
    const top=Math.min(...nodes.map(n=>n.y)),bottom=Math.max(...nodes.map(n=>n.y));
    boardHeight=bottom-top+pad*2;
    document.documentElement.style.setProperty('--board-ratio',String(boardHeight/360));
    $('wheel').style.setProperty('--hex-size',`${tileWidth/3.6}cqw`);
    $('wheel').style.aspectRatio=`360 / ${boardHeight}`;
    $('trail').setAttribute('viewBox',`0 0 360 ${boardHeight}`);
    for(const node of nodes){
      node.y=node.y-top+pad;
      node.button.style.left=`${node.x/3.6}%`;
      node.button.style.top=`${node.y/boardHeight*100}%`;
    }
  }

  function makeWheel() {
    let id=0;nodes=[];ringBatches=[[]];lastActiveBatch=-1;
    $('wheel').classList.remove('dual-ring');
    for(const lang of [mode])round.answers[lang].forEach((char,answerIndex)=>{
      const node={id:id++,char,lang,answerIndex,batch:0};
      const button=document.createElement('button');button.type='button';button.className='letter';
      button.dataset.node=String(node.id);button.dataset.lang=lang;button.textContent=char;
      button.setAttribute('aria-label',`${lang==='en'?'English':'かな'} ${char}`);button.setAttribute('aria-pressed','false');
      button.addEventListener('click',event=>{if(event.detail===0&&phase==='playing'&&!shuffleBusy){selectNode(node.id);if(selected.length===answer.length)checkAnswer();}});
      nodes.push({...node,button,x:0,y:0});
    });
    $('letters').replaceChildren(...nodes.map(n=>n.button));arrangeNodes();layoutNodes();
  }
  function renderAnswers(){
    $('answer').className='answer single-answer';
    $('answer').replaceChildren(...[mode].map(lang=>{
      const group=document.createElement('div');group.className='language-answer';group.dataset.lang=lang;
      const label=document.createElement('span');label.className='answer-language';label.textContent=lang==='en'?'ENGLISH':'かな';group.append(label);
      const tiles=document.createElement('div');tiles.className='answer-cells';
      for(const char of round.answers[lang]){const tile=document.createElement('span');tile.className='answer-tile';tiles.append(tile);}
      group.append(tiles);return group;
    }));
  }
  function updateAnswer(){
    if(!round)return;
    const word=selected.map(id=>nodes.find(n=>n.id===id).char);
    for(const lang of ['en','ja']){
      const group=$('answer').querySelector(`[data-lang="${lang}"]`);if(!group)continue;
      const done=round.completed[lang];group.classList.toggle('completed',done);
      group.querySelector('.answer-language').textContent=(lang==='en'?'ENGLISH':'かな')+(done?' ✓':'');
      [...group.querySelectorAll('.answer-tile')].forEach((tile,i)=>{
        const entered=mode===lang?word[i]:'';
        tile.textContent=done?round.answers[lang][i]:entered||(i<round.hints[lang]?round.answers[lang][i]:'');
        tile.className=`answer-tile${done?' solved':entered?' entered':i<round.hints[lang]?' hinted':''}`;
      });
    }
    $('answer').setAttribute('aria-label',`${mode==='en'?'English':'かな'} ${round.completed[mode]?'正解':word.join('')||'未入力'}`);
    for(const node of nodes){const chosen=selected.includes(node.id),done=round.completed[node.lang];
      node.button.classList.toggle('selected',chosen);node.button.classList.toggle('language-complete',done);
      node.button.classList.remove('outer-pending');node.button.disabled=done||phase==='solved';node.button.setAttribute('aria-pressed',String(chosen||done));
    }
    $('wheel').classList.toggle('has-selection',selected.length>0);
  }
  function drawTrail() {
    // Hex selection is shown by tile color only, including during a live stroke.
    $('trail').style.visibility='hidden';
    $('trailLine').setAttribute('points','');$('trailGlow').setAttribute('points','');
  }
  function resetSelection() {
    selected = []; updateAnswer(); drawTrail();
    for (const node of nodes) node.button.classList.remove('hint-target');
  }
  function selectNode(id) {
    if (phase !== 'playing') return;
    const candidate = nodes.find(node => node.id === id);
    if (selected.includes(id)) return;
    const previous=nodes.find(node=>node.id===selected.at(-1));
    const step=tileStep(nodes.length);
    if(previous && !areNeighbours(previous,candidate,step)) return;
    if(candidate.button.hidden || candidate.button.disabled || round.completed[candidate.lang])return;
    if(selected.length && candidate.lang!==mode)return;
    if(!selected.length){mode=candidate.lang;answer=round.answers[mode];hintCount=round.hints[mode];$('hint').disabled=false;}
    const next = advanceSelection(selected, id, answer.length);
    if (next === selected) return;
    selected = next;
    const node = nodes.find(item => item.id === id);
    node.button.classList.remove('hint-target');
    sound.pick(selected.length, node.x); vibrate(7);
    const rect = $('wheel').getBoundingClientRect();
    petals.burst(rect.left + node.x / 360 * rect.width, rect.top + node.y / boardHeight * rect.height, 10);
    updateAnswer(); drawTrail();
  }

  function pauseAdvance() {
    advanceTimers.forEach(id => { clearTimeout(id); pending.delete(id); }); advanceTimers = [];
    $('game').classList.remove('stage-out');
  }
  function queueAdvance(delay = REWARD_DURATION) {
    pauseAdvance();
    if (phase !== 'solved' || sceneReadingHold || $('modal').open || $('launchScreen').open || document.hidden) return;
    advanceTimers.push(later(() => $('game').classList.add('stage-out'), delay - 180));
    advanceTimers.push(later(() => {
      // Keep the pace: a solved word always leads to a different picture.
      // The paired language remains available through the central switch.
      loadLevel(nextUncollected(mode, index), true, true);
    }, delay));
  }
  function loadLevel(nextIndex, focusNext = false, keepPronunciation = false, keepHints = false, keepPicture = false) {
    // Language changes belong to the displayed entry, never to the next-word
    // selector or to a saved language-specific index. Keep it even if offline
    // availability changed after its picture finished loading.
    if (keepPicture && entry) nextIndex = catalog.indexOf(entry);
    else if (!catalog[nextIndex] || !offline.canPlay(catalog[nextIndex])) nextIndex = nextUncollected(mode, index);
    if (nextIndex < 0) { closePlay(); updateOfflineStatus(); return; }
    const retainedHintCount = keepHints ? hintCount : 0;
    const retainedScene = keepPicture ? roundScene : null;
    pauseAdvance(); generation++; clearPending(); cancelGesture();
    speech.stop(); // Sentence audio must not leak into the next puzzle.
    sound.stop(); petals.clear();
    document.querySelectorAll('.flying-letter, .collected-word, .collection-fly').forEach(el => el.remove());
    $('dailyCollection').classList.remove('just-collected');
    $('wordReward').hidden = true; $('collection').classList.remove('word-added');
    $('rewardScene').hidden = true; $('rewardScene').classList.remove('page-filled');
    if ($('rewardScene').hidePopover && $('rewardScene').matches(':popover-open')) $('rewardScene').hidePopover();
    $('rewardBackdrop').hidden = true;
    $('rankUp').hidden = true;
    $('winPronunciation').hidden = true; $('winPronunciation').replaceChildren();
    delete $('winPronunciation').dataset.utteranceText; delete $('winPronunciation').dataset.utteranceLanguage;
    sceneRequest++; roundScene = null; sceneReadingHold = false; $('rewardExplanation').hidden = true; $('rewardExplanation').replaceChildren();
    index = (nextIndex + catalog.length) % catalog.length; progress().index = index;
    entry = catalog[index];
    speech.prepare?.(entry);
    if (mode === 'ja' && !entry.w) mode = 'en';
    progress().index = index; progress().wordId = entry.id;
    const firstView=discovery.isFirstView(saved,entry.id);
    $('newCardBadge').hidden=true;
    const recordDisplay=()=>{ if($('launchScreen').open)return; $('newCardBadge').hidden=!firstView; saved.discovery=discovery.markSeen(saved.discovery,entry.id,mode); persist(); };
    round=bilingualRound(entry.en,entry.w); round.viewed={en:false,ja:false}; round.mistakes={en:0,ja:0};
    answer=round.answers[mode];
    selected = []; hintCount = Math.min(retainedHintCount, answer.length); mistakes = 0; shuffleBusy = false; phase = 'loading';
    comboEligible = hintCount === 0;
    $('rewardCombo').hidden = true; $('game').classList.remove('combo-win'); $('praise').classList.remove('show');
    $('game').dataset.state = phase; $('gameActions').hidden = false;
    $('wheel').classList.remove('mistake'); $('answer').classList.remove('mistake');
    $('hint').disabled = false; $('shuffle').disabled = false; $('imageError').hidden = true;
    updateLabels(); updateProgress(); renderCombo();
    renderAnswers();
    const profile = difficulty.challenge(entry, mode);
    $('answerInfo').textContent = mode === 'ja' ? `難度 ${profile.rank} · ${answer.length}文字 / ${profile.choices}択` : `LEVEL ${profile.rank} · ${answer.length} LETTERS / ${profile.choices} CHOICES`;
    makeWheel(); resetSelection(); setFeedback(text().release);
    $('gestureNote').textContent = mode === 'ja' ? '途中で離すとキャンセル' : 'Release an unfinished word to cancel';
    const version = generation, image = $('clueImage');
    image.alt = mode === 'ja' ? '答えを考えるためのイラスト' : 'Picture clue. What does it show?';
    if (keepPicture && retainedScene?.status === 'reviewed' && image.complete && image.naturalWidth > 0 && image.dataset.sceneId === entry.id) {
      roundScene = retainedScene;
      image.style.opacity = '1';
      image.style.animation = 'none';
      phase = 'playing'; $('game').dataset.state = phase; updateLabels(); recordDisplay();
      if (focusNext && keyboardNavigation) nodes[0]?.button.focus({ preventScroll: true });
    } else {
      image.style.opacity = '0';
      image.onload = () => {
        offline.refresh().then(updateOfflineStatus).catch(() => {});
        if (version !== generation) return;
        image.style.opacity = '1'; phase = 'playing'; $('game').dataset.state = phase; updateLabels(); recordDisplay();
        // Restart the picture entrance only when the picture itself changes.
        image.style.animation = 'none'; void image.offsetWidth; image.style.animation = '';
        // Discovery mixes ranks, so a random harder word is not a rank-up event.
        if (focusNext && keyboardNavigation) nodes[0]?.button.focus({ preventScroll: true });
      };
      const word = entry;
      const failScene = reason => {
        if (version !== generation) return;
        roundScene = null; failedEntries.add(word.id);
        if (['stale-catalog','manifest-unavailable','missing-catalog-provenance'].includes(reason)) datasetUnavailable = true;
        phase = 'error'; $('game').dataset.state = phase; $('imageError').hidden = false; $('imageError').dataset.reason = reason;
        $('hint').disabled = true; $('shuffle').disabled = true; $('listenClue').disabled = true;
        setFeedback(mode === 'ja' ? '画像と説明を確認できません。最新版に再読み込みしてください。' : 'The picture and description could not be verified. Reload the latest data.', 'wrong');
        updateOfflineStatus();
      };
      image.onerror = () => failScene('image-decode-failed');
      sceneRuntime.prepare(word).then(result => {
        if (version !== generation || entry.id !== word.id) return;
        if (result.status !== 'reviewed') { failScene(result.reason); return; }
        roundScene = result; datasetUnavailable = false; failedEntries.delete(word.id);
        image.dataset.sceneId = word.id; image.src = result.imageURL;
      }).catch(() => failScene('image-unavailable'));
    }
  }

  function showRankUp(profile) {
    $('rankUpName').innerHTML = rarityStars(profile.rank-1);
    $('rankUpDetail').textContent = '';
    $('rankUpDiamonds').textContent = '';
    $('rankUp').hidden = false;
    const rect = $('pictureCard').getBoundingClientRect(); petals.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, true);
    later(() => { $('rankUp').hidden = true; }, 1150);
  }

  function flyLetters() {
    if (reducedMotion.matches) return;
    const slots = [...$('answer').querySelectorAll(`[data-lang="${mode}"] .answer-tile`)];
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
    const result=finishLanguage(round,mode,word);
    if(result!=='incorrect'){win();return;}
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
  function clearScore(missCount, viewed) {
    return Math.max(0, 100 - 10 * missCount - (viewed ? 30 : 0));
  }
  function scoreStamp(score, viewed) {
    const petals = Array.from({length:16}, (_,i) => {
      const a=i*Math.PI/8, b=(i+.5)*Math.PI/8, c=(i+1)*Math.PI/8;
      return `${i?'':'M '+(100+77*Math.cos(a))+' '+(100+77*Math.sin(a))} Q ${100+106*Math.cos(b)} ${100+106*Math.sin(b)} ${100+77*Math.cos(c)} ${100+77*Math.sin(c)}`;
    }).join(' ');
    const outline = score===100 ? `<path d="${petals} Z"/><circle cx="100" cy="100" r="65"/>` : '<circle cx="100" cy="100" r="82"/><circle cx="100" cy="100" r="73"/>';
    return `<svg viewBox="0 0 200 200" aria-hidden="true">${outline}</svg><strong>${score}<small>点</small></strong><span>${score===100?'はなまる':viewed?'答えを見た':'正解'}</span>`;
  }
  function win() {
    if (roundScene?.status !== 'reviewed') return;
    speech.speakScene(entry, roundScene, mode); // Already verified before play; keep the answer gesture's audio activation.
    $('rankUp').hidden = true;
    phase = 'solved'; $('game').dataset.state = phase; updateLabels(); flyLetters(); vibrate([12, 35, 20]);
    if (comboEligible) { saved.combo++; saved.bestCombo = Math.max(saved.bestCombo, saved.combo); }
    const combo = comboEligible ? saved.combo : 0, newBest = combo >= 2 && combo === saved.bestCombo;
    sound.win(combo); renderCombo(combo ? 'bump' : '');
    const stars = Math.max(1, 3 - Math.min(2, (round.viewed[mode] ? 2 : 0) + (mistakes > 0 ? 1 : 0)));
    const first = !saved[mode].stars[entry.id];
    const newDiscovery = !saved.ja.stars[entry.id] && !saved.en.stars[entry.id];
    const award = discovery.collect(saved.discovery, entry.id, mode, {isNew: newDiscovery});
    saved.discovery = award.discovery;
    const wordRecords=saved.answerRecords[entry.id] ||= {};
    const record=wordRecords[mode] || {independent:0,assisted:0};
    const recordKind=round.viewed[mode]?'assisted':'independent';
    record[recordKind]=(Number(record[recordKind])||0)+1;
    const score = clearScore(mistakes, round.viewed[mode]);
    record.lastScore = score; record.bestScore = Math.max(record.bestScore || 0, score);
    record.last=recordKind; record.lastAt=new Date().toISOString();
    wordRecords[mode]=record;
    saved[mode].stars[entry.id]=Math.max(saved[mode].stars[entry.id]||0,stars);persist();
    if (first) lastAcquired = { lang: mode, id: entry.id };
    updateAnswer();
    $('answerInfo').textContent = `${'✦'.repeat(stars)}${'✧'.repeat(3 - stars)}  ${mode === 'ja' ? entry.ja : entry.en.toUpperCase()}`;
    const complete = collectedCount(mode) === availableCount(mode);
    const both = !!saved.ja.stars[entry.id] && !!saved.en.stars[entry.id];
    setFeedback(first ? (complete ? `${bookName(mode)} ${mode === 'ja' ? 'コンプリート！' : 'complete!'}` : text().correct) : (mode === 'ja' ? '正解！ この単語は獲得済み' : 'Correct! Already collected.'), 'success');
    $('game').dataset.record = recordKind;
    $('pictureStamp').innerHTML = scoreStamp(score, round.viewed[mode]);
    $('rewardScene').dataset.record=recordKind;
    $('rewardScene').dataset.score=String(score);
    $('rewardScene').classList.toggle('page-complete', award.pageCompleted);
    $('dailyReward').classList.toggle('complete', award.pageCompleted);
    $('dailyReward').textContent = mode === 'ja' ? (award.added ? `今日 ${award.daily.count} 語目の発見！${award.pageCompleted ? ' 10枚そろった！' : ''}` : '覚えたことばが、またひとつ強くなる') : (award.added ? `Discovery ${award.daily.count} today!${award.pageCompleted ? ' All 10 stamps collected!' : ''}` : 'Another word, remembered');
    $('rewardScene').classList.toggle('bilingual-clear', both);
    $('rewardScene').style.setProperty('--rarity', difficulty.tiers[entry.tier].color);
    $('rewardScene').dataset.rarity = difficulty.tiers[entry.tier].key;
    $('rewardWord').textContent = mode === 'ja' ? entry.ja : entry.en.toUpperCase();
    $('rewardReading').textContent = mode === 'ja' ? entry.w : entry.ja;
    showRewardExplanation(entry);
    $('rewardBookName').textContent = mode === 'ja' ? `きょうの ${award.daily.pageNumber} ページ目` : `TODAY · PAGE ${award.daily.pageNumber}`;
    $('rewardArt').src = imgURL(entry);
    $('rewardPageNumber').textContent = `PAGE ${String(index + 1).padStart(3, '0')}`;
    $('rewardBefore').textContent = String(award.daily.pageFilled - (award.added ? 1 : 0));
    $('rewardAfter').textContent = String(award.daily.pageFilled);
    $('rewardTotal').textContent = ' / 10';
    $('rewardProgress').textContent = mode === 'ja' ? `辞書に ${uniqueCount()} 語 / ${catalog.length} 語` : `${uniqueCount()} / ${catalog.length} words discovered`;
    $('rewardSeal').innerHTML = scoreStamp(score, round.viewed[mode]);
    $('rewardSeal').setAttribute('aria-label', `${score}点${score===100?'、花丸':round.viewed[mode]?'、答えを見た':''}`);
    $('advanceLabel').textContent = '次の問題へ →';
    const library = $('rewardShelf'); library.className = 'book-shelf book-library-grid';
    library.replaceChildren(...Array.from({length:10}, (_, pageIndex) => {
      const word = byId.get(award.daily.pageIds[pageIndex]);
      const page = document.createElement('span');
      const owned = !!word, newest = word?.id === entry.id && award.added;
      page.className = `library-page${owned ? ' owned' : ''}${newest ? ' newest' : ''}`;
      page.dataset.wordId = word?.id || ''; page.dataset.page = String(pageIndex + 1);
      if (word) { const image = document.createElement('img'); image.src = imgURL(word); image.alt = ''; page.append(image); }
      page.setAttribute('aria-hidden', 'true');
      return page;
    }));
    $('wordReward').setAttribute('aria-label', `${bookName(mode)} ${mode === 'ja' ? 'を開く' : '— open'}`);
    $('rewardStars').replaceChildren(...[0, 1, 2].map(i => { const star = document.createElement('i'); star.textContent = '★'; star.style.setProperty('--i', i); star.className = i < stars ? 'on' : ''; return star; }));
    $('hint').disabled = true; $('shuffle').disabled = true;
    if (recordKind === 'independent') showPraise(stars, combo);
    const wheelRect = $('wheel').getBoundingClientRect();
    petals.burst(wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2, recordKind === 'independent' ? 100 : 12, recordKind === 'independent' ? 'gold' : true);
    $('centerLabel').textContent = 'bloom!';
    const comboBanner = $('rewardCombo'), milestone = combo >= COMBO_STEP && combo % COMBO_STEP === 0;
    comboBanner.hidden = combo < 2; comboBanner.dataset.level = String(comboLevel(combo)); comboBanner.classList.toggle('milestone', milestone);
    $('rewardComboCount').textContent = `${combo}${mode === 'ja' ? '問連続正解' : ' in a row'}`;
    comboBanner.querySelector('span').textContent = '';
    $('rewardComboNote').textContent = mode === 'ja' ? '答えを見ず・間違いなしで正解' : 'Correct without hints or mistakes';
    $('game').classList.toggle('combo-win', combo >= 2);
    $('rewardScene').classList.toggle('has-combo', combo >= 2);
    later(() => {
      $('wordReward').hidden = false; $('rewardScene').hidden = false;
      $('rewardScroll').scrollTop = 0;
      $('rewardScene').showPopover?.(); $('rewardBackdrop').hidden = false;
      const rect = $('wordReward').getBoundingClientRect();
      petals.burst(rect.left + rect.width / 2, rect.top + rect.height / 3, recordKind === 'independent' ? 170 : 18, recordKind === 'independent' ? 'gold' : true);
      if (recordKind === 'independent' && (milestone || award.pageCompleted)) later(() => { petals.burst(innerWidth / 2, innerHeight * .25, 150, 'gold'); sound.win(10); }, 380);
      later(() => { $('rewardScene').classList.add('page-filled'); updateProgress(); }, 420);
      if (award.added) later(animateAcquisition, 500);
    }, reducedMotion.matches ? 0 : PRAISE_TIME);
    $('winPronunciation').replaceChildren(pronunciationPanel(entry, mode, roundScene)); $('winPronunciation').hidden = false;
    queueAdvance(award.pageCompleted ? 4400 : REWARD_DURATION);
  }

  function animateAcquisition() {
    $('dailyCollection').classList.add('just-collected');
    $('collection').classList.remove('word-added'); void $('collection').offsetWidth; $('collection').classList.add('word-added');
    if (reducedMotion.matches) return;
    const from = $('rewardArt').getBoundingClientRect();
    const target = $('rewardShelf').querySelector(`[data-word-id="${entry.id}"]`) || $('collection');
    const to = target.getBoundingClientRect();
    const token = document.createElement('span'), image = document.createElement('img');
    token.className = 'collected-word'; token.setAttribute('aria-hidden', 'true'); image.src = imgURL(entry); image.alt = '';
    // Keep the flying picture in the popover's top layer, above the open book.
    const scene = $('rewardScene'), sceneRect = scene.getBoundingClientRect();
    token.append(image); token.style.position = 'absolute'; token.style.zIndex = '20';
    token.style.left = `${from.right - sceneRect.left - 60}px`; token.style.top = `${from.bottom - sceneRect.top + scene.scrollTop - 60}px`; scene.append(token);
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
    return { x: (event.clientX - rect.left) / rect.width * 360, y: (event.clientY - rect.top) / rect.height * boardHeight };
  }
  function hitRadius(node) { return Math.min(52, node.button.offsetWidth / (wheelRect.width / 360) / 2 + 5); }
  function nearest(point) {
    return nodes.filter(node => !node.button.hidden && !node.button.disabled && (!selected.length || node.lang===mode)).map(node => ({ node, distance: Math.hypot(node.x - point.x, node.y - point.y) }))
      .filter(hit => hit.distance <= hitRadius(hit.node)).sort((a, b) => a.distance - b.distance)[0]?.node;
  }
  // Swept-segment intersection keeps fast swipes from skipping a letter between events.
  // Passing over a letter needs a firmer touch than starting on one, so grazing a neighbour
  // on the way across a crowded ring does not pick it up by accident.
  function passRadius(node) { return node.button.offsetWidth / (wheelRect.width / 360) / 2 * .85; }
  function sweep(from, to) {
    for (const id of sweptHits(nodes.filter(node => !node.button.hidden), from, to, passRadius)) selectNode(id);
  }
  function cancelGesture() {
    if (pointer && $('wheel').hasPointerCapture?.(pointer.id)) $('wheel').releasePointerCapture(pointer.id);
    pointer = null; wheelRect = null; $('wheel').classList.remove('dragging');
    if (nodes.length && phase !== 'solved') { selected = []; updateAnswer(); drawTrail(); }
  }
  $('wheel').addEventListener('pointerdown', event => {
    if (phase !== 'playing' || shuffleBusy || pointer || !event.isPrimary || event.button !== 0 || event.target.closest('#shuffle')) return;
    resetSelection();
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
    const pointerId = pointer.id;
    pointer = null; wheelRect = null;
    if ($('wheel').hasPointerCapture(pointerId)) $('wheel').releasePointerCapture(pointerId);
    $('wheel').classList.remove('dragging'); drawTrail();
    if (selected.length >= answer.length) checkAnswer();
    else { resetSelection(); setFeedback(text().release); }
  });
  $('wheel').addEventListener('pointercancel', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('lostpointercapture', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('contextmenu', event => event.preventDefault());
  window.addEventListener('blur', cancelGesture);
  window.addEventListener('resize', () => { if (pointer) cancelGesture(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseAdvance(); cancelGesture(); speech.stop(); sound.stop(); petals.clear(); }
    else { renderDaily(); queueAdvance(850); }
  });
  window.addEventListener('pagehide', () => speech.stop());

  $('undo').addEventListener('click', () => {
    if (phase !== 'playing' || !selected.length) return;
    selected.pop(); sound.undo(); updateAnswer(); drawTrail();
  });
  let shuffleTap = null;
  $('shuffle').addEventListener('pointerdown', event => { shuffleTap = {x:event.clientX,y:event.clientY,moved:false}; });
  $('shuffle').addEventListener('pointermove', event => { if (shuffleTap && Math.hypot(event.clientX-shuffleTap.x,event.clientY-shuffleTap.y)>8) shuffleTap.moved=true; });
  $('shuffle').addEventListener('pointercancel', () => { if(shuffleTap) shuffleTap.moved=true; });
  $('shuffle').addEventListener('click', event => {
    const dragged = event.detail > 0 && (!shuffleTap || shuffleTap.moved);
    shuffleTap = null;
    if (phase !== 'playing' || shuffleBusy || pointer || dragged) return;
    cancelGesture(); sound.unlock(); sound.mix(); shuffleBusy = true;
    const old = nodes.map(node => node.id).join(','); shuffle(nodes);
    if (nodes.map(node => node.id).join(',') === old) nodes.push(nodes.shift());
    arrangeNodes(); layoutNodes(); setFeedback(text().mix, '', true);
    later(() => { shuffleBusy = false; }, reducedMotion.matches ? 0 : 470);
  });
  $('listenClue').addEventListener('click', () => {
    if (!entry || !['playing','answer-demo','solved'].includes(phase)) return;
    cluePlayback = true;
    speech.speak(entry, mode, false, true);
  });
  $('hint').addEventListener('click', () => {
    if (phase !== 'playing' || shuffleBusy) return;
    cancelGesture(); resetSelection(); sound.unlock(); sound.hint(); breakCombo(); comboEligible=false;
    round.viewed[mode]=true;
    // Demonstrate the current language route without solving either language or filling answer slots.
    phase='answer-demo'; $('game').dataset.state=phase;
    $('hint').disabled=true; $('shuffle').disabled=true;
    let tick=0;
    for(const language of [mode]) {
      const route=nodes.filter(node=>node.lang===language).sort((a,b)=>a.answerIndex-b.answerIndex);
      for(const node of route) {
        const at=tick++ * 160;
        later(()=>{node.button.classList.add('answer-wave');setFeedback(`${language==='en'?'ENGLISH':'かな'} ${node.answerIndex+1} / ${route.length}`);},at);
        later(()=>node.button.classList.remove('answer-wave'),at+210);
      }
    }
    later(()=>{phase='playing';$('game').dataset.state=phase;$('hint').disabled=false;$('shuffle').disabled=false;setFeedback('答えを見た記録が残ります。なぞって辞書をゲット！');},tick*160);
  });
  $('sound').addEventListener('click', () => {
    saved.sound = !saved.sound; speech.setEnabled(saved.sound); persist(); updateSound(); updateLabels();
    if (saved.sound) { sound.unlock(); sound.hint(); } else sound.stop();
  });
  $('theme').addEventListener('click', () => {
    saved.theme = saved.theme === 'dark' ? 'light' : 'dark'; persist(); updateTheme();
  });
  window.addEventListener('resize', updateLayout);
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
    if(!entry || !['playing','answer-demo'].includes(phase) || mode===button.dataset.mode)return;
    round.mistakes[mode]=mistakes;
    cancelGesture();generation++;clearPending();speech.stop();
    mode=button.dataset.mode;answer=round.answers[mode];hintCount=0;mistakes=round.mistakes[mode];
    comboEligible=!round.viewed[mode] && mistakes===0;selected=[];shuffleBusy=false;phase='playing';
    $('game').dataset.state=phase;$('hint').disabled=false;$('shuffle').disabled=false;
    updateLabels();renderAnswers();makeWheel();updateAnswer();drawTrail();updateProgress();persist();
    setFeedback('');
  }));
  $('retryImage').addEventListener('click', () => loadLevel(index));
  $('skipImage').addEventListener('click', () => loadLevel(nextUncollected(mode, index)));
  $('advanceLabel').addEventListener('click', () => { if (phase === 'solved') loadLevel(nextUncollected(mode, index), true, true); });

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
      '英語か日本語を選び、絵を見て答えを考えます。途中で言語を変えても同じ絵のままです。',
      '隣り合う六角形を一筆でつなぎます。途中で離すと取り消します。',
      '選んだ言語を正解すると、その言語の辞書に登録します。',
      '答えボタンは正解の順に文字を光らせます。自力と答えを見た記録は言語ごとに保存します。'
    ] : [
      'Choose English or Japanese. Switching language keeps the same picture.',
      'Connect neighbouring hex tiles in one stroke. An unfinished stroke is cancelled.',
      'Solve the selected language to collect its dictionary entry.',
      'Answer demonstrates the current solution. Independent and assisted clears are recorded per language.'
    ];
    const note=mode==='ja'?'同じ文字も別々のマスとしてつなぎます。離れたマスや別の言語のマスには飛べません。':'Repeated letters have separate tiles. You cannot jump to a distant tile or switch languages during a stroke.';
    openModal(text().help, `<div class="help-steps">${steps.map((line, i) => `<div class="help-step"><b>${i + 1}</b><p>${line}</p></div>`).join('')}</div><p class="help-note">${note}</p>${layoutSettings()}<button class="modal-primary" id="startPlaying" type="button">${mode === 'ja' ? 'ことばを咲かせよう' : 'Let it bloom'}</button>`);
    $('startPlaying').addEventListener('click', () => $('modal').close());
    $('modalBody').querySelectorAll('[data-layout-choice]').forEach(button => button.addEventListener('click', () => { saved.layout = button.dataset.layoutChoice; persist(); updateLayout(); }));
    $('modalBody').querySelectorAll('[data-theme-choice]').forEach(button => button.addEventListener('click', () => {
      saved.theme = button.dataset.themeChoice; persist(); updateTheme();
      $('modalBody').querySelectorAll('[data-theme-choice]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    }));
    updateLayout();
  });
  function openDifficulty() {
    const title = '難易度';
    const intro = document.createElement('p'); intro.className = 'modal-copy'; intro.textContent = '星が少ないほど簡単な単語です。';
    const grid = document.createElement('div'); grid.className = 'difficulty-grid';
    const automatic = document.createElement('button'); automatic.type = 'button'; automatic.className = 'difficulty-choice';
    automatic.setAttribute('aria-pressed', String(saved.targetTier === -1)); automatic.textContent = 'おまかせ';
    automatic.addEventListener('click', () => { saved.targetTier = -1; persist(); $('modal').close(); loadLevel(nextUncollected(mode, index), true); }); grid.append(automatic);
    difficulty.tiers.forEach((tier, tierIndex) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'difficulty-choice';
      button.dataset.tier = String(tierIndex); button.style.setProperty('--tier-color', tier.color);
      button.setAttribute('aria-pressed', String(saved.targetTier === tierIndex));
      button.innerHTML = rarityStars(tierIndex);
      button.addEventListener('click', () => {
        saved.targetTier = tierIndex; persist(); $('modal').close();
        loadLevel(nextUncollected(mode, index), true);
      });
      grid.append(button);
    });
    const panel = document.createElement('div'); panel.append(intro, grid); openModal(title, panel);
  }
  $('difficulty').addEventListener('click', openDifficulty);
  $('launchDifficulty').addEventListener('click', openDifficulty);
  $('levels').addEventListener('click', () => { dictionaryLanguage = mode; dictionaryFilter = 'missing'; dictionaryPage = 0; dictionaryQuery = ''; renderDictionary(); });
  function openDictionary() { dictionaryLanguage = mode; dictionaryFilter = 'owned'; dictionaryPage = 0; dictionaryQuery = ''; renderDictionary(); }
  $('collection').addEventListener('click', openDictionary);
  $('dailyCollection').addEventListener('click', () => { dictionaryLanguage = mode; dictionaryFilter = 'owned'; dictionaryPage = 0; dictionaryQuery = ''; renderDictionary(); });
  $('wordReward').addEventListener('click', openDictionary);

  function beginDictionaryPuzzle(lang, targetIndex) {
    $('modal').close(); mode = lang; loadLevel(targetIndex, true);
    $('clueHeading').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  }

  function renderDictionary(focusControl = '') {
    const lang = dictionaryLanguage, count = collectedCount(lang), totalWords = availableCount(lang), percent = totalWords ? Math.floor(count / totalWords * 100) : 0;
    const todayIds = new Set(discovery.summary(saved.discovery).todayIds);
    const container = document.createElement('div'); container.className = 'dictionary';
    const tabs = document.createElement('div'); tabs.className = 'dictionary-tabs'; tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', mode === 'ja' ? '表示する辞書' : 'Choose a dictionary');
    for (const language of ['ja', 'en']) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.book = language;
      button.setAttribute('aria-pressed', String(language === lang));
      button.innerHTML = `${icon('book')}<span>${bookName(language)}<small>${collectedCount(language)} / ${availableCount(language)}</small></span>`;
      button.addEventListener('click', () => { dictionaryLanguage = language; dictionaryPage = 0; renderDictionary('book'); }); tabs.append(button);
    }
    const summary = document.createElement('div'); summary.className = 'dictionary-summary';
    summary.innerHTML = `<div><span class="eyebrow">コレクション</span><p><b>${count}</b> / ${totalWords} <span>語</span></p></div><strong>${percent}<small>%</small></strong>`;
    const meter = document.createElement('div'); meter.className = 'dictionary-meter'; meter.setAttribute('role', 'progressbar');
    meter.setAttribute('aria-label', bookName(lang)); meter.setAttribute('aria-valuenow', String(count)); meter.setAttribute('aria-valuemin', '0'); meter.setAttribute('aria-valuemax', String(totalWords));
    const fill = document.createElement('span'); fill.style.width = `${percent}%`; meter.append(fill);
    const caption = document.createElement('p'); caption.className = 'dictionary-caption';
    const daily = discovery.summary(saved.discovery);
    caption.textContent = `獲得 ${count}語`;
    const filters = document.createElement('div'); filters.className = 'dictionary-filters'; filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', mode === 'ja' ? '獲得状況で絞り込む' : 'Filter by collection status');
    for (const [value, label, total] of [['owned', '獲得済み', count], ['missing', '未獲得', totalWords - count], ['all', 'すべて', totalWords], ['independent','自力',Object.values(saved.answerRecords).filter(r=>r[lang]?.independent>0).length], ['assisted','答えを見た',Object.values(saved.answerRecords).filter(r=>r[lang]?.assisted>0).length]]) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = `${label} ${total}`; button.dataset.filter = value;
      button.setAttribute('aria-pressed', String(dictionaryFilter === value)); button.addEventListener('click', () => { dictionaryFilter = value; dictionaryPage = 0; renderDictionary('filter'); }); filters.append(button);
    }
    const search = document.createElement('input'); search.type = 'search'; search.className = 'dictionary-search'; search.value = dictionaryQuery;
    search.placeholder = 'ことばを探す'; search.setAttribute('aria-label', search.placeholder);
    const updateSearch = event => { if (event.isComposing) return; dictionaryQuery = search.value; dictionaryPage = 0; renderDictionary('search'); };
    search.addEventListener('input', updateSearch); search.addEventListener('compositionend', updateSearch);
    const grid = document.createElement('div'); grid.className = 'dictionary-grid';
    const collator = new Intl.Collator(lang);
    const query = dictionaryQuery.trim().toLocaleLowerCase();
    const words = catalog.map((word, wordIndex) => ({ word, wordIndex })).filter(({word}) => supports(word,lang) && (!['independent','assisted'].includes(dictionaryFilter) || saved.answerRecords[word.id]?.[lang]?.[dictionaryFilter]>0) && (dictionaryFilter !== 'today' || todayIds.has(word.id)) && (dictionaryFilter !== 'owned' || saved[lang].stars[word.id]) && (dictionaryFilter !== 'missing' || !saved[lang].stars[word.id]) && (!query || `${word.en} ${word.ja} ${word.w}`.toLocaleLowerCase().includes(query))).sort((a, b) => collator.compare(lang === 'ja' ? a.word.w : a.word.en, lang === 'ja' ? b.word.w : b.word.en));
    const pages = Math.max(1, Math.ceil(words.length / DICTIONARY_PAGE_SIZE)); dictionaryPage = Math.min(dictionaryPage, pages - 1);
    for (const { word, wordIndex } of words.slice(dictionaryPage * DICTIONARY_PAGE_SIZE, (dictionaryPage + 1) * DICTIONARY_PAGE_SIZE)) {
      const owned = !!saved[lang].stars[word.id];
      const card = document.createElement('button'); card.type = 'button'; card.className = `dictionary-card ${owned ? 'owned' : 'missing'}`; card.dataset.wordId = word.id;
      const rarity = difficulty.tiers[word.tier]; card.dataset.rarity = rarity.key; card.style.setProperty('--rarity', rarity.color);
      const number = document.createElement('span'); number.className = 'dictionary-number'; number.textContent = `NO. ${String(wordIndex + 1).padStart(3, '0')}`;
      const title = document.createElement('strong'), subtitle = document.createElement('small');
      card.append(number);
      if (owned) {
        const image = document.createElement('img'); image.src = imgURL(word); image.alt = ''; image.loading = 'lazy'; card.append(image);
        title.textContent = lang === 'ja' ? word.ja : word.en; subtitle.textContent = lang === 'ja' ? word.w : word.ja;
        const mark = document.createElement('span'); mark.className = 'dictionary-owned-mark'; mark.innerHTML = icon('check'); card.append(mark);
        const recordLabel=document.createElement('small');recordLabel.className='answer-record';
        const record=saved.answerRecords[word.id]?.[lang];
        recordLabel.textContent=record?`自力 ${record.independent||0}回 / 答えを見た ${record.assisted||0}回`:saved.answerRecords[word.id]?.last?'旧・両言語の獲得記録あり':'以前の獲得（記録なし）';if(record && Number.isFinite(record.bestScore))recordLabel.textContent += ` · 最高 ${record.bestScore}点`;card.append(recordLabel);
        card.setAttribute('aria-label', `${title.textContent} · ${mode === 'ja' ? '獲得済み、詳細を見る' : 'collected, view entry'}`);
        if (lastAcquired?.lang === lang && lastAcquired.id === word.id) card.classList.add('just-collected');
        card.addEventListener('click', () => showDictionaryEntry(word, wordIndex, lang));
      } else {
        const placeholder = document.createElement('span'); placeholder.className = 'dictionary-placeholder'; placeholder.textContent = '?'; card.append(placeholder);
        title.textContent = mode === 'ja' ? '未獲得' : 'Not collected'; subtitle.textContent = mode === 'ja' ? 'タップして挑戦' : 'Tap to discover';
        card.setAttribute('aria-label', mode === 'ja' ? `未獲得 No.${String(wordIndex + 1).padStart(3, '0')} に挑戦` : `Discover missing word ${wordIndex + 1}`);
        card.addEventListener('click', () => beginDictionaryPuzzle(lang, wordIndex));
      }
      const rarityTag = document.createElement('span'); rarityTag.className = 'dictionary-rarity'; rarityTag.innerHTML = rarityStars(word.tier);
      card.append(title, subtitle, rarityTag); grid.append(card);
    }
    const paging = document.createElement('div'); paging.className = 'dictionary-pages';
    for (const delta of [-1,1]) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = delta < 0 ? '←' : '→'; button.disabled = dictionaryPage + delta < 0 || dictionaryPage + delta >= pages;
      button.setAttribute('aria-label', delta < 0 ? 'Previous page' : 'Next page');
      button.addEventListener('click', () => { dictionaryPage += delta; renderDictionary(); }); paging.append(button);
      if (delta < 0) { const label = document.createElement('span'); label.textContent = `${dictionaryPage + 1} / ${pages} · ${words.length.toLocaleString()}`; paging.append(label); }
    }
    container.append(tabs, summary, meter, caption, filters, search, paging, grid);
    if (!grid.childElementCount) { const empty = document.createElement('p'); empty.className = 'dictionary-empty'; empty.textContent = query ? (mode === 'ja' ? '見つかりませんでした。別のことばで探してみよう。' : 'No matching words. Try another search.') : (mode === 'ja' ? '新しい絵を解いて、このページを埋めよう。' : 'Solve a new picture to fill this page.'); container.append(empty); }
    openModal('コレクション', container);
    if (focusControl === 'book') tabs.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
    if (focusControl === 'filter') filters.querySelector('[aria-pressed="true"]').focus({ preventScroll: true });
    if (focusControl === 'search') { search.focus({preventScroll:true}); search.setSelectionRange(search.value.length, search.value.length); }
  }

  function showDictionaryEntry(word, wordIndex, lang) {
    const container = document.createElement('div'); container.className = 'dictionary-entry';
    const back = document.createElement('button'); back.type = 'button'; back.className = 'dictionary-back'; back.textContent = mode === 'ja' ? '← 辞書にもどる' : '← Back to dictionary';
    back.addEventListener('click', () => { renderDictionary(); $('modalBody').querySelector(`[data-word-id="${word.id}"]`)?.focus(); });
    const image = document.createElement('img'); image.src = imgURL(word); image.alt = word.ja;
    const heading = document.createElement('h3'); heading.textContent = lang === 'ja' ? word.ja : word.en;
    const profile = difficulty.challenge(word, lang), rarity = document.createElement('p'); rarity.className = 'entry-rarity'; rarity.style.setProperty('--rarity', profile.color);
    rarity.innerHTML = rarityStars(word.tier);
    const reading = document.createElement('p'); reading.className = 'entry-reading'; reading.textContent = lang === 'ja' ? word.w : word.ja;
    const translation = document.createElement('a'); translation.className = 'entry-translation'; translation.textContent = mode === 'ja' ? '語源辞書で詳しく見る ↗' : 'Explore this word in the dictionary ↗'; translation.href = `../etymon-explorer.html#words/q=${encodeURIComponent(word.en)}`; translation.target = '_blank'; translation.rel = 'noopener';
    const badges = document.createElement('div'); badges.className = 'entry-books';
    for (const language of ['ja', 'en']) {
      if (!supports(word, language)) continue;
      const owned = !!saved[language].stars[word.id], badge = document.createElement('span'); badge.className = owned ? 'owned' : '';
      badge.textContent = `${bookName(language)} · ${mode === 'ja' ? (owned ? '獲得済み' : '未獲得') : (owned ? 'collected' : 'missing')}`; badges.append(badge);
    }
    const history=document.createElement('p');history.className='answer-record';const record=saved.answerRecords[word.id]?.[lang];history.textContent=record?`自力正解 ${record.independent||0}回 · 答えを見て正解 ${record.assisted||0}回`:'以前の獲得：答えを見たかどうかの記録はありません';
    if(record && Number.isFinite(record.lastScore))history.textContent += ` · 今回 ${record.lastScore}点 / 最高 ${record.bestScore}点`;
    const best = document.createElement('p'); best.className = 'entry-stars'; best.textContent = '✦'.repeat(saved[lang].stars[word.id]);
    const other = lang === 'ja' ? 'en' : 'ja', challengeLang = saved[other].stars[word.id] || !supports(word, other) ? lang : other;
    const challenge = document.createElement('button'); challenge.type = 'button'; challenge.className = 'modal-primary';
    challenge.textContent = challengeLang === lang ? (mode === 'ja' ? 'もう一度、この単語で遊ぶ' : 'Play this word again') : mode === 'ja' ? `${other === 'ja' ? '日本語' : '英語'}でもゲットする` : `Collect it in ${other === 'ja' ? 'Japanese' : 'English'}`;
    challenge.addEventListener('click', () => beginDictionaryPuzzle(challengeLang, wordIndex));
    const explanation = document.createElement('div'); explanation.textContent = '説明を確認中…';
    // Dictionary detail is already an explicit reveal. The puzzle itself stays answer-free.
    explanationFor(word).then(result => {if(explanation.isConnected)window.IllustrationScenes.render(explanation,result);});
    container.append(back, image, explanation, heading, rarity, reading, translation, pronunciationPanel(word, lang), history, best, challenge);
    openModal(bookName(lang), container); back.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') keyboardNavigation = true;
    if ($('modal').open || $('launchScreen').open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Backspace' && phase === 'playing') { event.preventDefault(); $('undo').click(); }
    if (event.key === 'Escape' && phase === 'playing') { cancelGesture(); resetSelection(); }
  });
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, { passive: true });
  function closePlay() {
    pauseAdvance(); clearPending(); cancelGesture(); petals.clear(); speech.stop(); sound.stop();
    saved.combo = 0; persist(); renderCombo();
    $('modal').close();
    if ($('rewardScene').matches(':popover-open')) $('rewardScene').hidePopover();
    $('rewardScene').hidden = true; $('rewardBackdrop').hidden = true;
    if (!$('launchScreen').open) $('launchScreen').showModal();
  }
  function startPlay() {
    $('launchScreen').close(); window.scrollTo(0, 0); sound.unlock();
    loadLevel(phase === 'solved' ? nextUncollected(mode, index) : index, false, false, true, true);
  }
  function updateOfflineStatus() {
    const count = catalog.filter(word => offline.hasSavedScene?.(word)).length;
    $('offlineStatus').textContent = count ? `${count}問を保存済み・圏外でも遊べます` : '通信できるときに保存すると、圏外でも遊べます。';
    $('saveOffline').disabled = !offline.state.supported || !offline.state.online;
    $('startPlay').disabled = !catalog.some(word => supports(word, mode));
    $('startPlay').hidden = datasetUnavailable || !catalog.length;
    $('reloadReviewedData').hidden = !(datasetUnavailable || !catalog.length);
    if (datasetUnavailable || !catalog.length) $('saveOffline').disabled = true;
    if (datasetUnavailable || !catalog.length) $('offlineStatus').textContent = '確認済みの説明つきデータがありません。最新版に再読み込みするか、refresh_reviewed_catalog.cmd で更新してください。';
    else if (location.protocol === 'file:') $('offlineStatus').textContent = `${catalog.length}問の確認済みデータで遊べます。`; 
  }
  $('saveOffline').addEventListener('click', async () => {
    $('saveOffline').disabled = true;
    try {
      const current = await sceneRuntime.checkDataset();
      if (!current.ok) throw new Error(current.reason);
      await offline.save(catalog, (done, total) => { $('offlineStatus').textContent = `保存中 ${done} / ${total}問`; });
      updateOfflineStatus();
    } catch {
      updateOfflineStatus();
      $('offlineStatus').textContent += '。保存が途中で止まりました。通信できる場所で再度保存してください。';
    }
  });
  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', () => { offline.refresh().then(updateOfflineStatus).catch(() => {}); });
  updateOfflineStatus();
  $('startPlay').addEventListener('click', startPlay);
  $('closeGame').addEventListener('click', closePlay);
  $('launchScreen').addEventListener('cancel', event => event.preventDefault());
  window.visualViewport?.addEventListener('resize', () => { updateLayout(); petals.clear(); petals.resize(); cancelGesture(); });
  if (catalog.length) {
    loadLevel(nextUncollected(mode, index));
    const installed = matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
    if (effectiveLayout() === 'mobile' && !installed) closePlay();
  }
  else { $('game').dataset.state = 'error'; $('startPlay').disabled = true; setFeedback('確認済みの画像と説明がある出題データを読み込めません。最新版に再読み込みしてください。', 'wrong'); if (!$('launchScreen').open) $('launchScreen').showModal(); }
})();

