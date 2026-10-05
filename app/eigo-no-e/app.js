/* Pictpedia — 英単語のイラスト辞典
   build.py の審査済み出力を、公開中の辞書・場面文・画像対応表で再照合する。 */
(async () => {
'use strict';
const generated = window.EIGO_NO_E;
let D;
function semanticFallback(data){
  const protectedKeys=new Set((generated.semanticClassifications?.entries||[]).map(e=>JSON.stringify([e.w,e.p,e.art])));
  const words=data.words.map(row=>{
    if(!protectedKeys.has(JSON.stringify([row.w,row.p,row.art])))return row;
    const next={...row,c:['more/words'],semanticUnavailable:true};
    for(const k of ['semanticTags','semanticDistinction','semanticCanonical','baseCategories'])delete next[k];
    return next;
  });
  const categories=data.categories.map(c=>{
    const subs=c.subs.map(s=>({...s,n:words.filter(w=>w.c.includes(c.id+'/'+s.id)).length})).filter(s=>s.n);
    const members=words.filter(w=>w.c.some(k=>k.startsWith(c.id+'/')));
    return {...c,subs,icon:members.some(w=>w.id===c.icon)?c.icon:members[0]?.id};
  }).filter(c=>c.subs.length);
  return {...data,words,categories};
}

const localSnapshot=location.protocol==='file:';
const $ = (s, p = document) => p.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const view = $('#view');
// A developer-only CSS viewport preview; normal navigation is unchanged.
const preview = new URL(location.href);
if (preview.searchParams.get('preview') === 'mobile' && window.self === window.top) {
  preview.searchParams.delete('preview');
  document.body.replaceChildren();
  document.body.style.cssText='margin:0;padding:22px 10px;background:#ebe7df;display:flex;flex-direction:column;align-items:center;gap:10px;min-width:410px';
  const label=document.createElement('p');label.textContent='Responsive preview · 390 × 844 CSS pixels';label.style.cssText='font:12px sans-serif;margin:0;color:#6a5f56';
  const frame=document.createElement('iframe');frame.title='Mobile layout preview';frame.src=preview.href;frame.style.cssText='width:390px;height:844px;border:0;background:#fffdf8;box-shadow:0 8px 40px #2a231e22';
  document.body.append(label,frame);return;
}
view.innerHTML='<div class="page empty" role="status">イラストを読み込んでいます…</div>';
try {
  if (!generated || !window.EigoCatalogValidation || !window.IllustrationScenes) throw Error('Catalog scripts unavailable');
  if(localSnapshot){
    D=window.EigoCatalogValidation.buildSnapshotCatalog(generated);
    try{D=await window.SemanticClassifications.applyToCatalog(D,generated.semanticClassifications,window.SemanticClassifications.canonicalWords(generated));}
    catch(error){console.warn('Semantic classification unavailable:',error);D=semanticFallback(D);}
  } else {
  const [scenes, manifest, indexText] = await Promise.all([
    window.IllustrationScenes.load('data/generated-etymon/illustration-scenes.json'),
    fetch('data/generated-etymon/manifest.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json();}),
    fetch('../assets/word/illustration-index.js',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Artwork index unavailable');return r.text();})
  ]);
  // The exported manifest identifies the exact canonical words used by build.py.
  // Avoid downloading the full ~20MB dictionary when that snapshot is unchanged.
  const sameWords=manifest.files?.words?.sha256===generated.sources?.words_sha256;
  const words=sameWords ? generated.words.map(w=>({...w,...(w.semanticCanonical||{}),ja_readings:w.k?[{gloss:w.ja,kana:w.k}]:[]}))
    : await fetch('data/generated-etymon/words.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Words unavailable');return r.json();});
  const index=JSON.parse(indexText.slice(indexText.indexOf('{'),indexText.lastIndexOf('}')+1));
  D=window.EigoCatalogValidation.buildCurrentCatalog(generated,scenes,words,index);
  try{
    const semantics=await window.SemanticClassifications.load('data/generated-etymon/semantic-classifications.json',manifest.files?.semantic_classifications?.sha256);
    D=await window.SemanticClassifications.applyToCatalog(D,semantics,words);
  }catch(error){console.warn('Semantic classification unavailable:',error);D=semanticFallback(D);}
  }
  if(!D.words.length){view.innerHTML='<div class="page empty">登録画像がありません</div>';return;}
} catch(error) {
  console.error('Eigo-no-e catalog:',error);
  view.innerHTML='<div class="page empty"><b>イラストを読み込めませんでした</b>接続を確認して、もう一度お試しください。<p><button class="btn" id="retry">もう一度読み込む</button></p></div>';
  $('#retry').onclick=()=>location.reload();return;
}

/* ───────── index ───────── */
const W = D.words;
const byId = new Map(W.map(w => [w.id, w]));
const CAT = new Map(), SUB = new Map(), inSub = new Map();
for (const c of D.categories) { CAT.set(c.id, c); for (const s of c.subs) SUB.set(`${c.id}/${s.id}`, {...s, cat: c}); }
for (const w of W) for (const k of w.c) (inSub.get(k) || inSub.set(k, []).get(k)).push(w);
const inCat = id => W.filter(w => !w.unavailable && w.c.some(k => k.startsWith(id + '/')));
const assetURL = path => String(path).split('/').map(encodeURIComponent).join('/');
const full = w => `../${assetURL(w.image.path)}?v=${w.image.sha256.slice(0,12)}`;
const thumb = w => `${assetURL(w.thumb.path)}?v=${w.thumb.sha256.slice(0,12)}`;
const href = w => `#/w/${encodeURIComponent(w.id)}`;
const firstJa = w => String(w.ja || '').split('、')[0];
const num = n => Number(n||0).toLocaleString('ja-JP');
const POS = {'名':'名詞','動':'動詞','形':'形容詞','副':'副詞','前':'前置詞','代':'代名詞','接':'接続詞','冠':'冠詞','間':'間投詞','助':'助動詞'};
const posLabel = w => (w.pos || '').split('/').map(p => POS[p.charAt(0)] || p).join('・');
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const titleOf = w => w.w || (w.bindingStatus==='alternate'?'別の画像・旧版':'画像の対応確認中');
const hasCaption = w => w.description ? w.description.status==='reviewed'&&!!w.description.en&&!!w.description.ja : w.status==='reviewed'&&!!w.scene?.en&&!!w.scene?.ja;
const tile = w => `<a class="tile" href="${href(w)}"><span class="pic"><img src="${esc(thumb(w))}" data-fallback="${esc(full(w))}" alt="${esc(w.w ? w.w+' のイラスト' : titleOf(w))}" loading="lazy" decoding="async" width="320" height="320"></span><span class="cap"><span class="w">${esc(titleOf(w))}</span>${w.ja?`<span class="j">${esc(firstJa(w))}</span>`:''}${w.w&&!hasCaption(w)?'<small class="caption-status">解説未作成</small>':''}</span></a>`;
const gridPages = new Map(); let gridSerial=0;
const grid = list => {
  list=list.filter(w=>!w.unavailable);const token=String(++gridSerial),shown=Math.min(60,list.length);
  gridPages.set(token,{list,shown});
  return `<div class="paged-grid" data-grid="${token}"><div class="grid">${list.slice(0,shown).map(tile).join('')}</div>${list.length>shown?`<button class="btn load-more" type="button" data-grid="${token}">もっと見る（残り ${num(list.length-shown)} 枚）</button>`:''}</div>`;
};
const chev = '<svg><use href="#i-chev"/></svg>';
const reasonLabel = reason => ({__proto__:null,image_composition_defect:'画像の構図を確認中',reading_candidate:'日本語の読みを確認中',reading_needs_review:'日本語の読みを確認中',reading_unreviewed:'日本語の読みを確認中',missing_answer:'答えを確認中',unsupported_format:'この表記はパズル未対応',image_first_sense_mismatch:'画像と語義を確認中',known_image_mismatch:'画像と語義を確認中',ownership_pending:'画像の対応確認中',alternate:'別の画像・旧版',owned_alternate_or_superseded:'別の画像・旧版',stale_first_sense:'語義を確認中',stale_art_mapping:'画像の対応確認中',missing_identity:'画像の対応確認中'}[reason] || 'この問題は現在利用できません');
function puzzleActions(w, imageReady){
  const reasons=[];
  const actions=['en','ja'].map(lang=>{
    const a=w.availability?.[lang],label=lang==='en'?'英語パズル':'日本語パズル';
    if(a?.playable&&a.answer&&imageReady)return `<a class="btn word-puzzle" href="games/picture-words.html?word=${encodeURIComponent(w.id)}&amp;lang=${lang}" target="_blank" rel="noopener">${label} ↗</a>`;
    if(!a?.playable)reasons.push(reasonLabel(a?.reason));
    return `<button class="btn" type="button" disabled>${label}</button>`;
  }).join('');
  return actions+`<small class="play-status">${!imageReady?'画像を確認中':[...new Set(reasons)].join('・')}</small>`;
}
const imageChecks=new Map();
async function verifyImage(w){
  if(localSnapshot)return true;
  const key=w.image.path+':'+w.image.sha256;if(imageChecks.has(key))return imageChecks.get(key);
  const check=(async()=>{try{const r=await fetch(full(w),{cache:'no-cache'});if(!r.ok||!globalThis.crypto?.subtle)return false;const hash=await crypto.subtle.digest('SHA-256',await r.arrayBuffer());return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('')===w.image.sha256;}catch{return false;}})();
  imageChecks.set(key,check);if(imageChecks.size>40)imageChecks.delete(imageChecks.keys().next().value);
  const ok=await check;if(!ok)imageChecks.delete(key);return ok;
}

/* ───────── 検索 ───────── */
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => kata2hira(String(s || '').normalize('NFKC').toLowerCase().trim());
const tagText = value => Array.isArray(value) ? value.flatMap(tagText) : value && typeof value === 'object' ? Object.values(value).flatMap(tagText) : typeof value === 'string' ? [value] : [];
const IDX = W.map(w => {
  const cats = (w.c||[]).map(k => SUB.get(k)).filter(Boolean);
  const jaList = [...String(w.ja || '').split('、'), ...String(w.k || '').split('、')].map(norm).filter(Boolean);
  return {
    w, en: norm(w.w), jaList,
    keywords: [w.w, w.ja, w.k, ...(w.w?[]:[w.art]), ...tagText(w.tags), ...tagText(w.semanticTags), ...cats.flatMap(s => [s.ja, s.en, s.cat.ja, s.cat.en]), ...(hasCaption(w)?[w.scene?.en,w.scene?.ja]:[])].map(norm).filter(Boolean),
  };
});

// 単語検索: 英単語のつづり、日本語の訳・読み。
function searchWord(q) {
  q = norm(q); if (!q) return [];
  const out = [];
  for (const x of IDX) { if(x.w.unavailable)continue;
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
// あいまい検索: 入力したキーワードの部分一致。文章解析・語幹化・意味の推測はしない。
// #/t の既存リンクを保つため、内部関数名は searchText のままにする。
function searchText(q) {
  q = norm(q); if (!q) return [];
  const out = [];
  for (const x of IDX) { if(x.w.unavailable)continue;
    if (!x.keywords.some(text => text.includes(q))) continue;
    const score = x.en === q ? 100 : x.jaList.includes(q) ? 95 : x.en.startsWith(q) ? 80 : x.keywords.some(text => text === q) ? 60 : 40;
    out.push([score - Math.min(5, x.w.r / 3000), x.w]);
  }
  return out.sort((a, b) => b[0] - a[0]).map(a => a[1]);
}

/* 検索欄 */
let mode = 'word';
const PH = {word: '単語を検索', text: 'タグ・解説も検索'};
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
  const tries = [['s', 'book'], ['s', '本'], ['s', 'help'], ['t', '学校'], ['t', '木'], ['t', 'box']];
  view.innerHTML = `<div class="page fade">
    <section class="pict-hero"><h1 class="hero-title">Pictpedia</h1><img class="hero-art" src="../assets/pictpedia/hero-carnival.png?v=e139fd54677d" width="1536" height="1024" alt="Pictpedia：空飛ぶ鉛筆とドラゴンに乗る二人と、にぎやかなことばの世界" fetchpriority="high"></section>
    <div class="tryline">たとえば ${tries.map(([m, q]) => `<a class="${m === 't' ? 'text' : ''}" href="#/${m}/${encodeURIComponent(q)}" title="${m === 't' ? 'あいまい検索' : '単語検索'}">${esc(q)}</a>`).join('')}</div>
    <h2 class="h2" id="categories">カテゴリーからさがす<a href="#/all">${num(D.word_entry_count)}語・${num(D.total_art)}枚</a></h2>
    <div class="cats">${D.categories.map(c => {
      const icon = c.icon && byId.get(c.icon);
      return `<article class="cat"><a class="ic" href="#/c/${c.id}" tabindex="-1">${icon ? `<img src="${thumb(icon)}" alt="" loading="lazy">` : ''}</a>
        <h3><a class="cat-main" href="#/c/${c.id}">${esc(c.ja)}</a><small>${esc(c.en)}</small></h3></article>`;
    }).join('')}</div>
    <h2 class="h2">ピックアップ<small>Pick up</small><a href="#/" id="reshuffle">ほかの絵</a></h2>
    <div id="pick">${grid(shuffle(W).slice(0, 18))}</div>
  </div>`;
  $('#reshuffle').onclick = e => { e.preventDefault(); $('#pick').innerHTML = grid(shuffle(W).slice(0, 18)); };
  document.title = 'Pictpedia — 英単語のイラスト辞典';
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
  document.title = `${s ? s.ja : c.ja}のイラスト — Pictpedia`;
}

function wordPage(id) {
  const w = byId.get(id); if (!w) return notFound();
  const k = w.c[0], sub = SUB.get(k);
  side(sub?.cat.id, sub?.id);
  const seen = new Set([w.id]);
  const related = w.c.flatMap(x => inSub.get(x) || []).filter(x => !seen.has(x.id) && seen.add(x.id));
  view.innerHTML = `<div class="page fade">
    <nav class="crumbs"><a href="#/">トップ</a>${sub ? `${chev}<a href="#/c/${sub.cat.id}">${esc(sub.cat.ja)}</a>${chev}<a href="#/c/${k}">${esc(sub.ja)}</a>` : ''}${chev}<span>${esc(titleOf(w))}</span></nav>
    <article class="word">
      <div class="plate"><img src="${esc(full(w))}" alt="${esc(titleOf(w))}" width="1024" height="1024"></div>
      <div>
        ${posLabel(w) ? `<span class="pos">${esc(posLabel(w))}</span>` : ''}
        <h1 class="word-title${w.w?'':' pending-title'}"${w.w?' lang="en"':''}>${esc(titleOf(w))}</h1>
        ${w.ja?`<p class="word-ja">${esc(firstJa(w))}</p>`:`<p class="asset-name">画像ファイル：${esc(w.art)}.png</p>`}
        ${w.semanticUnavailable?'<p class="word-semantic">意味の分類を確認できません</p>':w.semanticDistinction?`<p class="word-semantic">${esc(w.semanticDistinction.ja)}</p>`:''}
        ${w.semanticTags?`<p class="semantic-tags">${w.semanticTags.map(esc).join(' · ')}</p>`:''}
        <div class="acts">
          ${w.w?'<button class="btn primary" id="speak" type="button"><svg><use href="#i-sound"/></svg>発音をきく</button>':''}
          <a class="btn" href="${esc(full(w))}" download="${esc(w.art)}.png"><svg><use href="#i-down"/></svg>PNG</a>
          <button class="btn" id="copy" type="button"><svg><use href="#i-link"/></svg>リンク</button>
        </div>
        <div class="puzzle-actions" id="puzzleActions">${puzzleActions(w,false)}</div>
        <div class="box" id="sceneBox" aria-live="polite">${hasCaption(w)?'<p>解説を確認しています…</p>':'<p class="caption-status">解説未作成</p>'}</div>
        <div class="box"><h3>カテゴリー</h3><div class="tags">${w.c.map(x => SUB.get(x)).filter(Boolean).map(s => `<a href="#/c/${s.cat.id}/${s.id}">${esc(s.cat.ja)} › ${esc(s.ja)}</a>`).join('')}</div></div>
      </div>
    </article>
    ${related.length ? `<h2 class="h2">関連するイラスト${sub ? `<a href="#/c/${k}">${esc(sub.ja)}をすべて見る</a>` : ''}</h2>${grid(related.slice(0, 18))}` : ''}
  </div>`;
  const sceneBox=$('#sceneBox'),actions=$('#puzzleActions');
  verifyImage(w).then(ok=>{
    if(!sceneBox.isConnected)return;
    if(ok){
      actions.innerHTML=puzzleActions(w,true);
      sceneBox.innerHTML=hasCaption(w)?`<p class="en" lang="en">${esc(w.scene.en)}</p><p lang="ja">${esc(w.scene.ja)}</p>`:'<p class="caption-status">解説未作成</p>';
    }else{
      actions.innerHTML='<small class="play-status">画像を確認できないため、パズルを開けません</small><button class="btn" type="button" id="retryImage">再確認</button>';
      sceneBox.innerHTML='<p class="caption-status">解説未作成</p><small>画像の更新を確認中</small>';
      $('#retryImage').onclick=()=>wordPage(id);
    }
  });
  if($('#speak'))$('#speak').onclick = () => speak(w.w);
  $('#copy').onclick = () => {
    if(!navigator.clipboard?.writeText)return toast(location.href);
    navigator.clipboard.writeText(location.href).then(()=>toast('リンクをコピーしました'),()=>toast(location.href));
  };
  document.title = `${titleOf(w)}${w.ja?'('+firstJa(w)+')':''} — Pictpedia`;
}

function allPage(){
  side();
  view.innerHTML=`<div class="page fade"><nav class="crumbs"><a href="#/">トップ</a>${chev}<span>すべての画像</span></nav><h1 class="h1">すべての画像</h1><p class="lead">${num(D.word_entry_count)} 語・${num(D.total_art)} 枚</p>${grid(W)}</div>`;
  document.title='すべての画像 — Pictpedia';
}

function resultPage(m, q) {
  side();
  setMode(m === 't' ? 'text' : 'word'); input.value = q;
  const list = m === 't' ? searchText(q) : searchWord(q);
  const other = m === 't' ? 's' : 't';
  view.innerHTML = `<div class="page fade">
    <nav class="crumbs"><a href="#/">トップ</a>${chev}<span>${m === 't' ? 'あいまい検索' : '単語検索'}</span></nav>
    <h1 class="h1">「${esc(q)}」のイラスト</h1>
    <p class="hint">${list.length ? `${num(list.length)} 枚${m === 't' ? '(部分一致)' : ''}` : ''}
      <a href="#/${other}/${encodeURIComponent(q)}">${m === 't' ? '単語検索' : 'あいまい検索'}でためす</a></p>
    ${list.length ? grid(list) : `<div class="empty"><b>見つかりませんでした</b>${m === 't' ? 'キーワードを変えてお試しください。' : 'つづりを変えるか、「あいまい検索」をためしてみてください。'}<br>${num(D.total_art)} 枚を収録しています。</div>`}
  </div>`;
  document.title = `「${q}」のイラスト — Pictpedia`;
}
function notFound() { side(); view.innerHTML = `<div class="page empty"><b>ページが見つかりませんでした</b><a href="#/">トップへ</a></div>`; }

/* ───────── 共通 ───────── */
let voice = null;
const pickVoice = () => { const vs = speechSynthesis.getVoices(); voice = vs.find(v => /en-US/i.test(v.lang) && /Samantha|Google|Jenny|Aria/i.test(v.name)) || vs.find(v => /^en/i.test(v.lang)) || null; };
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function speak(t) {
  if (!String(t||'').trim()) return;
  if (!('speechSynthesis' in window)) return toast('この端末では発音を再生できません');
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = .9; if (voice) u.voice = voice; speechSynthesis.speak(u);
}
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1800); }
addEventListener('keydown', e => { if (e.key === '/' && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } });

function route() {
  gridPages.clear();
  let h;try{h=decodeURIComponent(location.hash.replace(/^#\/?/, ''));}catch{return notFound();}
  const [kind, a, b] = h.split('/');
  document.body.classList.remove('menu-open');$('#menuBtn').setAttribute('aria-expanded','false');
  document.body.classList.toggle('home-mode', !kind);
  if (!kind) home();
  else if (kind === 'all') allPage();
  else if (kind === 'c') catPage(a, b);
  else if (kind === 'w') wordPage(h.slice(2));
  else if (kind === 'p') location.replace('games/picture-words.html?word='+encodeURIComponent(h.slice(2)));
  else if (kind === 's' || kind === 't') resultPage(kind, h.slice(2));
  else notFound();
  scrollTo(0, 0);
}
view.addEventListener('click',e=>{
  const more=e.target.closest('.load-more');
  if(more){const entry=gridPages.get(more.dataset.grid);if(!entry)return;const end=Math.min(entry.shown+60,entry.list.length);more.previousElementSibling.insertAdjacentHTML('beforeend',entry.list.slice(entry.shown,end).map(tile).join(''));entry.shown=end;if(end===entry.list.length)more.remove();else more.textContent=`もっと見る（残り ${num(entry.list.length-end)} 枚）`;return;}
  const link=e.target.closest('a.word-puzzle');if(link&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();window.open(link.href,'_blank','popup,width=620,height=820,noopener');}
});
view.addEventListener('error',e=>{const img=e.target;if(img.tagName!=='IMG')return;if(img.dataset.fallback&&img.getAttribute('src')!==img.dataset.fallback){img.src=img.dataset.fallback;delete img.dataset.fallback;}else{img.classList.add('image-failed');img.alt='画像を読み込めません';}},true);
document.querySelectorAll('#barSearch input,#barSearch button,#menuBtn').forEach(control=>{control.disabled=false;});
addEventListener('hashchange', route);
route();
})();

