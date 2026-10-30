/* Wild Wordopia 図鑑
   イラスト(Pictlingo Dictionary の確認済みカタログ)と、語彙マスターの語源・祖先を一つの図鑑にする。
   表示するのは build-data.cjs が書き出した値だけ。ここで語義や語源を作らない。 */
(async () => {
'use strict';
const BASE = 'support/wild-wordopia-encyclopedia/';
const GAME = 'pictlingo-game.html';                 // モバイルゲーム(Pictlingo)の入口
const $ = (s, p = document) => p.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = n => Number(n || 0).toLocaleString('ja-JP');
const view = $('#view');
const local = location.protocol === 'file:';

/* ───────── データ ───────── */
async function unpack(env, name) {
  if (env?.encoding !== 'gzip-base64') throw Error(name + ' がありません');
  const bytes = Uint8Array.from(atob(env.data), c => c.charCodeAt(0));
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if (globalThis.crypto?.subtle) {
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', buf))].map(b => b.toString(16).padStart(2, '0')).join('');
    if (h !== env.sha256) throw Error(name + ' のデータが壊れています');
  }
  return JSON.parse(new TextDecoder().decode(buf));
}
function loadScript(src) {
  return new Promise((ok, ng) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ng(Error(src)); document.head.append(s); });
}
let DATA;
try { DATA = await unpack(window.WILD_ENCY_INDEX, '図鑑'); }
catch (e) {
  console.error(e);
  view.innerHTML = '<div class="wrap empty"><b>図鑑のデータを読み込めませんでした</b>support/wild-wordopia-encyclopedia/data/ を確認して、ページを読み込み直してください。</div>';
  return;
}
const ROOTS = DATA.roots.map((r, i) => ({ ...r, i }));
const FAMS = DATA.fams, LANGS = DATA.langs, SUBS = DATA.subs;
const W = DATA.words.map((a, i) => ({ i, id: a[0], w: a[1], ja: a[2], k: a[3], t: a[4], art: a[5], v: a[6], cats: a[7], roots: a[8], lvl: a[9], r: a[10], fams: a[11], cap: a[12], play: a[13], kana: a[14] }));
const byId = new Map(W.map(w => [w.id, w]));
const rootByKey = new Map(ROOTS.map(r => [r.key, r]));
const byRoot = new Map(), bySub = new Map(), byFam = new Map();
const push = (m, k, v) => (m.get(k) || m.set(k, []).get(k)).push(v);
for (const w of W) { for (const r of w.roots) push(byRoot, r, w); for (const c of w.cats) push(bySub, c, w); for (const f of w.fams) push(byFam, f, w); }
const SUB = SUBS.map(key => { const [cid, sid] = key.split('/'); const c = DATA.categories.find(x => x.id === cid); const s = c?.subs.find(x => x.id === sid); return { key, cat: c, sub: s }; });
const CAT = new Map(DATA.categories.map(c => [c.id, c]));
const inCat = cid => { const seen = new Set(), out = []; SUB.forEach((s, i) => { if (s.cat?.id !== cid) return; for (const w of bySub.get(i) || []) if (!seen.has(w.id)) { seen.add(w.id); out.push(w); } }); return out; };
const subIdx = key => SUBS.indexOf(key);
const WILDS = ROOTS.filter(r => r.c);
const noRootWords = W.filter(w => !w.roots.length);
const rootKids = r => byRoot.get(r.i) || [];

/* ───────── 見た目の部品 ───────── */
const thumbURL = w => w.t ? 'eigo-no-e/thumbs/' + encodeURIComponent(w.t) : fullURL(w);
const fullURL = w => '../assets/word/' + encodeURIComponent(w.art) + '.png?v=' + w.v;
const firstJa = w => String(w.ja || '').split('、')[0];
const FAM_COLOR = { 'ゲルマン':'#56758f', 'ロマンス':'#c0693c', 'ギリシャ':'#3f7fae', 'ケルト':'#4e8f6b', 'スラヴ':'#8a67c9', 'イラン':'#b0577a', 'インド・アーリヤ':'#a0722d', 'セム':'#7d8a2f', '日琉':'#d4547a', '漢語':'#b84a3a' };
const famTag = (f, link = true) => { const name = typeof f === 'number' ? FAMS[f] : f; const c = FAM_COLOR[name] || '#7a7f8c'; return link ? `<a class="fam" style="--c:${c}" href="#/o/${encodeURIComponent(name)}">${esc(name)}</a>` : `<span class="fam" style="--c:${c}">${esc(name)}</span>`; };
const pieLabel = r => r.kindJa && /lemma|sound|alias/.test(r.kind || '') ? r.kindJa + ' ' + r.pie : '*' + String(r.pie).replace(/^\*/, '');
const isLemma = r => /lemma|sound_symbolism|alias/.test(r.kind || '');

/* キャラ画像: キャラクター管理の最新 → ライブラリの採用画像 → 影 */
function charImg(r, cls = '') {
  if (!r?.c) return '';
  const first = r.c.latest || r.c.file;
  return `<img class="${cls}" src="${esc(first)}" data-fb="${esc(r.c.file)}" alt="${esc(r.c.name)}" loading="lazy" decoding="async">`;
}
document.addEventListener('error', e => {
  const img = e.target; if (img.tagName !== 'IMG') return;
  if (img.dataset.fb && img.getAttribute('src') !== img.dataset.fb) { img.src = img.dataset.fb; delete img.dataset.fb; return; }
  if (img.dataset.full && img.getAttribute('src') !== img.dataset.full) { img.src = img.dataset.full; delete img.dataset.full; return; }
  img.style.visibility = 'hidden';
}, true);

/* 難易度: 独自学習レベル(1〜10, 暫定)を ★5つ・半分刻みで出す */
function stars(lvl, big = false) {
  if (!Number.isInteger(lvl) || lvl < 1 || lvl > 10) return '';
  const v = lvl / 2, label = `難易度 ${v} / 5(独自レベル ${lvl} / 10・暫定の目安)`;
  return `<span class="stars${big ? ' big' : ''}" role="img" aria-label="${label}" title="${label}">${big ? '難易度' : ''}<span class="s" style="--v:${v}" aria-hidden="true">★★★★★<i>★★★★★</i></span></span>`;
}
const RAR_COLOR = ['#7a7f8c', '#4d7d4a', '#2f7fc0', '#7a49c6', '#c23f86', '#b06a00', '#7b5a00', '#1f2a44'];
function rarity(r) {
  const m = window.EtymonRarity?.numeric(r, 'detail');
  if (!m || !m.stars) return '';
  return `<span class="rar" style="--rc:${RAR_COLOR[m.stars] || '#5d6680'}" title="${esc(m.label)}(英語での使われにくさ。難易度とは別の指標)">${esc(m.label)}</span>`;
}

function tile(w) {
  return `<a class="tile" href="#/w/${encodeURIComponent(w.id)}"><span class="pic"><img src="${esc(thumbURL(w))}" data-full="${esc(fullURL(w))}" alt="${esc(w.w)} のイラスト" loading="lazy" decoding="async" width="320" height="320"></span><span class="cap"><span class="tw" lang="en">${esc(w.w)}</span><span class="j">${esc(firstJa(w))}</span>${stars(w.lvl)}</span></a>`;
}
const pages = new Map(); let serial = 0;
function grid(list, step = 60) {
  const token = String(++serial), shown = Math.min(step, list.length);
  pages.set(token, { list, shown, step });
  return `<div data-grid="${token}"><div class="grid">${list.slice(0, shown).map(tile).join('')}</div>${list.length > shown ? `<div class="more"><button class="btn" type="button" data-more="${token}">もっと見る(のこり ${num(list.length - shown)} 枚)</button></div>` : ''}</div>`;
}
view.addEventListener('click', e => {
  const b = e.target.closest('[data-more]'); if (!b) return;
  const p = pages.get(b.dataset.more); if (!p) return;
  const end = Math.min(p.shown + p.step, p.list.length);
  b.closest('[data-grid]').querySelector('.grid').insertAdjacentHTML('beforeend', p.list.slice(p.shown, end).map(tile).join(''));
  p.shown = end;
  if (end >= p.list.length) b.parentElement.remove(); else b.textContent = `もっと見る(のこり ${num(p.list.length - end)} 枚)`;
});
function wcard(r, opt = {}) {
  const kids = rootKids(r);
  const thumbs = opt.kids === false ? '' : `<span class="kids">${pickKids(r, 4).map(w => `<img src="${esc(thumbURL(w))}" data-full="${esc(fullURL(w))}" alt="" loading="lazy">`).join('')}</span>`;
  if (!r.c) return '';
  return `<a class="wcard" href="#/r/${encodeURIComponent(r.key)}" style="--c:${esc(r.c.color || r.color || '#dfe9f5')}"><span class="art">${charImg(r)}</span><span class="meta"><span class="nm">${esc(r.c.name)}</span><span class="mean">「${esc(r.ja)}」の祖先</span><span class="pie" lang="en">${esc(pieLabel(r))}</span>${thumbs}</span></a>`;
}
/* 代表の子孫: キャラ名の元になった語 → やさしい語 → 解説のある語 → よく使う語 */
function pickKids(r, n) {
  const kids = rootKids(r).slice();
  const rep = r.c?.rep && kids.find(w => w.w.toLowerCase() === r.c.rep.toLowerCase());
  kids.sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (b.cap === 1) - (a.cap === 1) || (a.r ?? 9e9) - (b.r ?? 9e9));
  const out = rep ? [rep, ...kids.filter(w => w !== rep)] : kids;
  const seen = new Set(); return out.filter(w => !seen.has(w.w) && seen.add(w.w)).slice(0, n);
}

/* ───────── 単語の詳細(頭文字ごとに分けたファイルを、開くときだけ読む) ───────── */
const shardOf = w => { const c = String(w).normalize('NFD')[0].toLowerCase(); return /[a-z]/.test(c) ? c : '_'; };
const shards = new Map();
function detailsFor(w) {
  const s = shardOf(w.w);
  if (!shards.has(s)) shards.set(s, loadScript(BASE + 'data/detail-' + s + '.js?v=' + DATA.builtFrom.words_sha256.slice(0, 10)).then(() => unpack(window['WILD_ENCY_DETAIL_' + s], '詳細')).catch(e => { shards.delete(s); throw e; }));
  return shards.get(s).then(d => d.words[w.id] || {});
}
let searchRows = null;
function searchText() {
  if (!searchRows) searchRows = loadScript(BASE + 'data/search.js?v=' + DATA.builtFrom.words_sha256.slice(0, 10)).then(() => unpack(window.WILD_ENCY_SEARCH, '検索')).then(d => d.rows).catch(e => { searchRows = null; throw e; });
  return searchRows;
}

/* ───────── 検索(Pictlingo Dictionary と同じ並べ方に、カナ発音とワイルドを足す) ───────── */
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => kata2hira(String(s || '').normalize('NFKC').toLowerCase().trim());
const IDX = W.map(w => ({ w, en: norm(w.w), ja: [...String(w.ja).split('、'), ...String(w.k).split('、')].map(norm).filter(Boolean), kana: norm(w.kana) }));
function searchWord(q) {
  q = norm(q); if (!q) return [];
  const out = [];
  for (const x of IDX) {
    let s = 0;
    if (x.en === q) s = 100; else if (x.ja.includes(q)) s = 95;
    else if (x.en.startsWith(q)) s = 80 - Math.min(20, x.en.length - q.length);
    else if (x.ja.some(j => j.startsWith(q))) s = 70;
    else if (q.length >= 2 && x.kana === q) s = 68;
    else if (q.length >= 2 && x.ja.some(j => j.includes(q))) s = 60;
    else if (q.length >= 4 && x.en.includes(q)) s = 40;
    if (s) out.push([s - Math.min(5, (x.w.r ?? 15000) / 3000), x.w]);
  }
  return out.sort((a, b) => b[0] - a[0]).map(a => a[1]);
}
async function searchFuzzy(q) {
  q = norm(q); if (!q) return [];
  const rows = await searchText();
  const out = [];
  for (const x of IDX) {
    const w = x.w, cats = w.cats.flatMap(i => { const s = SUB[i]; return s?.cat ? [s.sub?.ja, s.sub?.en, s.cat.ja, s.cat.en] : []; });
    const keys = [x.en, ...x.ja, x.kana, norm(rows[w.i] || ''), ...cats.map(norm)];
    if (!keys.some(t => t && t.includes(q))) continue;
    const score = x.en === q ? 100 : x.ja.includes(q) ? 95 : x.en.startsWith(q) ? 80 : keys.some(t => t === q) ? 60 : 40;
    out.push([score - Math.min(5, (w.r ?? 15000) / 3000), w]);
  }
  return out.sort((a, b) => b[0] - a[0]).map(a => a[1]);
}
function searchWilds(q) {
  const n = norm(q); if (!n) return [];
  return WILDS.filter(r => norm(r.c.name).includes(n) || norm(r.ja) === n || norm(r.en) === n || norm(r.pie).replace(/[*-]/g, '') === n.replace(/[*-]/g, ''));
}

let mode = 'word';
const form = $('#search'), input = $('#q'), box = $('#suggest');
function setMode(m) { mode = m; form.querySelectorAll('.mode button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === m))); input.placeholder = m === 'word' ? '英単語・日本語でさがす' : 'タグ・解説・カテゴリーもさがす'; box.classList.remove('open'); }
form.querySelector('.mode').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setMode(b.dataset.mode); input.focus(); } });
let items = [], active = -1;
function paintSuggest() {
  if (mode !== 'word' || !input.value.trim()) { box.classList.remove('open'); items = []; return; }
  const all = searchWord(input.value), wilds = searchWilds(input.value).slice(0, 2);
  items = all.slice(0, 6);
  if (!items.length && !wilds.length) { box.classList.remove('open'); return; }
  box.innerHTML = wilds.map(r => `<a class="s-wild" href="#/r/${encodeURIComponent(r.key)}">${charImg(r)}<span class="s-w">${esc(r.c.name)}</span><span class="s-j">「${esc(r.ja)}」の祖先</span></a>`).join('')
    + items.map((w, i) => `<a href="#/w/${encodeURIComponent(w.id)}" class="${i === active ? 'active' : ''}"><img src="${esc(thumbURL(w))}" alt=""><span class="s-w" lang="en">${esc(w.w)}</span><span class="s-j">${esc(firstJa(w))}</span></a>`).join('')
    + (all.length > items.length ? `<a class="s-all" href="#/s/${encodeURIComponent(input.value.trim())}">「${esc(input.value.trim())}」の結果を ${num(all.length)} 件すべて見る</a>` : '');
  box.classList.add('open');
}
input.addEventListener('input', () => { active = -1; paintSuggest(); });
input.addEventListener('keydown', e => {
  if (!items.length) return;
  if (e.key === 'ArrowDown') { active = Math.min(items.length - 1, active + 1); paintSuggest(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { active = Math.max(-1, active - 1); paintSuggest(); e.preventDefault(); }
  else if (e.key === 'Escape') box.classList.remove('open');
});
input.addEventListener('blur', () => setTimeout(() => box.classList.remove('open'), 150));
form.addEventListener('submit', e => {
  e.preventDefault(); const q = input.value.trim();
  if (active >= 0 && items[active]) location.hash = '#/w/' + encodeURIComponent(items[active].id);
  else if (q) location.hash = `#/${mode === 'word' ? 's' : 't'}/${encodeURIComponent(q)}`;
  box.classList.remove('open'); input.blur();
});
addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } });
form.querySelectorAll('input,button').forEach(c => { c.disabled = false; });

/* ───────── 音声 ───────── */
let speaking = null;
function speak(text, lang = 'en-US', btn = null) {
  if (!String(text || '').trim()) return;
  if (!('speechSynthesis' in window)) return toast('この端末では音声を再生できません');
  if (speaking === btn && btn) { speechSynthesis.cancel(); btn.setAttribute('aria-pressed', 'false'); speaking = null; return; }
  speechSynthesis.cancel(); document.querySelectorAll('[data-say][aria-pressed="true"]').forEach(b => b.setAttribute('aria-pressed', 'false'));
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = lang.startsWith('ja') ? 1 : .9;
  const v = speechSynthesis.getVoices().find(v => v.lang.toLowerCase() === lang.toLowerCase()); if (v) u.voice = v;
  speaking = btn; btn?.setAttribute('aria-pressed', 'true');
  u.onend = u.onerror = () => { btn?.setAttribute('aria-pressed', 'false'); if (speaking === btn) speaking = null; };
  speechSynthesis.speak(u);
}
view.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) { e.preventDefault(); speak(b.dataset.say, b.dataset.lang || 'en-US', b); } });
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800); }

/* ───────── ゲームへの導線 ───────── */
const gameURL = w => w ? `${GAME}?word=${encodeURIComponent(w.id)}&lang=en` : GAME;
const DAILY = ['animals', 'food', 'vehicles', 'nature', 'home', 'things', 'clothes', 'play', 'arts'];
function todaysWord() {
  const list = W.filter(w => w.play && w.cats.some(i => DAILY.includes(SUB[i]?.cat?.id)));
  if (!list.length) return null;
  const d = new Date(); let h = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  for (let i = 0; i < 3; i++) h = (h * 2654435761 + 12345) >>> 0;
  return list[h % list.length];
}
function gameBand() {
  const w = todaysWord();
  return `<section class="band sky" aria-labelledby="gh"><div class="wrap game">
    <div>
      <h2 class="h2" id="gh">絵を見て、英単語をなぞる。</h2>
      <p class="sub">図鑑の絵がそのままパズルになります。スマホで毎日1問から。</p>
      ${w ? `<div class="q"><div class="qpic"><img src="${esc(thumbURL(w))}" alt="きょうの1問のイラスト" loading="lazy"><span aria-hidden="true">?</span></div><div><small>きょうの1問</small><b>この絵、英語でなんて言う？</b><a class="btn sun" href="${esc(gameURL(w))}"><svg aria-hidden="true"><use href="#i-play"/></svg>ゲームで答える</a></div></div>` : `<p style="margin-top:18px"><a class="btn sun" href="${GAME}">ゲームであそぶ</a></p>`}
    </div>
    <a class="shot" href="${esc(gameURL(w))}" aria-label="ゲームをひらく"><img src="pictpedia/img/puzzle-shot.webp" alt="ゲーム画面: 絵を見て cat の文字をなぞっている" loading="lazy"></a>
  </div></section>`;
}

/* ───────── ページ ───────── */
const pickup = () => { const easy = shuffle(W.filter(w => w.lvl && w.lvl <= 6 && w.roots.some(i => ROOTS[i].c))).slice(0, 12); const ids = new Set(easy.map(w => w.id)); return shuffle([...easy, ...shuffle(W.filter(w => !ids.has(w.id) && w.lvl && w.lvl <= 7)).slice(0, 6)]); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const crumbs = (...xs) => `<nav class="crumbs" aria-label="現在地"><a href="#/">トップ</a>${xs.map(([h, t]) => h ? `<a href="${h}">${esc(t)}</a>` : `<span>${esc(t)}</span>`).join('')}</nav>`;
const byFamily = list => { const g = new Map(); for (const w of list) { const fs = w.fams.length ? w.fams : [-1]; for (const f of fs) push(g, f, w); } return [...g].sort((a, b) => b[1].length - a[1].length); };
const wildsSorted = () => WILDS.slice().sort((a, b) => rootKids(b).length - rootKids(a).length || (a.rank ?? 9e9) - (b.rank ?? 9e9));
const undiscovered = () => ROOTS.filter(r => !r.c && !isLemma(r) && rootKids(r).length).sort((a, b) => rootKids(b).length - rootKids(a).length);

/* hero: 広場にワイルドが5体 */
const SLOTS = [[.89, .82, .32, '36%'], [.71, .48, .29, '58%'], [.45, .70, .26, '43%'], [.25, .82, .27, '28%'], [.57, .93, .40, '43%']];
const FIRST = ['ped-', 'weid-', 'eghs', 'upo', 'kaput-'];
function fillSlot(a, r) {
  a.href = '#/r/' + encodeURIComponent(r.key); a.setAttribute('aria-label', `${r.c.name}(「${r.ja}」の祖先)`);
  a.innerHTML = `${charImg(r)}<span class="lbl"><b>${esc(r.c.name)}</b><small>「${esc(r.ja)}」の祖先</small></span>`;
}
function home() {
  const totalW = W.length, totalWild = WILDS.length, hidden = undiscovered();
  const cast = FIRST.map(k => rootByKey.get(k)).filter(r => r?.c);
  while (cast.length < 5 && WILDS.length > cast.length) { const r = WILDS[Math.random() * WILDS.length | 0]; if (!cast.includes(r)) cast.push(r); }
  const featured = wildsSorted().slice(0, 10);
  const tries = [['s', 'helicopter'], ['s', '船長'], ['s', 'music'], ['t', '木'], ['s', 'onion'], ['t', '学校']];
  const famList = FAMS.map((f, i) => [f, i, (byFam.get(i) || []).length]).sort((a, b) => b[2] - a[2]);
  view.innerHTML = `<div class="page home">
  <section class="hero" aria-labelledby="h1">
    <div class="copy">
      <p class="logo" id="h1" aria-label="Wild Wordopia"><span class="a">Wild</span><br><span class="b">Word</span><span class="c">opia</span></p>
      <div class="tagBox">
        <p class="tag">英単語の祖先が、<br>いきものになった。</p>
        <p class="heroLead"><b lang="en">captain</b>(船長)も <b lang="en">cabbage</b>(キャベツ)も、6000年前の同じ「頭」から生まれた親戚。<b class="count">${num(totalW)}</b> 語のイラストと、その祖先 <b class="count">${num(totalWild)}</b> 体を収録。</p>
      </div>
      <div class="cta"><a class="btn sun" href="${GAME}"><svg aria-hidden="true"><use href="#i-play"/></svg>ゲームであそぶ</a><button class="btn" type="button" id="swap">ほかの住人を呼ぶ</button></div>
    </div>
    <div class="stage" id="stage"><div class="world" id="world" role="group" aria-label="広場で暮らすワイルドたち">${SLOTS.map((p, i) => `<a class="w" style="--x:${p[0]};--g:${p[1]};--h:${p[2]};--lx:${p[3]};--z:${i === 4 ? 30 : Math.round(p[1] * 8) + 10}"></a>`).join('')}</div></div>
    <p class="swipe">← 横にスワイプして広場を見わたす →</p>
  </section>
  <div class="wrap"><p class="tagrow" style="padding:14px 0 0;font-size:13px;color:var(--mute)">たとえば ${tries.map(([m, q]) => `<a class="chip" href="#/${m}/${encodeURIComponent(q)}"${m === 't' ? ' title="あいまい検索"' : ''}>${esc(q)}</a>`).join('')}</p></div>

  <section class="band grass" aria-labelledby="dh" style="margin-top:14px;border-top:var(--line)"><div class="wrap">
    <div class="secHead"><div><h2 class="h2" id="dh">ワイルド図鑑</h2><p class="sub">1体が、英単語の祖先1つ。タップすると、その祖先から生まれた英単語が絵で並びます。</p></div><a class="btn" href="#/wilds">${num(totalWild)}体すべて見る</a></div>
    <div class="wilds">${featured.map(r => wcard(r)).join('')}</div>
  </div></section>

  <section class="band" aria-labelledby="ch"><div class="wrap">
    <div class="secHead"><div><h2 class="h2" id="ch">カテゴリーからさがす</h2><p class="sub">動物、食べ物、気持ち、動き……絵で引ける英単語の辞書です。</p></div><a class="btn" href="#/all">すべての絵 ${num(totalW)}枚</a></div>
    ${catGrid()}
  </div></section>

  ${gameBand()}

  <section class="band" aria-labelledby="rh"><div class="wrap">
    <div class="secHead"><div><h2 class="h2" id="rh">ことばの道</h2><p class="sub">同じ祖先の子孫でも、英語にとどくまでに通った道はいろいろ。語源系統ごとに見てみよう。</p></div><a class="btn" href="#/roads">ことばの道をすべて見る</a></div>
    <div class="roads">${famList.slice(0, 3).map(([f, i, n]) => roadCard(f, i, n)).join('')}</div>
  </div></section>

  <section class="band grass" aria-labelledby="ph"><div class="wrap">
    <div class="secHead"><div><h2 class="h2" id="ph">ピックアップ</h2></div><button class="btn" type="button" id="reshuffle">ほかの絵</button></div>
    <div id="pick">${grid(pickup(), 18)}</div>
  </div></section>
  </div>`;
  document.querySelectorAll('#world .w').forEach((a, i) => cast[i] && fillSlot(a, cast[i]));
  let shown = new Set(cast.map(r => r.key));
  $('#swap').onclick = () => {
    let pool = WILDS.filter(r => !shown.has(r.key)); if (pool.length < SLOTS.length) { shown = new Set(); pool = WILDS.slice(); }
    const pick = []; while (pick.length < SLOTS.length && pool.length) pick.push(pool.splice(Math.random() * pool.length | 0, 1)[0]);
    pick.forEach(r => shown.add(r.key));
    document.querySelectorAll('#world .w').forEach((a, i) => setTimeout(() => { a.classList.add('out'); setTimeout(() => { if (pick[i]) fillSlot(a, pick[i]); a.classList.remove('out'); }, 330); }, i * 90));
  };
  $('#reshuffle').onclick = () => { $('#pick').innerHTML = grid(pickup(), 18); };
  requestAnimationFrame(() => { const st = $('#stage'); if (st && st.scrollWidth > st.clientWidth + 4) st.scrollLeft = st.scrollWidth * .57 - st.clientWidth / 2; });
  document.title = 'Wild Wordopia — 英単語の祖先とイラストの図鑑';
}
function catGrid() {
  return `<div class="cats">${DATA.categories.map(c => { const icon = byId.get(c.icon) || inCat(c.id)[0]; return `<a class="cat" href="#/c/${c.id}">${icon ? `<img src="${esc(thumbURL(icon))}" alt="" loading="lazy">` : ''}<b>${esc(c.ja)}</b><small>${esc(c.en)}</small></a>`; }).join('')}</div>`;
}
function roadCard(f, i, n) {
  const sample = (byFam.get(i) || []).filter(w => w.lvl && w.lvl <= 3).slice(0, 5);
  return `<a class="road" href="#/o/${encodeURIComponent(f)}" style="--c:${FAM_COLOR[f] || '#7a7f8c'}"><b>${esc(f)}</b><span class="count">${num(n)}語</span><span class="thumbs">${sample.map(w => `<img src="${esc(thumbURL(w))}" alt="" loading="lazy">`).join('')}</span></a>`;
}

function wildsPage() {
  const list = wildsSorted();
  view.innerHTML = `<div class="page">${'<div class="wrap">' + crumbs(['', 'ワイルド図鑑'])}
    <div class="secHead"><div><h1 class="h1">ワイルド図鑑 <span class="count">${num(list.length)}</span>体</h1><p class="sub">英単語の祖先を、いきものの姿にしました。</p></div></div>
    <div class="wilds">${list.map(r => wcard(r)).join('')}</div></div></div>`;
  if (mb) mb.onclick = () => { const end = Math.min(shown + 48, hidden.length); $('#hiddenWilds').insertAdjacentHTML('beforeend', hidden.slice(shown, end).map(r => wcard(r, { kids: false })).join('')); shown = end; if (end >= hidden.length) mb.parentElement.remove(); else mb.textContent = `もっと見る(のこり ${num(hidden.length - end)} 体)`; };
  document.title = 'ワイルド図鑑 — Wild Wordopia';
}

function wildPage(key) {
  const r = rootByKey.get(key); if (!r) return notFound();
  const top = pickKids(r, 4), topIds = new Set(top.map(w => w.id)), kids = rootKids(r).filter(w => !topIds.has(w.id)), groups = byFamily(kids);
  const left = top.filter((_, i) => i % 2 === 0), right = top.filter((_, i) => i % 2 === 1);
  const rw = w => `<a class="rw" href="#/w/${encodeURIComponent(w.id)}" data-node><img src="${esc(thumbURL(w))}" data-full="${esc(fullURL(w))}" alt="" loading="lazy"><span><b lang="en">${esc(w.w)}</b><small>${esc(firstJa(w))}</small></span></a>`;
  const name = r.c ? r.c.name : pieLabel(r);
  const d = String(r.d || ''), short = d.length > 160 ? d.slice(0, d.indexOf('。', 90) + 1 || 160) : d;
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['#/wilds', 'ワイルド図鑑'], ['', name])}
    <div class="wildHero">
      <div>
        <h1 class="wildName">${esc(name)}${r.c?.nameEn ? `<small lang="en">${esc(r.c.nameEn)}</small>` : ''}</h1>
        <p class="wildMean">「${esc(r.ja)}」の祖先${r.c ? `<span class="pie" lang="en">${esc(pieLabel(r))}${r.en ? ' ' + esc(r.en) : ''}</span>` : (r.en ? `<span class="pie" lang="en">${esc(r.en)}</span>` : '')}</p>
        <div class="playRow"><a class="btn sun" href="${esc(gameURL(top[0]))}"><svg aria-hidden="true"><use href="#i-play"/></svg>この一族の単語であそぶ</a></div>
      </div>
    </div>
    <section aria-label="${esc(name)}と子孫の英単語"><div class="radial" id="radial"><svg class="lines" aria-hidden="true"></svg><div class="side">${left.map(rw).join('')}</div><div class="core" data-core>${r.c ? charImg(r) : `<span class="pieTxt" lang="en">${esc(pieLabel(r))}<br><small>「${esc(r.ja)}」</small></span>`}</div><div class="side">${right.map(rw).join('')}</div></div></section>
    ${d ? `<section aria-labelledby="noteH"><h2 class="h3" id="noteH">祖先メモ</h2><div class="note"><span id="noteText">${esc(short)}</span>${short !== d ? ` <button class="chip" type="button" id="noteMore">つづきを読む</button>` : ''}${r.src ? `<br><a href="${esc(r.src.split(' | ')[0])}" target="_blank" rel="noopener">出典を確認する</a>` : ''}</div></section>` : ''}
    <section aria-labelledby="kidsH"><div class="secHead"><div><h2 class="h2" id="kidsH">${top.length ? 'ほかの子孫' : '子孫の英単語'}</h2></div></div>
      <div class="famTabs" role="group" aria-label="語源系統">${groups.length > 1 ? `<button class="chip on" type="button" data-fam="all">すべて <small>${num(kids.length)}</small></button>` : ''}${groups.length > 1 ? groups.map(([f, l]) => `<button class="chip" type="button" data-fam="${f}">${f < 0 ? '系統未確認' : esc(FAMS[f])} <small>${num(l.length)}</small></button>`).join('') : ''}</div>
      <div id="kids">${grid(kids.slice().sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (a.r ?? 9e9) - (b.r ?? 9e9)))}</div></section>
  </div>${gameBand()}</div>`;
  if (!kids.length) $('#kidsH')?.closest('section')?.remove();
  const nm = $('#noteMore'); if (nm) nm.onclick = () => { $('#noteText').textContent = d; nm.remove(); };
  document.querySelectorAll('[data-fam]').forEach(b => b.onclick = () => {
    document.querySelectorAll('[data-fam]').forEach(x => x.classList.toggle('on', x === b));
    const f = b.dataset.fam, list = f === 'all' ? kids : (groups.find(g => String(g[0]) === f)?.[1] || []);
    $('#kids').innerHTML = grid(list.slice().sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (a.r ?? 9e9) - (b.r ?? 9e9)));
  });
  drawLines();
  document.title = `${name}(「${r.ja}」の祖先) — Wild Wordopia`;
}
/* 線はキャラから各単語へだけ引く(単語どうしはつながない) */
function drawLines() {
  const box = $('#radial'); if (!box) return;
  const draw = () => {
    const svg = box.querySelector('svg.lines'), core = box.querySelector('[data-core]'), b = box.getBoundingClientRect(), c = core.getBoundingClientRect();
    const cx = c.left + c.width / 2 - b.left, cy = c.top + c.height / 2 - b.top;
    svg.innerHTML = [...box.querySelectorAll('[data-node]')].map(n => { const r = n.getBoundingClientRect(); const left = r.left + r.width / 2 < c.left + c.width / 2; const x = (left ? r.right : r.left) - b.left, y = r.top + r.height / 2 - b.top; return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; }).join('');
  };
  draw(); box.querySelectorAll('img').forEach(i => i.addEventListener('load', draw, { once: true }));
  const ro = new ResizeObserver(draw); ro.observe(box);
  addEventListener('hashchange', () => ro.disconnect(), { once: true });
}

async function wordPage(id) {
  const w = byId.get(id); if (!w) return notFound();
  const sub = SUB[w.cats[0]];
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(...(sub?.cat ? [[`#/c/${sub.cat.id}`, sub.cat.ja], [`#/c/${sub.cat.id}/${sub.sub.id}`, sub.sub.ja]] : []), ['', w.w])}<p class="loading">読み込み中…</p></div></div>`;
  let d = {};
  try { d = await detailsFor(w); } catch (e) { console.warn(e); }
  if (location.hash !== '#/w/' + encodeURIComponent(id) && decodeURIComponent(location.hash) !== '#/w/' + id) return;
  const ancestors = w.roots.map(i => ROOTS[i]);
  const unc = new Set(d.unc || []);
  const meanings = (d.mean || []).map(([pos, senses]) => `<p>${pos ? `<span class="pos">${esc(pos)}</span>` : ''}${senses.map(s => esc(s[0]) + (s[1] ? ` <span class="use" lang="en">(${tokens(s[1])})</span>` : '')).join('、')}</p>`).join('');
  const forms = (d.forms || []).length ? `<p class="forms">${d.forms.map(([l, v]) => `<strong>${esc(l)}</strong><span lang="en">${tokens(v)}</span>`).join('')}</p>` : '';
  const verb = (d.verb || []).length ? `<p class="forms"><strong>動詞の活用</strong>${d.verb.map(([l, v]) => `<span><small>${esc(l)}</small> <span lang="en">${tokens(v)}</span></span>`).join('')}</p>` : '';
  const catTags = new Map(); for (const i of w.cats) { const s = SUB[i]; if (!s?.cat) continue; catTags.set('#/c/' + s.cat.id, s.cat.ja); catTags.set('#/c/' + s.cat.id + '/' + s.sub.id, s.sub.ja); }
  const ancLink = r => `<a href="#/r/${encodeURIComponent(r.key)}"${r.c ? '' : ' class="noimg"'}>${r.c ? charImg(r) : ''}<span><b>${esc(r.c ? r.c.name : pieLabel(r))}</b><small>「${esc(r.ja)}」${r.c ? ' ' + esc(pieLabel(r)) : ''}${unc.has(r.key) ? ' <span class="warn">つながり確認中</span>' : ''}</small></span></a>`;
  const ety = [
    d.parts ? ['語源組み立て', esc(d.parts)] : null,
    d.b ? ['ひとことメモ', esc(d.b)] : null,
    w.fams.length ? ['語源系統', `<span class="tagrow">${w.fams.map(f => famTag(f)).join('')}</span>`] : null,
    (d.lang || []).length ? ['起源言語', `<span class="tagrow">${d.lang.map(l => `<span class="chip">${esc(LANGS[l])}</span>`).join('')}</span>`] : null,
    d.pre || d.suf ? ['接頭辞・接尾辞', `<span class="tagrow" lang="en">${[d.pre, d.suf].filter(Boolean).join(', ').split(',').map(x => x.trim()).filter(Boolean).map(x => `<span class="chip">${esc(x)}</span>`).join('')}</span>`] : null,
  ].filter(Boolean);
  const siblings = new Map();
  for (const r of ancestors) { const list = rootKids(r).filter(x => x.id !== w.id && x.w !== w.w); if (list.length) siblings.set(r, list); }
  const seen = new Set([w.id]); const related = w.cats.flatMap(i => bySub.get(i) || []).filter(x => !seen.has(x.id) && seen.add(x.id));
  const eoURL = 'https://www.etymonline.com/word/' + encodeURIComponent(w.w.toLowerCase());
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(...(sub?.cat ? [[`#/c/${sub.cat.id}`, sub.cat.ja], [`#/c/${sub.cat.id}/${sub.sub.id}`, sub.sub.ja]] : []), ['', w.w])}
    <article class="word">
      <div class="plate"><img src="${esc(fullURL(w))}" alt="${esc(w.w)} のイラスト" width="1024" height="1024"></div>
      <div>
        <div class="wHead"><h1 class="wTitle" lang="en">${esc(w.w)}</h1><button class="spk" type="button" data-say="${esc(w.w)}" aria-label="${esc(w.w)} の発音を聞く" aria-pressed="false"><svg><use href="#i-sound"/></svg></button></div>
        <p class="pron">${(d.ipa || []).map(x => `<span class="ipa" lang="en">${esc(x)}</span>`).join('')}${w.kana ? `<span class="kana">${esc(w.kana)}</span>` : ''}</p>
        <div class="levels">${stars(w.lvl, true)}${rarity(w.r)}</div>
        <section class="mean" aria-label="意味">${meanings || `<p>${esc(d.ja || w.ja)}</p>`}</section>
        ${forms}${verb}
        <div class="scene" id="scene" aria-live="polite" hidden></div>
        ${d.sem ? `<p class="sem">${esc(d.sem)}</p>` : ''}
        <div class="tagrow" style="margin-top:14px">${[...catTags].map(([u, l]) => `<a class="chip" href="${u}">${esc(l)}</a>`).join('')}</div>
        ${ancestors.length || ety.length ? `<section class="etyBox" aria-labelledby="etyH"><h2 id="etyH">語源</h2>
          ${ancestors.length ? `<div class="etyRow"><b>祖先</b><div class="v anc">${ancestors.map(ancLink).join('')}</div></div>` : ''}
          ${ety.map(([k, v]) => `<div class="etyRow"><b>${k}</b><div class="v">${v}</div></div>`).join('')}</section>` : ''}
        <div class="playRow">${w.play ? `<a class="btn sun" href="${esc(gameURL(w))}"><svg aria-hidden="true"><use href="#i-play"/></svg>この単語でパズル</a>` : `<a class="btn sun" href="${GAME}"><svg aria-hidden="true"><use href="#i-play"/></svg>ゲームであそぶ</a>`}</div>
      </div>
    </article>
    ${[...siblings].map(([r, list]) => `<section><div class="secHead"><div><h2 class="h2">${esc(r.c ? r.c.name : pieLabel(r))}の子孫</h2><p class="sub">「${esc(r.ja)}」から生まれた、${esc(w.w)} の親戚。</p></div><a class="btn" href="#/r/${encodeURIComponent(r.key)}">${num(list.length + 1)}語すべて見る</a></div>${grid(pickKids(r, 40).filter(x => x.id !== w.id && x.w !== w.w).slice(0, 6), 6)}</section>`).join('')}
    ${related.length ? `<section><div class="secHead"><h2 class="h2">関連するイラスト</h2>${sub?.sub ? `<a class="btn" href="#/c/${sub.cat.id}/${sub.sub.id}">${esc(sub.sub.ja)}をすべて見る</a>` : ''}</div>${grid(related.slice(0, 12), 12)}</section>` : ''}
    <details class="src"><summary>出典とデータについて</summary><ul>
      ${(d.src || []).map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>(発音・語義)</li>`).join('')}
      <li>語義・語源組み立て・ひとことメモ・語源系統: 語彙マスターデータベース</li>
      <li>イラストと英日の解説: Pictlingo Dictionary の確認済みデータ。解説は絵を説明する文で、辞書の定義とは別です</li>
      <li>難易度は独自の学習レベル(暫定)、レア度は英語での使われにくさで、別の指標です</li>
      <li>再生音声は端末の合成音声です</li>
      <li><a href="${esc(eoURL)}" target="_blank" rel="noopener">etymonline で語源の記事を読む</a></li>
    </ul></details>
  </div>${gameBand()}</div>`;
  showScene(w, d);
  document.title = `${w.w}(${firstJa(w)}) — Wild Wordopia`;
}
/* 解説は、表示している画像が解説を確かめたときと同じ画像のときだけ出す */
async function showScene(w, d) {
  const box = $('#scene'); if (!box || !d.sen) return;
  let ok = local;
  if (!ok) try { const r = await fetch(fullURL(w)); if (r.ok && globalThis.crypto?.subtle) { const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await r.arrayBuffer()))].map(b => b.toString(16).padStart(2, '0')).join(''); ok = h === d.sha; } } catch {}
  if (!ok || !box.isConnected) return;
  box.innerHTML = `<div class="ln"><p lang="en">${tokens(d.sen)}</p><button class="say" type="button" data-say="${esc(d.sen)}" data-lang="en-US" aria-pressed="false"><svg><use href="#i-sound"/></svg>英語</button></div><div class="ln"><p lang="ja">${esc(d.sja)}</p><button class="say" type="button" data-say="${esc(d.sja)}" data-lang="ja-JP" aria-pressed="false"><svg><use href="#i-sound"/></svg>日本語</button></div>`;
  box.hidden = false;
}
const wordIndex = new Map(); for (const w of W) push(wordIndex, w.w.toLowerCase(), w);
function tokens(text) {
  let out = '', end = 0; text = String(text || '');
  for (const m of text.matchAll(/[A-Za-z]+(?:['’\-][A-Za-z]+)*/g)) {
    out += esc(text.slice(end, m.index));
    const hits = wordIndex.get(m[0].toLowerCase()) || [];
    out += hits.length === 1 ? `<a class="tok" href="#/w/${encodeURIComponent(hits[0].id)}">${esc(m[0])}</a>` : hits.length > 1 ? `<a class="tok" href="#/s/${encodeURIComponent(m[0])}">${esc(m[0])}</a>` : esc(m[0]);
    end = m.index + m[0].length;
  }
  return out + esc(text.slice(end));
}

function catsPage() {
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['', 'カテゴリー'])}<h1 class="h1">カテゴリーからさがす</h1><p class="sub" style="margin-bottom:20px">${num(W.length)} 語のイラストを、意味のまとまりで。</p>${catGrid()}</div></div>`;
  document.title = 'カテゴリー — Wild Wordopia';
}
function catPage(cid, sid) {
  const c = CAT.get(cid); if (!c) return notFound();
  const s = sid ? c.subs.find(x => x.id === sid) : null; if (sid && !s) return notFound();
  const subs = c.subs.map(x => ({ ...x, list: bySub.get(subIdx(cid + '/' + x.id)) || [] })).filter(x => x.list.length);
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['#/cats', 'カテゴリー'], ...(s ? [[`#/c/${cid}`, c.ja], ['', s.ja]] : [['', c.ja]]))}
    <h1 class="h1">${esc(s ? s.ja : c.ja)}<span class="sub" lang="en" style="font-size:16px;margin-left:10px">${esc(s ? s.en : c.en)}</span></h1>
    <nav class="subnav" aria-label="小分類"><a class="chip${s ? '' : ' on'}" href="#/c/${cid}">すべて <small>${num(inCat(cid).length)}</small></a>${subs.map(x => `<a class="chip${s && x.id === s.id ? ' on' : ''}" href="#/c/${cid}/${x.id}">${esc(x.ja)} <small>${num(x.list.length)}</small></a>`).join('')}</nav>
    ${s ? `<div style="margin-top:18px">${grid(bySub.get(subIdx(cid + '/' + sid)) || [])}</div>` : subs.map(x => `<section><div class="secHead"><h2 class="h2">${esc(x.ja)}</h2><a class="btn" href="#/c/${cid}/${x.id}">${num(x.list.length)}枚すべて</a></div>${grid(x.list.slice(0, 12), 12)}</section>`).join('')}
  </div></div>`;
  document.title = `${s ? s.ja : c.ja} — Wild Wordopia`;
}
function roadsPage() {
  const list = FAMS.map((f, i) => [f, i, (byFam.get(i) || []).length]).sort((a, b) => b[2] - a[2]);
  const unk = W.filter(w => !w.fams.length).length;
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['', 'ことばの道'])}<h1 class="h1">ことばの道</h1><p class="sub" style="margin-bottom:20px">英単語が英語にとどくまでに通ってきた道(語源系統)。ゲルマンの道は英語の地元、ロマンスの道はラテン語とフランス語、ギリシャの道は学問と科学のことばを運んできました。</p>
    <div class="roads">${list.filter(x => x[2] >= 20).map(([f, i, n]) => roadCard(f, i, n)).join('')}</div>
    <div class="roadsMinor">${list.filter(x => x[2] < 20).map(([f, i, n]) => `<a class="chip" href="#/o/${encodeURIComponent(f)}">${esc(f)} <small>${n}</small></a>`).join('')}</div>
    <p class="sub" style="margin-top:18px">語源系統がまだ確認されていない単語が ${num(unk)} 語あります。</p></div></div>`;
  document.title = 'ことばの道 — Wild Wordopia';
}
function famPage(name) {
  const i = FAMS.indexOf(name); if (i < 0) return notFound();
  const list = (byFam.get(i) || []).slice().sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (a.r ?? 9e9) - (b.r ?? 9e9));
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['#/roads', 'ことばの道'], ['', name])}<h1 class="h1">${famTag(name, false)} の道を通ってきた英単語</h1><p class="sub" style="margin:8px 0 20px">${num(list.length)} 語。やさしい単語から並べています。</p>${grid(list)}</div></div>`;
  document.title = `${name}の道 — Wild Wordopia`;
}
function unknownPage() {
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['#/wilds', 'ワイルド図鑑'], ['', '祖先が見つかっていない英単語'])}<h1 class="h1">祖先が見つかっていない英単語</h1>
    <p class="sub" style="margin:8px 0 20px">この ${num(noRootWords.length)} 語は、どの祖先から生まれたのかがまだ図鑑に登録されていません。祖先がわかったものから、ワイルドが姿をあらわします。</p>
    ${grid(noRootWords.slice().sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (a.r ?? 9e9) - (b.r ?? 9e9)))}</div></div>`;
  document.title = '祖先が見つかっていない英単語 — Wild Wordopia';
}
function allPage() {
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['', 'すべての絵'])}<h1 class="h1">すべての絵 <span class="count">${num(W.length)}</span>枚</h1><p class="sub" style="margin-bottom:20px">やさしい単語から並べています。</p>${grid(W.slice().sort((a, b) => (a.lvl ?? 99) - (b.lvl ?? 99) || (a.r ?? 9e9) - (b.r ?? 9e9)))}</div></div>`;
  document.title = 'すべての絵 — Wild Wordopia';
}
async function resultPage(m, q) {
  setMode(m === 't' ? 'text' : 'word'); input.value = q;
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['', m === 't' ? 'あいまい検索' : '単語検索'])}<p class="loading">さがしています…</p></div></div>`;
  let list = [];
  try { list = m === 't' ? await searchFuzzy(q) : searchWord(q); } catch (e) { console.warn(e); }
  const wilds = searchWilds(q);
  view.innerHTML = `<div class="page"><div class="wrap">${crumbs(['', m === 't' ? 'あいまい検索' : '単語検索'])}
    <h1 class="h1">「${esc(q)}」</h1>
    <p class="sub" style="margin:6px 0 18px">${list.length ? `${num(list.length)} 枚${m === 't' ? '(タグ・解説・カテゴリーも含む部分一致)' : ''}。` : ''}<a href="#/${m === 't' ? 's' : 't'}/${encodeURIComponent(q)}">${m === 't' ? '単語検索' : 'あいまい検索'}でためす</a></p>
    ${wilds.length ? `<section style="margin:0 0 28px"><h2 class="h3">ワイルド</h2><div class="wilds">${wilds.map(r => wcard(r)).join('')}</div></section>` : ''}
    ${list.length ? grid(list) : wilds.length ? '' : `<div class="empty"><b>見つかりませんでした</b>${m === 't' ? 'ことばを変えてためしてください。' : 'つづりを変えるか、あいまい検索をためしてください。'}</div>`}
  </div></div>`;
  document.title = `「${q}」 — Wild Wordopia`;
}
function notFound() { view.innerHTML = `<div class="page"><div class="wrap empty"><b>ページが見つかりませんでした</b><a href="#/">トップへもどる</a></div></div>`; }

function route() {
  pages.clear(); speechSynthesis?.cancel?.();
  let h; try { h = decodeURIComponent(location.hash.replace(/^#\/?/, '')); } catch { return notFound(); }
  const [kind, a, b] = h.split('/');
  const tab = !kind ? 'home' : kind === 'wilds' || kind === 'r' || kind === 'unknown' ? 'wilds' : kind === 'cats' || kind === 'c' ? 'cats' : kind === 'roads' || kind === 'o' ? 'roads' : kind === 'all' ? 'all' : '';
  document.querySelectorAll('.tabs a').forEach(x => x.classList.toggle('on', x.dataset.tab === tab));
  const rest = h.slice(kind.length + 1);
  if (!kind) home();
  else if (kind === 'wilds') wildsPage();
  else if (kind === 'r') wildPage(rest);
  else if (kind === 'w') wordPage(rest);
  else if (kind === 'cats') catsPage();
  else if (kind === 'c') catPage(a, b);
  else if (kind === 'roads') roadsPage();
  else if (kind === 'o') famPage(rest);
  else if (kind === 'unknown') unknownPage();
  else if (kind === 'all') allPage();
  else if (kind === 's' || kind === 't') resultPage(kind, rest);
  else if (kind === 'p') location.replace(gameURL(byId.get(rest)));
  else notFound();
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
})();
