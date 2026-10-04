/* えいごのえ — 英単語のイラスト辞典(試作)
   データは build.py が作る data.js (window.EIGO_NO_E)。file:// でも http でも動く。 */
(() => {
'use strict';
const D = window.EIGO_NO_E;
const $ = (s, p = document) => p.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const view = $('#view');
if (!D || !D.words) { view.innerHTML = '<div class="empty"><b>データが読み込めませんでした</b>app/eigo-no-e/build.py を実行してください。</div>'; return; }

/* ───────── index ───────── */
const W = D.words;
const byId = new Map(W.map(w => [w.id, w]));
const CAT = new Map(), SUB = new Map(), inSub = new Map();
for (const c of D.categories) { CAT.set(c.id, c); for (const s of c.subs) SUB.set(`${c.id}/${s.id}`, {...s, cat: c}); }
for (const w of W) for (const k of w.c) (inSub.get(k) || inSub.set(k, []).get(k)).push(w);
const inCat = id => W.filter(w => w.c.some(k => k.startsWith(id + '/')));
const thumb = w => `eigo-no-e/thumbs/${encodeURIComponent(w.id)}.webp`;
const full = w => `../assets/word/${encodeURIComponent(w.id)}.png`;
const href = w => `#/w/${encodeURIComponent(w.id)}`;
const firstJa = w => String(w.ja || '').split('、')[0];
const num = n => n.toLocaleString('ja-JP');
const POS = {'名':'名詞','動':'動詞','形':'形容詞','副':'副詞','前':'前置詞','代':'代名詞','接':'接続詞','冠':'冠詞','間':'間投詞','助':'助動詞'};
const posLabel = w => (w.pos || '').split('/').map(p => POS[p.charAt(0)] || p).join('・');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

const tile = w => `<a class="tile" href="${href(w)}"><span class="pic"><img src="${thumb(w)}" alt="${esc(w.w)} のイラスト" loading="lazy" decoding="async" width="320" height="320"></span><span class="cap"><span class="w">${esc(w.w)}</span><span class="j">${esc(firstJa(w))}</span></span></a>`;
const grid = list => `<div class="grid">${list.map(tile).join('')}</div>`;
const chev = '<svg><use href="#i-chev"/></svg>';

/* ───────── 検索 ───────── */
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => kata2hira(String(s || '').normalize('NFKC').toLowerCase().trim());
const isJa = s => /[぀-ヿ一-鿿]/.test(s);
const STOP = new Set('a an the of to in on at for with and or is are was were be being been it its this that these those who which what how do does did can could will would should my your his her their our me you he she we they them us by from as into about up out not no so very just some any one two something someone thing things have has kind sort usually often where when'.split(' '));
const stem = t => { if (t.length <= 3) return t; if (/ies$/.test(t)) return t.slice(0, -3) + 'y'; t = t.replace(t.length > 4 ? /(ing|ed|es|s)$/ : /s$/, ''); return t.length > 3 ? t.replace(/e$/, '') : t; };
const enTokens = s => norm(s).split(/[^a-z']+/).filter(t => t && !STOP.has(t)).map(stem);
// 日本語の文章を、助詞や語尾で区切った「かたまり」にする(形態素解析のかわりの簡易版)
const JA_SPLIT = /(?:ている|ています|てる|でいる|ました|ます|です|だった|する|して|した|される|られる|から|まで|より|など|[をがはにでとのへやもね、。！？!?\s])/;
const jaChunks = s => norm(s).split(JA_SPLIT).map(x => x.trim()).filter(x => x.length >= 1);
const bigrams = s => { const o = new Set(); for (let i = 0; i < s.length - 1; i++) o.add(s.slice(i, i + 2)); if (s.length === 1) o.add(s); return o; };

const IDX = W.map(w => {
  const cats = w.c.map(k => SUB.get(k)).filter(Boolean);
  const jaList = [...String(w.ja || '').split('、'), ...String(w.k || '').split('、')].map(norm).filter(Boolean);
  return {
    w, en: w.w.toLowerCase(), jaList,
    jaText: norm([w.ja, w.scene?.ja, ...cats.map(s => s.ja + ' ' + s.cat.ja)].join(' ')),
    enSet: new Set([...enTokens(w.w), ...(w.syn || []).flatMap(enTokens)]),
    defSet: new Set([...enTokens(w.d || ''), ...enTokens(w.scene?.en || ''), ...(w.h || []).flatMap(enTokens), ...(w.rel || []).flatMap(enTokens), ...cats.flatMap(s => enTokens(s.en + ' ' + s.cat.en))]),
    catJa: norm(cats.map(s => s.ja + ' ' + s.cat.ja).join(' ')),
  };
});

// 単語でさがす: 英単語のつづり、または日本語の訳
function searchWord(q) {
  q = norm(q); if (!q) return [];
  const out = [];
  for (const x of IDX) {
    let s = 0;
    if (x.en === q) s = 100;
    else if (x.jaList.includes(q)) s = 95;
    else if (x.en.startsWith(q)) s = 80 - Math.min(20, x.en.length - q.length);
    else if (x.jaList.some(j => j.startsWith(q))) s = 70;
    else if (q.length >= 2 && x.jaList.some(j => j.includes(q))) s = 60;
    else if (q.length >= 4 && x.en.includes(q)) s = 40;
    if (s) out.push([s - Math.min(5, x.w.r / 3000), x.w]);
  }
  return out.sort((a, b) => b[0] - a[0]).map(a => a[1]);
}
// 文章でさがす(あいまい検索)
// 日本語: 文の中に含まれる「訳」「読み」「カテゴリー名」を辞書引きで見つける(形態素解析のかわり)。
//         見つけた語の英単語(「飛ぶ」→ fly)で、英語の説明・上位語とも照合する
// 英語: 単語に分け、つづり・類義語・英語の説明・上位語(bird → eagle など)と照合。多くの語に当たるほど上位
const KANJI = /[\u4e00-\u9fff]/;
function enScore(x, toks, sentence) {
  let s = 0, hit = 0;
  for (const t of toks) {
    let v = 0;
    if (stem(x.en) === t) v = sentence ? 6 : 10;
    else if (x.enSet.has(t)) v = 7;
    else if (x.defSet.has(t)) v = 3;
    if (v) { s += v; hit++; }
  }
  return hit > 1 ? s * (1 + 0.6 * (hit - 1)) : s;
}
const HIRA = /^[\u3040-\u309fー〜]+$/;
function glossHit(nq, g) {
  if (!g) return 0;
  if (nq === g) return 20;
  if (HIRA.test(g) && g.length < 3) return 0;  // 短いかなは文の中で偶然一致しやすい(「あかいくだもの」の「いく」)
  if (g.length >= 2 && nq.includes(g)) return 10 + g.length;
  if (/する$/.test(g) && g.length >= 4 && nq.includes(g.slice(0, -2))) return 9;  // 「料理する」→「料理をする」
  if (g.length === 1 && KANJI.test(g) && nq.includes(g)) return 8;
  // 活用ゆれ: 「飛ぶ」→「飛」、「赤い」→「赤」(漢字で始まる語だけ)
  if (g.length >= 2 && KANJI.test(g[0]) && /[るうくすつぬむぶぐいだ]$/.test(g) && nq.includes(g.slice(0, -1))) return 7;
  return 0;
}
// カテゴリー名を文の中から拾うための語。「きほんのことば」は代名詞などで誤爆しやすいので除く
const CAT_ALIAS = {people: ['人'], jobs: ['人', '仕事', '職業'], animals: ['生き物'], food: ['食べ物']};
const SUBWORDS = [...SUB.entries()].filter(([, s]) => s.cat.id !== 'basics').map(([k, s]) =>
  [k, [...new Set([...s.ja.split(/[・の]/), ...(CAT_ALIAS[s.cat.id] || [])].map(norm))].filter(p => p.length >= 2 || KANJI.test(p))]);
function searchText(q) {
  q = q.trim(); if (!q) return [];
  const out = [];
  if (isJa(q)) {
    const nq = norm(q).replace(/\s/g, '');
    const direct = new Map();
    for (const x of IDX) { const v = Math.max(0, ...x.jaList.map(g => glossHit(nq, g))); if (v) direct.set(x, v); }
    const subHit = new Map(SUBWORDS.map(([k, ps]) => [k, ps.filter(p => nq.includes(p)).length]).filter(([, n]) => n));
    const bridge = [...new Set([...direct.keys()].map(x => stem(x.en)))];
    const qb = bigrams(nq);
    for (const x of IDX) {
      let s = direct.get(x) || 0;
      s += 6 * Math.max(0, ...x.w.c.map(k => subHit.get(k) || 0));
      if (bridge.length) s += 0.8 * enScore(x, bridge.filter(t => t !== stem(x.en)), false);
      if (x.w.scene) { let hit = 0; for (const b of qb) if (x.jaText.includes(b)) hit++; s += 4 * hit / Math.max(1, qb.size); }
      if (s >= 3) out.push([s - Math.min(2, x.w.r / 5000), x.w]);
    }
  } else {
    const toks = enTokens(q), sentence = toks.length >= 2;
    for (const x of IDX) {
      const s = enScore(x, toks, sentence);
      if (s >= 3) out.push([s - Math.min(2, x.w.r / 5000), x.w]);
    }
  }
  return out.sort((a, b) => b[0] - a[0]).map(a => a[1]).slice(0, 240);
}

/* 検索欄 */
let mode = 'word';
const PH = {word: '英単語か日本語で: cat、ねこ、走る…', text: '文章で: 空を飛ぶ鳥、a person who cooks…'};
const form = $('#barSearch'), input = $('#barInput'), box = $('#barSuggest');
function setMode(m) {
  mode = m;
  form.querySelectorAll('.mode button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.mode === m)));
  input.placeholder = PH[m]; box.classList.remove('open');
}
form.querySelector('.mode').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { setMode(b.dataset.mode); input.focus(); } });
let items = [], active = -1;
function paint() {
  if (mode !== 'word' || !input.value.trim()) { box.classList.remove('open'); items = []; return; }
  const all = searchWord(input.value); items = all.slice(0, 6);
  if (!items.length) { box.classList.remove('open'); return; }
  box.innerHTML = items.map((w, i) => `<a href="${href(w)}" class="${i === active ? 'active' : ''}"><img src="${thumb(w)}" alt=""><span class="s-w">${esc(w.w)}</span><span class="s-j">${esc(firstJa(w))}</span></a>`).join('')
    + (all.length > items.length ? `<a class="s-all" href="#/s/${encodeURIComponent(input.value.trim())}">「${esc(input.value.trim())}」の結果を ${num(all.length)} 件すべて見る</a>` : '');
  box.classList.add('open');
}
input.addEventListener('input', () => { active = -1; paint(); });
input.addEventListener('keydown', e => {
  if (!items.length) return;
  if (e.key === 'ArrowDown') { active = Math.min(items.length - 1, active + 1); paint(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { active = Math.max(-1, active - 1); paint(); e.preventDefault(); }
  else if (e.key === 'Escape') box.classList.remove('open');
});
input.addEventListener('blur', () => setTimeout(() => box.classList.remove('open'), 150));
form.addEventListener('submit', e => {
  e.preventDefault();
  const q = input.value.trim();
  if (active >= 0 && items[active]) location.hash = href(items[active]);
  else if (q) location.hash = `#/${mode === 'word' ? 's' : 't'}/${encodeURIComponent(q)}`;
  box.classList.remove('open'); input.blur();
});
setMode('word');

/* ───────── サイドバー ───────── */
function side(curCat, curSub) {
  $('#side').innerHTML = `<h2>カテゴリー</h2>` + D.categories.map(c => {
    const icon = c.icon && byId.get(c.icon);
    return `<details${c.id === curCat ? ' open' : ''}><summary class="${c.id === curCat && !curSub ? 'on' : ''}" data-href="#/c/${c.id}">
      ${icon ? `<img src="${thumb(icon)}" alt="">` : ''}<span>${esc(c.ja)}</span><span class="chev">${chev}</span></summary>
      <ul><li><a href="#/c/${c.id}" class="${c.id === curCat && !curSub ? 'on' : ''}">すべて<small>${num(inCat(c.id).length)}</small></a></li>
      ${c.subs.filter(s => s.n).map(s => `<li><a href="#/c/${c.id}/${s.id}" class="${c.id === curCat && s.id === curSub ? 'on' : ''}">${esc(s.ja)}<small>${s.n}</small></a></li>`).join('')}</ul></details>`;
  }).join('');
}
$('#side').addEventListener('click', e => {
  const s = e.target.closest('summary');
  if (s && !e.target.closest('.chev')) { e.preventDefault(); location.hash = s.dataset.href; }
  if (e.target.closest('a')) document.body.classList.remove('menu-open');
});
$('#menuBtn').onclick = () => { const on = document.body.classList.toggle('menu-open'); $('#menuBtn').setAttribute('aria-expanded', String(on)); };
document.addEventListener('click', e => { if (document.body.classList.contains('menu-open') && !e.target.closest('#side,#menuBtn')) document.body.classList.remove('menu-open'); });

/* ───────── ページ ───────── */
function home() {
  side();
  const tries = [['s', 'cat'], ['s', 'ねこ'], ['s', '走る'], ['t', '空を飛ぶ'], ['t', '料理をする人'], ['t', 'something you wear on your head']];
  view.innerHTML = `<div class="page fade">
    <section class="welcome"><h1>英単語を、イラストでさがす。</h1>
      <p><b>${num(D.total_art)}</b> 語ぶんの絵があります。試作版では ${num(W.length)} 語をカテゴリーに分けています。</p></section>
    <div class="tryline">たとえば ${tries.map(([m, q]) => `<a class="${m === 't' ? 'text' : ''}" href="#/${m}/${encodeURIComponent(q)}" title="${m === 't' ? '文章でさがす' : '単語でさがす'}">${esc(q)}</a>`).join('')}</div>
    <h2 class="h2">カテゴリーからさがす<small>Categories</small></h2>
    <div class="cats">${D.categories.map(c => {
      const icon = c.icon && byId.get(c.icon);
      return `<article class="cat"><a class="ic" href="#/c/${c.id}" tabindex="-1">${icon ? `<img src="${thumb(icon)}" alt="" loading="lazy">` : ''}</a>
        <h3><a href="#/c/${c.id}">${esc(c.ja)}</a><small>${esc(c.en)}</small></h3>
        <ul>${c.subs.filter(s => s.n).map(s => `<li><a href="#/c/${c.id}/${s.id}">${esc(s.ja)}</a></li>`).join('')}</ul></article>`;
    }).join('')}</div>
    <h2 class="h2">ピックアップ<small>Pick up</small><a href="#/" id="reshuffle">ほかの絵</a></h2>
    <div id="pick">${grid(shuffle(W).slice(0, 18))}</div>
  </div>`;
  $('#reshuffle').onclick = e => { e.preventDefault(); $('#pick').innerHTML = grid(shuffle(W).slice(0, 18)); };
  document.title = 'えいごのえ — 英単語のイラスト辞典';
}

function catPage(cid, sid) {
  const c = CAT.get(cid); if (!c) return notFound();
  const s = sid ? c.subs.find(x => x.id === sid) : null;
  if (sid && !s) return notFound();
  side(cid, sid);
  const subs = c.subs.filter(x => x.n);
  view.innerHTML = `<div class="page fade">
    <nav class="crumbs"><a href="#/">トップ</a>${chev}${s ? `<a href="#/c/${cid}">${esc(c.ja)}</a>${chev}<span>${esc(s.ja)}</span>` : `<span>${esc(c.ja)}</span>`}</nav>
    <h1 class="h1">${esc(s ? s.ja : c.ja)}のイラスト<small>${esc(s ? s.en : c.en)}</small></h1>
    <p class="lead">${num(s ? s.n : inCat(cid).length)} 枚</p>
    <nav class="subnav"><a href="#/c/${cid}" class="${s ? '' : 'on'}">すべて</a>${subs.map(x => `<a href="#/c/${cid}/${x.id}" class="${s && x.id === s.id ? 'on' : ''}">${esc(x.ja)}<small>${x.n}</small></a>`).join('')}</nav>
    ${s ? `<div style="margin-top:18px">${grid(inSub.get(`${cid}/${sid}`) || [])}</div>`
        : subs.map(x => `<h2 class="h2">${esc(x.ja)}<small>${esc(x.en)}</small><a href="#/c/${cid}/${x.id}">${x.n} 枚すべて</a></h2>${grid((inSub.get(`${cid}/${x.id}`) || []).slice(0, 12))}`).join('')}
  </div>`;
  document.title = `${s ? s.ja : c.ja}のイラスト — えいごのえ`;
}

function wordPage(id) {
  const w = byId.get(id); if (!w) return notFound();
  const k = w.c[0], sub = SUB.get(k);
  side(sub?.cat.id, sub?.id);
  const jaAll = String(w.ja || '').split('、');
  const seen = new Set([w.id]);
  const related = w.c.flatMap(x => inSub.get(x) || []).filter(x => !seen.has(x.id) && seen.add(x.id));
  view.innerHTML = `<div class="page fade">
    <nav class="crumbs"><a href="#/">トップ</a>${sub ? `${chev}<a href="#/c/${sub.cat.id}">${esc(sub.cat.ja)}</a>${chev}<a href="#/c/${k}">${esc(sub.ja)}</a>` : ''}${chev}<span>${esc(w.w)}</span></nav>
    <article class="word">
      <div class="plate"><img src="${full(w)}" alt="${esc(w.w)}(${esc(firstJa(w))})のイラスト" width="1024" height="1024"></div>
      <div>
        ${posLabel(w) ? `<span class="pos">${esc(posLabel(w))}</span>` : ''}
        <h1 class="word-title" lang="en">${esc(w.w)}</h1>
        <p class="word-ja">${esc(jaAll[0])}${jaAll.length > 1 ? `<small>${esc(jaAll.slice(1).join('、'))}</small>` : ''}</p>
        <div class="acts">
          <button class="btn primary" id="speak" type="button"><svg><use href="#i-sound"/></svg>発音をきく</button>
          <a class="btn" href="${full(w)}" download="${esc(w.id)}.png"><svg><use href="#i-down"/></svg>PNG</a>
          <a class="btn" href="games/picture-words.html"><svg><use href="#i-puzzle"/></svg>パズル</a>
          <button class="btn" id="copy" type="button"><svg><use href="#i-link"/></svg>リンク</button>
        </div>
        ${w.scene ? `<div class="box"><h3>このイラスト</h3><p class="en" lang="en">${esc(w.scene.en)}</p><p>${esc(w.scene.ja)}</p></div>` : ''}
        <div class="box"><h3>カテゴリー</h3><div class="tags">${w.c.map(x => SUB.get(x)).filter(Boolean).map(s => `<a href="#/c/${s.cat.id}/${s.id}">${esc(s.cat.ja)} › ${esc(s.ja)}</a>`).join('')}</div></div>
      </div>
    </article>
    ${related.length ? `<h2 class="h2">関連するイラスト<small>Related</small>${sub ? `<a href="#/c/${k}">${esc(sub.ja)}をすべて見る</a>` : ''}</h2>${grid(related.slice(0, 18))}` : ''}
  </div>`;
  $('#speak').onclick = () => speak(w.w);
  $('#copy').onclick = () => navigator.clipboard?.writeText(location.href).then(() => toast('リンクをコピーしました'), () => toast(location.href));
  document.title = `${w.w}(${firstJa(w)})のイラスト — えいごのえ`;
}

function resultPage(m, q) {
  side();
  setMode(m === 't' ? 'text' : 'word'); input.value = q;
  const list = m === 't' ? searchText(q) : searchWord(q);
  const other = m === 't' ? 's' : 't';
  view.innerHTML = `<div class="page fade">
    <nav class="crumbs"><a href="#/">トップ</a>${chev}<span>${m === 't' ? '文章でさがす' : '単語でさがす'}</span></nav>
    <h1 class="h1">「${esc(q)}」のイラスト</h1>
    <p class="hint">${list.length ? `${num(list.length)} 枚${m === 't' ? '(近い順)' : ''}` : ''}
      <a href="#/${other}/${encodeURIComponent(q)}">${m === 't' ? '単語でさがす' : '文章でさがす(あいまい検索)'}でためす</a></p>
    ${list.length ? grid(list) : `<div class="empty"><b>見つかりませんでした</b>${m === 't' ? '短いことばに分けるか、英語の文でもためしてみてください。' : 'つづりを変えるか、「文章でさがす」をためしてみてください。'}<br>試作版は ${num(W.length)} 語だけを収録しています。</div>`}
  </div>`;
  document.title = `「${q}」のイラスト — えいごのえ`;
}
function notFound() { side(); view.innerHTML = `<div class="page empty"><b>ページが見つかりませんでした</b><a href="#/">トップへ</a></div>`; }

/* ───────── 共通 ───────── */
let voice = null;
const pickVoice = () => { const vs = speechSynthesis.getVoices(); voice = vs.find(v => /en-US/i.test(v.lang) && /Samantha|Google|Jenny|Aria/i.test(v.name)) || vs.find(v => /^en/i.test(v.lang)) || null; };
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(t) {
  if (!('speechSynthesis' in window)) return toast('この端末では発音を再生できません');
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9; if (voice) u.voice = voice; speechSynthesis.speak(u);
}
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800); }
addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } });

function route() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const [kind, a, b] = h.split('/');
  document.body.classList.remove('menu-open');
  if (!kind) home();
  else if (kind === 'c') catPage(a, b);
  else if (kind === 'w') wordPage(h.slice(2));
  else if (kind === 's' || kind === 't') resultPage(kind, h.slice(2));
  else notFound();
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
})();
