/* WORD BLOOM — no dependencies, network services, or generated dictionary edits. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const catalog = window.PICTURE_WORDS_CATALOG || [];
  const { advanceSelection, sweptHits } = window.WordBloomGesture;
  const KEY = 'word-bloom-v1';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const copy = {
    ja: {
      gardens: ['はじまりの庭', 'おいしい小道', 'どうぶつの森', '暮らしのアトリエ', '自然のたからもの', 'まだ見ぬ世界へ'],
      title: 'この絵、なんのことば？', instruction: '文字をなぞって、つなげよう',
      release: '指をはなすと答え合わせ', note: 'もどって取り消し。タップでも遊べます。',
      shuffle: 'まぜる', hint: 'ひと文字ヒント', next: '次のことばへ', footer: 'いそがず、ひとつずつ。',
      collection: 'ことばのコレクション', found: 'ことば発見', caption: 'ひとつの絵から、ことばが咲く。',
      connect: 'つなぐ', undo: 'もどす', correct: 'ことばが咲いた！', wrong: 'おしい！ もう一度つないでみよう',
      short: '最後の文字まで、つないでみよう', mix: '新しい並びで、ひらめこう',
      tap: '続けてタップ、またはなぞってつなごう', soundOff: '効果音をオフ', soundOn: '効果音をオン',
      help: '遊び方', levels: '好きなところから、ひとつずつ。', choose: 'ステージを選ぶ',
      close: '閉じる', error: 'イラストを読み込めませんでした', retry: 'もう一度読み込む', skip: '次の絵へ',
      completed: '庭いっぱいに、ことばが咲いた。', chapterComplete: 'ひとつの庭が、花いっぱいに。',
      replay: 'もう一度、庭を歩く', allHinted: 'ヒントの文字を、順番につなごう',
      saved: '発見したことばをコレクションに追加しました', replayed: 'このことばはコレクションに咲いています',
    },
    en: {
      gardens: ['The first garden', 'A tasty little path', 'Animal friends', 'Everyday wonders', 'Treasures of nature', 'A world to discover'],
      title: 'One picture. Which word?', instruction: 'Swipe the letters. Find the word.',
      release: 'Lift your finger to check your word', note: 'Trace back to undo. Tapping works, too.',
      shuffle: 'Shuffle', hint: 'Reveal a letter', next: 'Next little wonder', footer: 'Take your time. Let it bloom.',
      collection: 'Your word collection', found: 'discovered', caption: 'A little picture. A word waiting to bloom.',
      connect: 'connect', undo: 'undo', correct: 'A word in bloom!', wrong: 'Almost! Give it another go.',
      short: 'Keep going to the last letter', mix: 'A fresh arrangement. A fresh idea.',
      tap: 'Keep tapping, or swipe to connect', soundOff: 'Turn sound off', soundOn: 'Turn sound on',
      help: 'How to play', levels: 'A little wonder, wherever you begin.', choose: 'Choose a puzzle',
      close: 'Close', error: 'This picture could not be loaded', retry: 'Try loading again', skip: 'Try the next picture',
      completed: 'A whole garden of words in bloom.', chapterComplete: 'Another garden, full of little wonders.',
      replay: 'Wander through again', allHinted: 'Connect the revealed letters in order',
      saved: 'A new word for your collection', replayed: 'This word is already in your collection',
    },
  };

  function readSave() {
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { /* Storage is optional. */ }
    const value = { mode: raw.mode === 'en' ? 'en' : 'ja', sound: raw.sound !== false };
    for (const lang of ['ja', 'en']) {
      const old = raw[lang] || {};
      const stars = {};
      for (const word of catalog) if ([1, 2, 3].includes(old.stars?.[word.id])) stars[word.id] = old.stars[word.id];
      value[lang] = { index: Number.isInteger(old.index) ? Math.max(0, Math.min(catalog.length - 1, old.index)) : 0, stars };
    }
    return value;
  }
  const saved = readSave();
  let mode = saved.mode;
  let index = saved[mode].index;
  let entry, answer = [], nodes = [], selected = [], hintCount = 0, mistakes = 0;
  let phase = 'loading', generation = 0, pointer = null, wheelRect = null, shuffleBusy = false;
  let feedbackTimer = 0;
  const pending = new Set();
  const text = () => copy[mode];
  const progress = () => saved[mode];
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
    wrong() { this.tone(293.66, .18, 0, .18); this.tone(261.63, .2, .09, .1); }
    win() {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.tone(f, .7, i * .075, .22));
      [261.63, 329.63, 392].forEach(f => this.tone(f, 1.1, .15, .1, 0, 'triangle'));
    }
    stop() { for (const voice of this.voices) { try { voice.stop(); } catch {} } this.voices.clear(); }
  }
  const sound = new Sound();

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
      const colors = ['#e5ac86', '#8fa67b', '#d6bd78', '#b6c697', '#cb7860'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2, velocity = celebration ? 130 + Math.random() * 320 : 25 + Math.random() * 75;
        this.items.push({ x, y, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity - (celebration ? 140 : 0),
          size: celebration ? 3 + Math.random() * 5 : 1.5 + Math.random() * 2, life: celebration ? 1.5 + Math.random() : .4 + Math.random() * .2,
          age: 0, angle, spin: (Math.random() - .5) * 10, color: colors[i % colors.length], celebration });
      }
      this.items = this.items.slice(-160);
      if (!this.frame) { this.last = performance.now(); this.frame = requestAnimationFrame(time => this.draw(time)); }
    }
    draw(time) {
      const dt = Math.min((time - this.last) / 1000, .032); this.last = time;
      const ctx = this.ctx; ctx.clearRect(0, 0, innerWidth, innerHeight);
      this.items = this.items.filter(item => item.age < item.life);
      for (const p of this.items) {
        p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.celebration ? 220 : 35) * dt; p.angle += p.spin * dt;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * .48, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
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
      nextLabel: 'next', footerNote: 'footer', collectionLabel: 'collection', foundLabel: 'found', pictureCaption: 'caption',
      imageErrorText: 'error', retryImage: 'retry', skipImage: 'skip' };
    for (const [id, key] of Object.entries(labels)) $(id).textContent = t[key];
    $('levels').setAttribute('aria-label', t.choose); $('help').setAttribute('aria-label', t.help);
    $('undo').setAttribute('aria-label', mode === 'ja' ? '一文字もどす' : 'Undo the last letter');
    $('closeModal').setAttribute('aria-label', t.close);
    $('wheel').setAttribute('aria-label', mode === 'ja' ? 'なぞって答える文字盤' : 'Connect letters to answer');
    updateSound();
  }
  function updateSound() {
    $('sound').setAttribute('aria-label', saved.sound ? text().soundOff : text().soundOn);
    $('sound').setAttribute('aria-pressed', String(saved.sound));
    $('sound').innerHTML = icon(saved.sound ? 'sound' : 'mute');
  }
  function updateProgress() {
    const group = Math.floor(index / 10), stars = progress().stars;
    $('chapterNumber').textContent = `GARDEN ${String(group + 1).padStart(2, '0')}`;
    $('chapterName').textContent = text().gardens[group];
    $('levelText').textContent = `${String(index + 1).padStart(2, '0')} / ${catalog.length}`;
    $('pictureNumber').textContent = `NO. ${String(index + 1).padStart(3, '0')}`;
    const count = Object.keys(stars).length;
    $('foundCount').textContent = count; $('collectionCount').textContent = `${count} / ${catalog.length}`;
    $('progress').replaceChildren(...catalog.slice(group * 10, group * 10 + 10).map((word, i) => {
      const dot = document.createElement('span'); dot.className = `progress-dot${stars[word.id] ? ' done' : ''}${i === index % 10 ? ' current' : ''}`;
      return dot;
    }));
    $('progress').setAttribute('aria-label', mode === 'ja' ? `この庭で ${catalog.slice(group * 10, group * 10 + 10).filter(word => stars[word.id]).length} / 10 語発見` : `Garden ${group + 1} progress`);
  }
  function layoutNodes() {
    nodes.forEach((node, i) => {
      const angle = -Math.PI / 2 + i * Math.PI * 2 / nodes.length;
      node.x = 180 + Math.cos(angle) * 127; node.y = 180 + Math.sin(angle) * 127;
      node.button.style.left = `${node.x / 3.6}%`; node.button.style.top = `${node.y / 3.6}%`;
    });
  }
  function makeWheel() {
    const letters = [...answer];
    const decoys = mode === 'ja' ? [...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわん'] : [...'AEIOURSTNLMPCD'];
    const desired = Math.min(10, Math.max(mode === 'ja' ? 5 : 6, letters.length + (letters.length < 5 ? 2 : 0)));
    const available = shuffle(decoys.filter(ch => !letters.includes(ch)));
    while (letters.length < desired && available.length) letters.push(available.pop());
    shuffle(letters);
    if (letters.slice(0, answer.length).join('') === answer.join('')) letters.push(letters.shift());
    nodes = letters.map((char, id) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = `letter${letters.length > 8 ? ' dense' : ''}`;
      button.textContent = char; button.dataset.node = String(id); button.setAttribute('aria-label', char); button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', event => { if (event.detail === 0 && phase === 'playing' && !shuffleBusy) { sound.unlock(); selectNode(id); if (selected.length >= answer.length) checkAnswer(); else setFeedback(text().tap); } });
      return { id, char, button, x: 0, y: 0 };
    });
    $('letters').replaceChildren(...nodes.map(node => node.button)); layoutNodes();
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
    const used = selected.indexOf(id);
    const next = advanceSelection(selected, id, answer.length);
    if (next === selected) return;
    selected = next;
    if (used >= 0) {
      sound.undo(); vibrate(5); updateAnswer(); drawTrail(); return;
    }
    const node = nodes.find(item => item.id === id);
    node.button.classList.remove('hint-target');
    sound.pick(selected.length, node.x); vibrate(7);
    const rect = $('wheel').getBoundingClientRect();
    petals.burst(rect.left + node.x / 360 * rect.width, rect.top + node.y / 360 * rect.height, 7);
    updateAnswer(); drawTrail();
  }

  function loadLevel(nextIndex, focusNext = false) {
    generation++; clearPending(); cancelGesture(); sound.stop(); petals.clear();
    document.querySelectorAll('.flying-letter').forEach(el => el.remove());
    index = (nextIndex + catalog.length) % catalog.length; progress().index = index; persist();
    entry = catalog[index]; answer = [...(mode === 'ja' ? entry.w : entry.en.toUpperCase())];
    selected = []; hintCount = 0; mistakes = 0; shuffleBusy = false; phase = 'loading';
    $('game').dataset.state = phase; $('next').hidden = true; $('gameActions').hidden = false;
    $('hint').disabled = false; $('shuffle').disabled = false; $('imageError').hidden = true;
    updateLabels(); updateProgress();
    $('answer').className = `answer${answer.length > 7 ? ' long' : ''}`;
    $('answer').replaceChildren(...answer.map((_, i) => { const tile = document.createElement('span'); tile.className = 'answer-tile'; tile.style.setProperty('--i', i); return tile; }));
    $('answerInfo').textContent = mode === 'ja' ? `ひらがな ${answer.length} 文字` : `${answer.length} LETTERS`;
    makeWheel(); resetSelection(); setFeedback(text().release);
    const version = generation, image = $('clueImage');
    image.style.opacity = '0'; image.alt = mode === 'ja' ? '答えを考えるためのイラスト' : 'Picture clue. What does it show?';
    image.onload = () => {
      if (version !== generation) return;
      image.style.opacity = '1'; phase = 'playing'; $('game').dataset.state = phase;
      // Restart the picture entrance once the actual clue is ready.
      image.style.animation = 'none'; void image.offsetWidth; image.style.animation = '';
      if (focusNext) nodes[0]?.button.focus({ preventScroll: true });
    };
    image.onerror = () => {
      if (version !== generation) return;
      phase = 'error'; $('game').dataset.state = phase; $('imageError').hidden = false;
      $('hint').disabled = true; $('shuffle').disabled = true; setFeedback(text().error, 'wrong');
    };
    image.src = imgURL(entry);
    const preload = new Image(); preload.src = imgURL(catalog[(index + 1) % catalog.length]);
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
    phase = 'checking'; sound.wrong();
    setFeedback(tooShort ? text().short : text().wrong, 'wrong');
    $('answer').classList.remove('shake'); void $('answer').offsetWidth; $('answer').classList.add('shake');
    later(() => { phase = 'playing'; $('answer').classList.remove('shake'); resetSelection(); setFeedback(text().release); }, 600);
  }
  function win() {
    phase = 'solved'; $('game').dataset.state = phase; flyLetters(); sound.win(); vibrate([12, 35, 20]);
    const stars = Math.max(1, 3 - Math.min(2, hintCount + (mistakes > 0 ? 1 : 0)));
    const first = !progress().stars[entry.id];
    progress().stars[entry.id] = Math.max(progress().stars[entry.id] || 0, stars); persist();
    updateAnswer(); updateProgress();
    const pronunciation = mode === 'ja' ? entry.en.toUpperCase() : `${entry.ja} · ${entry.w}`;
    $('pictureCaption').textContent = pronunciation;
    $('answerInfo').textContent = `${'✦'.repeat(stars)}${'✧'.repeat(3 - stars)}  ${mode === 'ja' ? entry.ja : entry.en.toUpperCase()}`;
    setFeedback(text().correct, 'success'); $('gestureNote').textContent = first ? text().saved : text().replayed;
    $('gameActions').hidden = true; $('next').hidden = false;
    $('centerLabel').textContent = 'bloom!';
    $('nextLabel').textContent = index === catalog.length - 1 ? text().replay : text().next;
    const rect = $('pictureCard').getBoundingClientRect(); petals.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 90, true);
    later(() => { $('next').focus({ preventScroll: true }); }, 650);
  }

  function pointFrom(event) {
    const rect = wheelRect || $('wheel').getBoundingClientRect();
    return { x: (event.clientX - rect.left) / rect.width * 360, y: (event.clientY - rect.top) / rect.height * 360 };
  }
  function hitRadius(node) { return Math.min(39, node.button.offsetWidth / (wheelRect.width / 360) / 2 + 5); }
  function nearest(point) {
    return nodes.map(node => ({ node, distance: Math.hypot(node.x - point.x, node.y - point.y) }))
      .filter(hit => hit.distance <= hitRadius(hit.node)).sort((a, b) => a.distance - b.distance)[0]?.node;
  }
  // Swept-segment intersection keeps fast swipes from skipping a letter between events.
  function sweep(from, to) {
    for (const id of sweptHits(nodes, from, to, hitRadius)) selectNode(id);
  }
  function cancelGesture() {
    if (pointer && $('wheel').hasPointerCapture?.(pointer.id)) $('wheel').releasePointerCapture(pointer.id);
    pointer = null; wheelRect = null; $('wheel').classList.remove('dragging');
    if (nodes.length) { selected = []; updateAnswer(); drawTrail(); }
  }
  $('wheel').addEventListener('pointerdown', event => {
    if (phase !== 'playing' || shuffleBusy || pointer || !event.isPrimary || event.button !== 0 || event.target.closest('#undo')) return;
    wheelRect = $('wheel').getBoundingClientRect();
    const position = pointFrom(event), node = nearest(position); if (!node) { wheelRect = null; return; }
    event.preventDefault(); sound.unlock();
    pointer = { id: event.pointerId, kind: event.pointerType, start: position, last: position, moved: false };
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
    const moved = pointer.moved;
    if ($('wheel').hasPointerCapture(event.pointerId)) $('wheel').releasePointerCapture(event.pointerId);
    $('wheel').classList.remove('dragging'); drawTrail();
    if (moved || selected.length >= answer.length) checkAnswer(); else setFeedback(text().tap);
    pointer = null; wheelRect = null;
  });
  $('wheel').addEventListener('pointercancel', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('lostpointercapture', event => { if (pointer?.id === event.pointerId) cancelGesture(); });
  $('wheel').addEventListener('contextmenu', event => event.preventDefault());
  window.addEventListener('blur', cancelGesture);
  window.addEventListener('resize', () => { if (pointer) cancelGesture(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelGesture(); sound.stop(); petals.clear(); } });

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
    cancelGesture(); sound.unlock(); sound.hint(); hintCount = Math.min(answer.length, hintCount + 1); updateAnswer();
    const target = nodes.find(node => node.char === answer[hintCount - 1]);
    if (target) { target.button.classList.remove('hint-target'); void target.button.offsetWidth; target.button.classList.add('hint-target'); }
    setFeedback(hintCount === answer.length ? text().allHinted : mode === 'ja' ? `${hintCount}文字めは「${answer[hintCount - 1]}」` : `Letter ${hintCount} is ${answer[hintCount - 1]}`, '', true);
    if (hintCount === answer.length) $('hint').disabled = true;
  });
  $('sound').addEventListener('click', () => {
    saved.sound = !saved.sound; persist(); updateSound();
    if (saved.sound) { sound.unlock(); sound.hint(); } else sound.stop();
  });
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    if (mode === button.dataset.mode) return;
    mode = button.dataset.mode; loadLevel(saved[mode].index);
  }));
  $('retryImage').addEventListener('click', () => loadLevel(index));
  $('skipImage').addEventListener('click', () => loadLevel(index + 1));

  function openModal(title, body) {
    cancelGesture(); $('modalTitle').textContent = title; $('modalBody').replaceChildren();
    if (typeof body === 'string') $('modalBody').innerHTML = body; else $('modalBody').append(body);
    $('modal').showModal();
  }
  $('closeModal').addEventListener('click', () => $('modal').close());
  $('modal').addEventListener('click', event => { if (event.target === $('modal')) { const r = $('modal').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) $('modal').close(); } });
  $('help').addEventListener('click', () => {
    const steps = mode === 'ja' ? [
      'イラストを見て、ことばを思い浮かべます。日本語はひらがな、英語はアルファベットで答えます。',
      '文字から文字へ、指をはなさずになぞります。最後の文字で指をはなすと答え合わせ。',
      '前の文字へもどると取り消せます。同じ文字が二つあるときは、別々の丸をつないでください。',
    ] : [
      'Look at the picture and find its word. Choose Japanese for hiragana, or English for the alphabet.',
      'Swipe from letter to letter, then lift your finger to check. You can also tap the letters one at a time.',
      'Trace back to undo. If a letter appears twice, use its two separate circles.',
    ];
    const note = mode === 'ja' ? '「まぜる」で並び替え。「ひと文字ヒント」は何度でも無料。ヒントなし・間違いなしで星3つ。時間制限はありません。キーボードでは Tab と Enter、Backspace でも遊べます。' : 'Shuffle for a fresh view. Letter hints are always free. Solve without hints or mistakes to earn three stars. There is no timer. Keyboard: Tab and Enter to choose, Backspace to undo.';
    openModal(text().help, `<div class="help-steps">${steps.map((line, i) => `<div class="help-step"><b>${i + 1}</b><p>${line}</p></div>`).join('')}</div><p class="help-note">${note}</p><button class="modal-primary" id="startPlaying" type="button">${mode === 'ja' ? 'ことばを咲かせよう' : 'Let it bloom'}</button>`);
    $('startPlaying').addEventListener('click', () => $('modal').close());
  });
  $('levels').addEventListener('click', () => {
    const container = document.createElement('div'), intro = document.createElement('p'), grid = document.createElement('div');
    intro.className = 'modal-copy'; intro.textContent = text().levels; grid.className = 'level-grid'; container.append(intro, grid);
    catalog.forEach((word, i) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = `level-cell${i === index ? ' current' : ''}${progress().stars[word.id] ? ' done' : ''}`;
      button.textContent = String(i + 1).padStart(2, '0'); button.dataset.level = String(i);
      button.setAttribute('aria-label', `${mode === 'ja' ? 'ステージ' : 'Puzzle'} ${i + 1}`);
      if (progress().stars[word.id]) { const score = document.createElement('small'); score.textContent = '✦'.repeat(progress().stars[word.id]); button.append(score); }
      button.addEventListener('click', () => { $('modal').close(); loadLevel(i); }); grid.append(button);
    });
    openModal(text().choose, container);
  });
  $('collection').addEventListener('click', () => {
    const known = catalog.filter(word => progress().stars[word.id]);
    if (!known.length) {
      openModal(text().collection, `<div class="collection-empty">${icon('flower')}${mode === 'ja' ? 'まだ、小さな種のまま。<br>最初のことばを咲かせてみよう。' : 'A garden of possibilities.<br>Discover your first word to begin.'}</div>`); return;
    }
    const grid = document.createElement('div'); grid.className = 'collection-grid';
    for (const word of known) {
      const card = document.createElement('div'), image = document.createElement('img'), title = document.createElement('strong'), subtitle = document.createElement('small');
      card.className = 'collection-card'; image.src = imgURL(word); image.alt = word.ja; image.loading = 'lazy';
      title.textContent = mode === 'ja' ? word.w : word.en.toUpperCase(); subtitle.textContent = mode === 'ja' ? word.en : `${word.ja} · ${word.w}`;
      card.append(image, title, subtitle); grid.append(card);
    }
    openModal(`${text().collection} · ${known.length}`, grid);
  });
  $('next').addEventListener('click', () => {
    if (phase !== 'solved') return;
    const nextIndex = (index + 1) % catalog.length;
    const gardenStart = Math.floor(index / 10) * 10;
    const gardenComplete = catalog.slice(gardenStart, gardenStart + 10).every(word => progress().stars[word.id]);
    if ((index + 1) % 10 === 0 && gardenComplete) {
      const all = Object.keys(progress().stars).length === catalog.length;
      openModal(all ? text().completed : text().chapterComplete, `<div class="garden-complete">${icon('flower')}<p>${mode === 'ja' ? '見つけたことばは、あなたのコレクションに。<br>次の小さな発見が、待っています。' : 'Your discoveries are safe in your collection.<br>Another little wonder is waiting.'}</p></div><button type="button" class="modal-primary" id="continueGarden">${all ? text().replay : text().next}</button>`);
      $('continueGarden').addEventListener('click', () => { $('modal').close(); loadLevel(nextIndex, true); });
    } else loadLevel(nextIndex, true);
  });
  document.addEventListener('keydown', event => {
    if ($('modal').open || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Backspace' && phase === 'playing') { event.preventDefault(); $('undo').click(); }
    if (event.key === 'Escape' && phase === 'playing') { cancelGesture(); resetSelection(); }
  });
  if (catalog.length) loadLevel(index);
  else { $('game').dataset.state = 'error'; setFeedback('出題データを読み込めませんでした。ページを再読み込みしてください。', 'wrong'); }
})();
