/* Pictlingo Quest — 絵を見て英単語をなぞってつなぐ（エンドレス）＋ずかん
 * 入力は元の Pictlingo パズル(picture-words)と同じ：六角タイルに答えの文字だけを
 * 隣り合う道順で並べ、一筆でなぞって指を離すと判定。判定・道順生成は gesture.js を共有。
 * 余計な演出はなし。正解後は解説文(英・日)を出して読み上げる。 */
(() => {
'use strict';

/* ───────── utils ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rand = n => Math.floor(Math.random() * n);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = n => n.toLocaleString('ja-JP');
const encPath = p => p.split('/').map(encodeURIComponent).join('/');
const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ───────── data ───────── */
const D = window.PQ_DATA, G = window.WordBloomGesture;
if (!D || !Array.isArray(D.words) || !G) { document.body.insertAdjacentHTML('beforeend', '<p class="fatal">データ(quest-data.js / gesture.js)を読み込めませんでした</p>'); return; }
const WC = new Array(D.words.length);
function W(i) {
  if (WC[i]) return WC[i];
  const r = D.words[i];
  return (WC[i] = { i, id: r[0], en: r[1], kana: r[2], ja: r[3], img: r[4], thumb: r[5], flags: r[6], rank: r[8], capJa: r[10] || '', capEn: r[11] || '' });
}
const ID2I = new Map(D.words.map((r, i) => [r[0], i]));
const fullURL = w => '../../' + encPath(w.img.startsWith('/') ? w.img.slice(1) : `assets/word/${w.img}.png`);
const thumbURL = w => !w.thumb ? fullURL(w) : w.thumb.startsWith('q:') ? `pictlingo-quest/thumbs/${encodeURIComponent(w.thumb.slice(2))}.webp` : `../eigo-no-e/thumbs/${encodeURIComponent(w.thumb)}.webp`;
// 軽いサムネイル → 原寸PNG の順に試す
const imgTag = (w, cls = '') => `<img class="${cls}" src="${esc(thumbURL(w))}" data-full="${esc(fullURL(w))}" alt="" decoding="async" loading="lazy" draggable="false">`;
document.addEventListener('error', e => {
  const im = e.target;
  if (im instanceof HTMLImageElement && im.dataset.full && !im.dataset.tried && im.getAttribute('src') !== im.dataset.full) { im.dataset.tried = '1'; im.src = im.dataset.full; }
}, true);

/* ★レア度：辞書の全語を身近な順(rank)に並べた位置で5段階。No. はその通し番号 */
const STAR_NAMES = ['まいにち語', 'よくみる語', 'ときどき語', 'レア語', 'げきレア語'];
const DEX_ORDER = D.words.map((_, i) => i).sort((a, b) => (D.words[a][8] - D.words[b][8]) || D.words[a][1].localeCompare(D.words[b][1]));
const DEX_NO = new Uint32Array(D.words.length), STAR = new Uint8Array(D.words.length), BY_STAR = [[], [], [], [], [], []];
DEX_ORDER.forEach((i, k) => { DEX_NO[i] = k + 1; const f = k / DEX_ORDER.length; STAR[i] = f < .06 ? 1 : f < .18 ? 2 : f < .36 ? 3 : f < .60 ? 4 : 5; BY_STAR[STAR[i]].push(i); });
const stars = n => '★'.repeat(n);
const noStr = i => 'No.' + String(DEX_NO[i]).padStart(5, '0');

/* ───────── save ───────── */
const KEY = 'pictlingo-quest-v2';
const fresh = () => ({ v: 2, learned: {}, lv: {}, open: 1, unlockAll: false, sound: true, best: 0 });
let S = fresh();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (raw && raw.v === 2) S = Object.assign(fresh(), raw);
  else {   // 旧版(v1)の登録データを引き継ぐ
    const old = JSON.parse(localStorage.getItem('pictlingo-quest-v1') || 'null');
    if (old) {
      for (const id of [...Object.keys(old.learned || {}), ...Object.keys(old.cards || {})]) S.learned[id] = Math.max(1, old.learned?.[id] || 0);
      if (old.settings) S.sound = old.settings.sound !== false;
      S.unlockAll = !!old.unlockAll;
    }
  }
} catch { /* private mode */ }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage unavailable */ } };
const registered = i => !!S.learned[W(i).id];
const lvRec = n => (S.lv[n] ||= { solved: 0, best: 0 });
const UNLOCK_AT = 15;   // その★で累計この数だけ正解すると、次の★が開く
const unlockAll = () => S.unlockAll || new URLSearchParams(location.search).has('unlock');
const levelOpen = n => unlockAll() || n <= S.open;

/* ───────── sound ───────── */
let AC = null;
const audio = () => { if (!S.sound) return null; try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch { return null; } return AC; };
function tone(f, at = 0, dur = .1, type = 'sine', vol = .08) {
  const ac = audio(); if (!ac) return;
  const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .02);
}
const SCALE = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319, 1397, 1568, 1760, 1976];
const sfx = {
  pick: k => tone(SCALE[Math.min(SCALE.length - 1, k)], 0, .07, 'sine', .06),
  ok: () => { tone(784, 0, .12, 'triangle', .09); tone(1175, .09, .22, 'triangle', .08); },
  ng: () => { tone(220, 0, .16, 'triangle', .09); tone(196, .1, .2, 'triangle', .08); },
};
let VOICE = null;
const TTS = 'speechSynthesis' in window;
function pickVoice() { try { const vs = speechSynthesis.getVoices(); VOICE = vs.find(v => /^en[-_]US/i.test(v.lang) && v.localService) || vs.find(v => /^en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null; } catch { VOICE = null; } }
if (TTS) { pickVoice(); speechSynthesis.addEventListener?.('voiceschanged', pickVoice); }
function speak(text, rate = .9) {
  if (!TTS || !S.sound || !text) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; if (VOICE) u.voice = VOICE; u.rate = rate; speechSynthesis.speak(u); } catch { /* ignore */ }
}
const hush = () => { try { speechSynthesis.cancel(); } catch { /* ignore */ } };
function renderSound() {
  const b = $('#soundBtn');
  b.innerHTML = `<svg><use href="#i-${S.sound ? 'sound' : 'mute'}"/></svg>`;
  b.setAttribute('aria-pressed', String(S.sound)); b.setAttribute('aria-label', S.sound ? '音声と効果音をオフ' : '音声と効果音をオン');
}
$('#soundBtn').addEventListener('click', () => { S.sound = !S.sound; persist(); renderSound(); if (!S.sound) hush(); });

/* ───────── modal ───────── */
function modal(html, onReady) { const m = $('#modal'); $('#mIn').innerHTML = html; if (!m.open) m.showModal(); onReady?.($('#mIn')); }
const closeModal = () => { const m = $('#modal'); if (m.open) m.close(); hush(); };
$('#mClose').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });

/* ───────── home：あそぶ / ずかん ───────── */
function showTab(t) {
  $$('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  $('#viewPlay').hidden = t !== 'Play'; $('#viewDex').hidden = t !== 'Dex';
  if (t === 'Play') renderLevels(); else renderDex();
  $('.home-main').scrollTop = 0;
}
$$('.tabs button').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));

// 出題する語：その★の、出題可の英単語。人名などの固有名詞(大文字始まり)は絵から当てられないので出さない
const POOL = [];
const pool = n => (POOL[n] ||= BY_STAR[n].filter(i => (D.words[i][6] & 1) && /^(?:[a-z]+|I)$/.test(D.words[i][1]) && D.words[i][1].length <= 14));

function renderLevels() {
  const v = $('#viewPlay');
  v.innerHTML = `<div class="intro"><h1>なぞってつなぐ</h1><p>絵を見て、英単語の文字を一筆でなぞろう</p></div>
    <div class="levels">${[1, 2, 3, 4, 5].map(n => {
      const open = levelOpen(n), r = lvRec(n), total = pool(n).length;
      const sub = open ? `正解 ${fmt(r.solved)}語 ・ 最高 ${r.best}連続`
        : `${stars(n - 1)}で${UNLOCK_AT}語正解すると開く${n - 1 === S.open ? `（あと${Math.max(0, UNLOCK_AT - lvRec(n - 1).solved)}語）` : ''}`;
      return `<button type="button" class="level s${n}" data-n="${n}" ${open ? '' : 'disabled'}>
        <span class="lv-stars" aria-label="★${n}">${stars(n)}</span>
        <span class="lv-text"><b>${STAR_NAMES[n - 1]}</b><small>${sub}</small></span>
        <span class="lv-go" aria-hidden="true"><svg><use href="#i-${open ? 'arrow' : 'lock'}"/></svg></span>
        ${open ? `<span class="lv-bar" style="--p:${Math.min(100, r.solved / total * 100).toFixed(2)}%"></span>` : ''}
      </button>`; }).join('')}</div>
    <label class="unlock-all"><input type="checkbox" id="unlockAll" ${S.unlockAll ? 'checked' : ''}>全難易度を開放</label>`;
  $$('.level:not([disabled])', v).forEach(b => b.onclick = () => startPlay(+b.dataset.n));
  $('#unlockAll').onchange = e => { S.unlockAll = e.target.checked; persist(); renderLevels(); };
}

/* ───────── ずかん：全語に No.。未登録は影で見える ───────── */
let dexStar = 1, dexPage = 0, dexOnly = 'all';
const DEX_PER = 48;
function dexCounts() { const c = [0, 0, 0, 0, 0, 0]; for (const id of Object.keys(S.learned)) { const i = ID2I.get(id); if (i !== undefined) { c[0]++; c[STAR[i]]++; } } return c; }
function renderDex() {
  const v = $('#viewDex'), c = dexCounts();
  let list = BY_STAR[dexStar];
  if (dexOnly === 'have') list = list.filter(registered);
  if (dexOnly === 'miss') list = list.filter(i => !registered(i));
  const pages = Math.max(1, Math.ceil(list.length / DEX_PER)); dexPage = clamp(dexPage, 0, pages - 1);
  const slice = list.slice(dexPage * DEX_PER, (dexPage + 1) * DEX_PER);
  v.innerHTML = `<div class="intro"><h1>ずかん</h1><p><b>${fmt(c[0])}</b> / ${fmt(D.words.length)}語</p></div>
    <div class="dex-stars" role="tablist">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="tab" class="s${n}" data-st="${n}" aria-selected="${dexStar === n}"><span>${stars(n)}</span><small>${STAR_NAMES[n - 1]}</small><i>${fmt(c[n])}<em>/${fmt(BY_STAR[n].length)}</em></i></button>`).join('')}</div>
    <div class="dex-tools"><div class="seg">${[['all', 'ぜんぶ'], ['have', '登録済み'], ['miss', '未登録']].map(([k, t]) => `<button type="button" data-only="${k}" aria-pressed="${dexOnly === k}">${t}</button>`).join('')}</div>
      <div class="pager"><button type="button" id="pgPrev" aria-label="前のページ" ${dexPage ? '' : 'disabled'}>‹</button><span>${dexPage + 1} / ${pages}</span><button type="button" id="pgNext" aria-label="次のページ" ${dexPage < pages - 1 ? '' : 'disabled'}>›</button></div></div>
    <div class="dex-grid">${slice.map(i => { const w = W(i), have = registered(i); return `<button type="button" class="dex-card${have ? '' : ' miss'}" data-i="${i}" ${have ? '' : 'tabindex="-1"'}><span class="no">${noStr(i)}</span>${imgTag(w, have ? '' : 'sil')}<b>${have ? esc(w.en) : '？？？'}</b></button>`; }).join('') || '<p class="empty">まだありません</p>'}</div>`;
  $$('[data-st]', v).forEach(b => b.onclick = () => { dexStar = +b.dataset.st; dexPage = 0; renderDex(); });
  $$('[data-only]', v).forEach(b => b.onclick = () => { dexOnly = b.dataset.only; dexPage = 0; renderDex(); });
  $('#pgPrev').onclick = () => { dexPage--; renderDex(); $('.home-main').scrollTop = 0; };
  $('#pgNext').onclick = () => { dexPage++; renderDex(); $('.home-main').scrollTop = 0; };
  $$('.dex-card:not(.miss)', v).forEach(b => b.onclick = () => wordDetail(+b.dataset.i));
}
function sceneHTML(w) {
  if (!w.capEn) return '';
  const en = esc(w.capEn).replace(new RegExp(`\\b(${reEsc(esc(w.en))}\\w*)`, 'i'), '<b>$1</b>');
  return `<div class="scene"><p class="en" lang="en">${en}</p><p class="ja" lang="ja">${esc(w.capJa)}</p></div>`;
}
function pronHTML(w) {
  return `<div class="pron"><button type="button" class="p-word" data-say="word"><svg><use href="#i-sound"/></svg><span lang="en">${esc(w.en)}</span></button>${w.capEn
    ? `<button type="button" data-say="scene" data-rate=".9">文を聞く</button><button type="button" class="slow" data-say="scene" data-rate=".6">ゆっくり</button>`
    : `<button type="button" class="slow" data-say="word" data-rate=".6">ゆっくり</button>`}</div>`;
}
function bindPron(root, w, onUse) {
  $$('.pron button', root).forEach(b => b.onclick = () => { onUse?.(); audio(); speak(b.dataset.say === 'scene' ? w.capEn : w.en, +(b.dataset.rate || .9)); });
}
function wordDetail(i) {
  const w = W(i);
  modal(`<div class="detail"><div class="d-pic">${imgTag(w)}</div><h2 lang="en">${esc(w.en)}</h2><p class="d-ja">${esc(w.ja)}</p><p class="meta"><span class="chip s${STAR[i]}">${stars(STAR[i])} ${STAR_NAMES[STAR[i] - 1]}</span><span>${noStr(i)}</span></p>${sceneHTML(w)}${pronHTML(w)}
    <a class="d-link" href="../pictpedia.html#/w/${encodeURIComponent(w.id)}" target="_blank" rel="noopener">Pictpedia で見る</a></div>`, root => { const im = $('.d-pic img', root), full = new Image(); full.onload = () => { im.src = full.src; }; full.src = fullURL(w); bindPron(root, w); speak(w.en); });
}

/* ───────── play ───────── */
let P = null;   // いまのプレイ
function startPlay(lvl) {
  audio();
  P = { lvl, used: new Set(), retry: [], count: 0, combo: 0, n: 0 };
  $('#home').hidden = true; $('#play').hidden = false;
  $('#playLevel').innerHTML = `<span class="chip s${lvl}">${stars(lvl)}</span><span>${STAR_NAMES[lvl - 1]}</span>`;
  nextQuestion();
}
function quitPlay() {
  if (!P) return;
  clearTimeout(P.autoT); clearTimeout(P.readT); hush(); endBoard();
  P = null; $('#play').hidden = true; $('#home').hidden = false; showTab('Play');
}
$('#quitBtn').addEventListener('click', quitPlay);

function pickWord() {
  P.n++;
  const due = P.retry.findIndex(r => r.at <= P.n);
  if (due >= 0) return P.retry.splice(due, 1)[0].i;
  const list = pool(P.lvl);
  if (P.used.size >= list.length - 4) P.used.clear();
  let pickI = -1;
  for (let t = 0; t < 60; t++) {   // まだ登録していない語を優先
    const i = list[rand(list.length)]; if (P.used.has(i)) continue;
    pickI = i; if (!registered(i) || t > 30) break;
  }
  if (pickI < 0) pickI = list[rand(list.length)];
  P.used.add(pickI); return pickI;
}
function renderCount() {
  $('#playCount').innerHTML = `${P.combo >= 2 ? `<span class="combo">${P.combo}連続</span>` : ''}<span class="n"><b>${P.count}</b>問</span>`;
}
function nextQuestion() {
  if (!P) return;
  clearTimeout(P.autoT); clearTimeout(P.readT); hush(); endBoard();
  const i = pickWord(), w = W(i);
  P.i = i; P.w = w; P.solved = false; P.missed = false; P.assisted = false;
  $('#play').classList.remove('is-done');
  $('#done').hidden = true; $('#done').innerHTML = '';
  $('#boardWrap').hidden = false; $('#actions').hidden = false;
  const pic = $('#pic');
  pic.dataset.tried = ''; pic.dataset.full = fullURL(w); pic.src = thumbURL(w);
  const full = new Image(); full.onload = () => { if (P?.i === i) pic.src = full.src; }; full.src = fullURL(w);
  $('#picture').classList.toggle('new', !registered(i));
  $('#meaning').textContent = w.ja;
  renderCount();
  buildBoard(w.en.toUpperCase());
  const list = pool(P.lvl), ahead = list[rand(list.length)];   // 次の絵を先読み
  if (ahead !== undefined) { const im = new Image(); im.src = thumbURL(W(ahead)); }
}

/* ── 文字盤：元のパズルと同じ六角格子（360単位の座標）。表示は空きスペースに収めて中央に置く ── */
let B = null;
const stepFor = n => n <= 4 ? 100 : n <= 8 ? 86 : n <= 14 ? 68 : 58;
function cellsFor(total) {
  const rowsByCount = { 1: [1], 2: [2], 3: [1, 2], 4: [2, 2], 5: [2, 3], 6: [3, 3], 7: [2, 3, 2], 8: [3, 2, 3], 9: [3, 3, 3], 10: [3, 4, 3], 11: [4, 3, 4], 12: [4, 4, 4], 13: [3, 4, 3, 3], 14: [3, 4, 3, 4] };
  const step = stepFor(total), pts = [];
  rowsByCount[total].forEach((len, row) => { const first = -Math.floor((len + row) / 2); for (let col = 0; col < len; col++) pts.push({ x: (first + col + row / 2) * step, y: row * step * Math.sqrt(3) / 2 }); });
  return pts;
}
function buildBoard(word) {
  const chars = [...word];
  $('#slots').innerHTML = chars.map(() => '<span class="slot"></span>').join('');
  $('#slots').style.setProperty('--n', chars.length);
  B = { answer: chars, nodes: chars.map((char, id) => ({ id, char })), selected: [], pointer: null, step: stepFor(chars.length) };
  $('#tiles').replaceChildren(...B.nodes.map(node => {
    const b = document.createElement('span'); b.className = 'tile'; b.innerHTML = `<i>${node.char}</i>`;
    node.el = b; return b;
  }));
  arrange(); layoutBoard(); paint();
}
function arrange() {   // 答えの文字を「隣り合う道順」で格子に並べる
  const route = G.connectedPath(cellsFor(B.nodes.length), B.step);
  B.nodes.forEach(node => { node.ux = route[node.id].x; node.uy = route[node.id].y; });
}
function layoutBoard() {
  if (!B) return;
  const wrap = $('#boardWrap'), board = $('#board');
  const tw = B.step, th = tw * 2 / Math.sqrt(3);   // 隣どうしがぴったり接する六角形
  const xs = B.nodes.map(n => n.ux), ys = B.nodes.map(n => n.uy);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  const uw = Math.max(...xs) - minX + tw, uh = Math.max(...ys) - minY + th;
  const s = Math.max(.2, Math.min((wrap.clientWidth - 16) / uw, (wrap.clientHeight - 16) / uh, 88 / tw));
  const bw = uw * s, bh = uh * s;
  board.style.width = bw + 'px'; board.style.height = bh + 'px';
  board.style.setProperty('--tw', tw * s + 'px'); board.style.setProperty('--th', th * s + 'px');
  $('#trail').setAttribute('viewBox', `0 0 ${bw} ${bh}`);
  B.r = tw * s / 2;
  for (const n of B.nodes) {
    n.x = (n.ux - minX + tw / 2) * s; n.y = (n.uy - minY + th / 2) * s;
    n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px';
  }
  drawTrail();
}
addEventListener('resize', () => layoutBoard());
function paint() {
  if (!B) return;
  $$('#slots .slot').forEach((el, k) => {
    const id = B.selected[k], ch = P?.solved ? B.answer[k] : id !== undefined ? B.nodes[id].char : '';
    el.textContent = ch; el.classList.toggle('filled', !!ch);
  });
  for (const n of B.nodes) n.el.classList.toggle('on', B.selected.includes(n.id));
  drawTrail();
}
function drawTrail() {
  if (!B) return;
  const pts = B.selected.map(id => `${B.nodes[id].x},${B.nodes[id].y}`);
  if (B.pointer && B.selected.length) pts.push(`${B.pointer.last.x},${B.pointer.last.y}`);
  $('#trailLine').setAttribute('points', pts.join(' '));
}
function select(id) {
  if (!B || P.solved || B.demo || B.selected.includes(id)) return;
  const prev = B.nodes[B.selected.at(-1)], cand = B.nodes[id];
  if (prev && !G.areNeighbours({ x: prev.ux, y: prev.uy }, { x: cand.ux, y: cand.uy }, B.step)) return;
  const next = G.advanceSelection(B.selected, id, B.answer.length);
  if (next === B.selected) return;
  B.selected = next; sfx.pick(B.selected.length - 1); paint();
}
const local = e => { const r = $('#board').getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
const hitAt = p => B.nodes.map(n => ({ n, d: Math.hypot(n.x - p.x, n.y - p.y) })).filter(h => h.d <= B.r * .95).sort((a, b) => a.d - b.d)[0]?.n;
const sweep = (a, b) => { for (const id of G.sweptHits(B.nodes, a, b, () => B.r * .78)) select(id); };
function cancelGesture() {
  if (!B) return;
  const board = $('#board');
  if (B.pointer && board.hasPointerCapture?.(B.pointer.id)) board.releasePointerCapture(B.pointer.id);
  B.pointer = null;
  if (!P?.solved) { B.selected = []; paint(); }
}
function endBoard() { if (B) cancelGesture(); B = null; $('#tiles').replaceChildren(); $('#trailLine').setAttribute('points', ''); }
(function bindBoard() {
  const board = $('#board');
  board.addEventListener('pointerdown', e => {
    if (!B || !P || P.solved || B.demo || B.pointer || !e.isPrimary || e.button !== 0) return;
    const p = local(e), n = hitAt(p); if (!n) return;
    e.preventDefault(); audio();
    B.selected = []; B.pointer = { id: e.pointerId, last: p };
    board.setPointerCapture(e.pointerId);
    select(n.id);
  });
  board.addEventListener('pointermove', e => {
    if (!B?.pointer || B.pointer.id !== e.pointerId) return;
    e.preventDefault();
    const samples = e.getCoalescedEvents?.();
    for (const s of samples?.length ? samples : [e]) { const p = local(s); sweep(B.pointer.last, p); B.pointer.last = p; }
    drawTrail();
  });
  board.addEventListener('pointerup', e => {
    if (!B?.pointer || B.pointer.id !== e.pointerId) return;
    sweep(B.pointer.last, local(e));
    const id = B.pointer.id; B.pointer = null;
    if (board.hasPointerCapture(id)) board.releasePointerCapture(id);
    if (B.selected.length >= B.answer.length) check(); else { B.selected = []; paint(); }   // 途中で離したらキャンセル
  });
  board.addEventListener('pointercancel', e => { if (B?.pointer?.id === e.pointerId) cancelGesture(); });
  board.addEventListener('lostpointercapture', e => { if (B?.pointer?.id === e.pointerId) cancelGesture(); });
  board.addEventListener('contextmenu', e => e.preventDefault());
  addEventListener('blur', () => cancelGesture());
})();

function check() {
  const word = B.selected.map(id => B.nodes[id].char).join('');
  if (word === B.answer.join('')) return solved();
  // まちがい：同じ問題で続行。連続は切れる。
  P.missed = true; P.combo = 0; renderCount(); sfx.ng();
  const slots = $('#slots'), board = $('#board'); slots.classList.remove('wrong'); void slots.offsetWidth; slots.classList.add('wrong'); board.classList.add('wrong');
  setTimeout(() => { slots.classList.remove('wrong'); board.classList.remove('wrong'); if (B && P && !P.solved) { B.selected = []; paint(); } }, 520);
}
function solved() {
  const w = P.w, i = P.i, isNew = !registered(i), clean = !P.missed && !P.assisted;
  P.solved = true; P.count++;
  S.learned[w.id] = (S.learned[w.id] || 0) + 1;
  const r = lvRec(P.lvl); r.solved++;
  P.combo = clean ? P.combo + 1 : 0; r.best = Math.max(r.best, P.combo); S.best = Math.max(S.best, P.combo);
  if (!clean) P.retry.push({ i, at: P.n + 4 });   // まちがえた・答えを見た語は少しあとでもう一度
  let unlocked = 0;
  if (!unlockAll() && P.lvl === S.open && S.open < 5 && r.solved >= UNLOCK_AT) { S.open++; unlocked = S.open; }
  persist();
  sfx.ok(); paint(); renderCount();
  $('#play').classList.add('is-done'); $('#picture').classList.remove('new');
  $('#boardWrap').hidden = true; $('#actions').hidden = true; endBoard();
  const done = $('#done');
  done.innerHTML = `<p class="meta"><span class="chip s${STAR[i]}">${stars(STAR[i])} ${STAR_NAMES[STAR[i] - 1]}</span><span>${noStr(i)}</span>${isNew ? '<span class="reg">ずかんに登録</span>' : ''}</p>
    ${sceneHTML(w)}${pronHTML(w)}
    ${unlocked ? `<p class="unlocked">${stars(unlocked)} ${STAR_NAMES[unlocked - 1]} が開きました</p>` : ''}
    <button type="button" class="next" id="nextBtn">つぎへ<svg><use href="#i-arrow"/></svg></button>`;
  done.hidden = false;
  speak(w.en);
  // 解説文がある語は、単語のあとに英文を読み上げ、自動では進まない（元のパズルと同じ）
  if (w.capEn) P.readT = setTimeout(() => { if (P?.solved && P.i === i) speak(w.capEn, .9); }, 1100);
  else P.autoT = setTimeout(() => { if (P?.solved && P.i === i) nextQuestion(); }, 1800);
  bindPron(done, w, () => { clearTimeout(P.autoT); clearTimeout(P.readT); });
  $('#nextBtn').onclick = () => nextQuestion();
  $('#nextBtn').focus({ preventScroll: true });
}

/* 下の3ボタン：まぜる / 聞く / 答え（元のパズルと同じ） */
$('#mixBtn').addEventListener('click', () => {
  if (!B || P.solved || B.demo || B.pointer) return;
  cancelGesture();
  const before = B.nodes.map(n => `${n.ux},${n.uy}`).join('|');
  for (let t = 0; t < 6; t++) { arrange(); if (B.nodes.map(n => `${n.ux},${n.uy}`).join('|') !== before) break; }
  layoutBoard(); paint();
});
$('#listenBtn').addEventListener('click', () => { if (!P) return; audio(); speak(P.w.en); });
$('#hintBtn').addEventListener('click', () => {
  if (!B || P.solved || B.demo) return;
  cancelGesture(); B.demo = true; P.assisted = true;
  if (P.combo) { P.combo = 0; renderCount(); }
  const nodes = B.nodes.slice(), gap = 320, board = B;
  nodes.forEach((n, k) => {
    setTimeout(() => { if (B === board) { n.el.classList.add('wave'); sfx.pick(k); } }, k * gap);
    setTimeout(() => n.el.classList.remove('wave'), k * gap + 700);
  });
  setTimeout(() => { if (B === board) B.demo = false; }, nodes.length * gap + 500);
});

/* キーボード：Esc でやめる、Enter で次へ */
addEventListener('keydown', e => {
  if ($('#modal').open || !P) return;
  if (e.key === 'Escape') quitPlay();
  else if (e.key === 'Enter' && P.solved) { e.preventDefault(); nextQuestion(); }
});

/* ───────── boot ───────── */
renderSound();
showTab('Play');
window.PQ = { get state() { return S; }, get play() { return P; }, get board() { return B; }, W, D, startPlay, _word: en => { const i = D.words.findIndex(r => r[1] === en && (r[6] & 1)); if (P && i >= 0) { P.retry.unshift({ i, at: 0 }); nextQuestion(); } } };
})();
