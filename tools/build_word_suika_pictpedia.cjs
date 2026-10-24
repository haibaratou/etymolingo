#!/usr/bin/env node
// ワードスイカ（英語版・日本語版）の語彙を、Pictpedia の最新スナップショット（app/eigo-no-e/data.js）から書き出す。
// 使い方: node tools/build_word_suika_pictpedia.cjs
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'app/data/generated-etymon');
global.window={};require(path.join(ROOT,'app/eigo-no-e/data.js'));
const E=window.EIGO_NO_E;
const pic=w=>((w.image&&w.image.path)||'').replace(/^assets\/word\//,'').replace(/\.png$/,'');
const better=(a,b)=>((b.pic?1:0)-(a.pic?1:0))||(a.r-b.r)||((b.reviewed?1:0)-(a.reviewed?1:0));
function write(name,varName,rows,meta){
  fs.writeFileSync(path.join(OUT,name+'.json'),JSON.stringify(rows));
  fs.writeFileSync(path.join(OUT,name+'.js'),`// ${meta}\nglobalThis.${varName}=${JSON.stringify(rows)};\n`);
  console.log(`${rows.length} words -> ${name}.js`);
}
const src=`Pictpedia snapshot build ${E.build_version} (words ${String(E.sources.words_sha256).slice(0,12)})`;

// 英語版：絵のある英単語（小文字だけの2〜8文字。固有名詞・略語は除く。2文字語は普通の語だけ）
const EN2=new Set('an as at be by do go he hi if in is it me my no of oh on or ox so to up us we am'.split(' '));
{const best=new Map();
 for(const w of E.words){const a=w.availability&&w.availability.en;if(!a||!a.playable)continue;
  const k=String(a.answer||w.w);if(!/^[a-z]{2,8}$/.test(k)||(k.length===2&&!EN2.has(k))||!pic(w))continue;
  const row={w:k,ja:w.ja||'',r:Number(w.r)||9999,pic:pic(w),reviewed:w.status==='reviewed'};
  if(!best.has(k)||better(row,best.get(k))<0)best.set(k,row);}
 const rows=[...best.values()].sort(better).map(({reviewed,...x})=>x);
 write('word-suika-en','WORD_SUIKA_EN_WORDS',rows,src);}

// 日本語版：和語・漢語のひらがな語。カタカナ語、「〜」つきの訳、助詞で終わる句は除く
{const best=new Map(),jaAll=new Map();
 // 合体の判定には、絵のない語も使う（絵が別の意味の語 = playable:false や、日本語辞書 ja_index の語）。絵のある語だけがステージの目標になる
 const entries=E.words.map(w=>{const a=w.availability&&w.availability.ja;if(!a||!a.answer)return null;return {ja:String(w.ja||''),k:String(a.answer),r:Number(w.r)||9999,pic:a.playable?pic(w):'',en:w.w,status:w.status};}).filter(Boolean);
 const idxPath=path.join(ROOT,'app/data/ja/ja_index.json');
 if(fs.existsSync(idxPath))JSON.parse(fs.readFileSync(idxPath,'utf8')).forEach((row,i)=>{const [word,reading,,,english,,,note,kind]=row;if(kind==='カ'||/略語|四字熟語/.test(note||''))return;
   const k=String(reading||word).split('・')[0];entries.push({ja:String(word),k,r:20000+i,pic:'',en:String(english||'').split(';')[0],status:''});});
 for(const w of entries){
  const ja=w.ja,k=w.k;
  if(!/^[ぁ-ゔー]{2,7}$/.test(k))continue;
  if(/[ァ-ヴｦ-ﾟA-Za-zＡ-Ｚａ-ｚ0-9０-９〜~・、，,（）()\s]/.test(ja))continue;// カタカナ語・英字・句の訳
  if(/ー/.test(k))continue;// 長音記号はカタカナ語由来
  if(/[のはをへがとで]$/.test(ja)||/[一-龯々]に$|^(そこ|ここ|あそこ|どこ)に$/.test(ja)||/^(の|を|に|は|が|と|で|へ|も|から|より)/.test(ja))continue;// 「彼の」「外へ」「中に」「について」など助詞つきの句
  if(/(ている|ていた|られた|られる|された|して|った|ること|すること|こと|もの)$/.test(ja)&&!/^[一-龯々]+$/.test(ja))continue;// 活用形・名詞化した句
  const row={w:k,ja,r:w.r,pic:w.pic,en:w.en,reviewed:w.status==='reviewed'};
  if(!jaAll.has(k))jaAll.set(k,[]);jaAll.get(k).push([row.r,ja]);
  if(!best.has(k)||better(row,best.get(k))<0)best.set(k,row);}
 // 同じ読みの語は意味を並べる（かけい → 家系・家計）
 for(const [k,row] of best){const list=[...new Set(jaAll.get(k).sort((a,b)=>a[0]-b[0]).map(x=>x[1]))];row.ja=[row.ja,...list.filter(x=>x!==row.ja)].slice(0,3).join('・');}
 const rows=[...best.values()].sort(better).map(({reviewed,...x})=>x);
 write('word-suika-ja','WORD_SUIKA_JA_WORDS',rows,src);}
