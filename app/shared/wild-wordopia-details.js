/* Exact sense-bound detail data from authorized published dictionaries. */
(()=>{'use strict';
const loads=new Map();
function load(src){if(!loads.has(src))loads.set(src,new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('詳細データを読み込めませんでした。'));document.head.append(s);}));return loads.get(src);}
let ready,dictionary;
function loadDictionary(){return dictionary||(dictionary=(async()=>{await load('data/wild-wordopia-word-details.js');const e=WILDWORDOPIA_WORD_DETAILS_GZIP,bytes=Uint8Array.from(atob(e.data),c=>c.charCodeAt(0));const raw=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',raw))].map(v=>v.toString(16).padStart(2,'0')).join('');if(hash!==e.sha256)throw Error('一族辞書のチェックサムが一致しません。');return window.WILDWORDOPIA_WORD_DETAILS=JSON.parse(new TextDecoder().decode(raw));})());}
async function services(){return ready||(ready=(async()=>{
 await loadDictionary();
 await Promise.all([load('shared/custom-learning-levels.js'),load('data/generated-etymon/custom-learning-levels.js')]);
 const learning=await EtymonCustomLearningLevels.decode(ETYMON_CUSTOM_LEARNING_LEVELS);
 return {learning};
})());}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const familyStyle=document.createElement('style');familyStyle.textContent='.wordLanguageFamilies{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:8px 0}.wordLanguageTag{display:inline-block;padding:3px 9px;border-radius:999px;background:#edf2f8;border:1px solid #bfcee1;color:#284866;font-size:12px;font-weight:700}';document.head.append(familyStyle);
window.WildWordDetails={loadDictionary,async loadLearning(){return (await services()).learning;},async render(target,entry,rootDictionary){
 target.textContent='詳細を読み込んでいます…';
 try{const svc=await services();if(!target.isConnected)return;
 const row=Number.isInteger(entry.dictionaryIndex)?WILDWORDOPIA_WORD_DETAILS.rows[entry.dictionaryIndex]:WILDWORDOPIA_WORD_DETAILS.rows.find(x=>x.w===entry.w&&JSON.stringify(x.p)===JSON.stringify(entry.p)&&x.ja===entry.ja&&x.en===entry.en);
 if(!row||row.w!==entry.w||JSON.stringify(row.p)!==JSON.stringify(entry.p)||row.ja!==entry.ja||row.en!==entry.en){target.textContent='この語義の詳細は照合できていません。';return;}
 const level=svc.learning.lookup(row),regions={G:'ゲルマン',L:'ロマンス',Gr:'ギリシャ',S:'サンスクリット',Sa:'サンスクリット',Ce:'ケルト',Sl:'スラヴ',Ir:'ペルシャ'};
 target.innerHTML=`<div class="wordDetailHead"><h4>${esc(row.syllables||row.w)}</h4><button type="button" class="wordSpeak" aria-label="${esc(row.w)}の発音を再生">🔊 発音</button></div>
 ${row.phonetic?`<p lang="en" class="wordPhonetic">${esc(row.phonetic)}</p>`:''}${row.k||row.kana?`<p>読み：${esc(row.k||row.kana)}</p>`:''}
 <p>${row.pos?`<b class="wordPos">${esc(row.pos)}</b> `:''}${esc(row.ja)}</p>${row.en?`<p lang="en">${esc(row.en)}</p>`:''}
 <div class="wordDetailBadges">${EtymonRarity.html(EtymonRarity.learning(level?.level,'detail'))}</div>
 ${(row.gs||[row.g]).filter(Boolean).length?`<div class="wordLanguageFamilies" aria-label="語源の言語系統"><b>語派：</b>${[...new Set((row.gs||[row.g]).filter(Boolean))].map(x=>`<span class="wordLanguageTag" title="語源構成：${esc(regions[x]||x)}">${esc(regions[x]||x)}</span>`).join('')}</div>`:''}
 ${row.pre||row.suf?`<p>接頭辞：${esc(row.pre||'—')} ／ 接尾辞：${esc(row.suf||'—')}</p>`:''}
 ${row.b?`<section><h5>語源メモ</h5><p>${esc(row.b)}</p></section>`:''}
 <section><h5>つながる語根（PIE）</h5>${row.p.map(k=>{const r=WILDWORDOPIA_WORD_DETAILS.roots[k]||rootDictionary[k],note=r?.d||r?.def;return `<div><a href="vocabulary-master.html#root:${encodeURIComponent(k)}" target="_blank" rel="noopener">*${esc(r?.pie||k)} ${esc(r?.ja||'')} ${esc(r?.en||'')}</a>${note?`<details><summary>語根の説明を読む</summary><p>${esc(note)}</p>${r.aff?.length?`<p>関連する接辞：${r.aff.map(esc).join('・')}</p>`:''}</details>`:''}</div>`;}).join('')}</section>
 <p><a href="pictlingo-dictionary.html#/w/dictionary:${row.dictionaryIndex}" target="_blank" rel="noopener">この語義をPictlingo Dictionaryで開く ↗</a></p>`;
 target.querySelector('.wordSpeak').onclick=()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(row.w);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u);};
 target.dataset.word= row.w;target.dataset.dictionaryIndex=row.dictionaryIndex;
 }catch(e){target.textContent=e.message;}
}};
})();
