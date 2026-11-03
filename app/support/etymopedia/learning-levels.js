/* Read-only canonical data adapter; never changes artwork, saved selections or DB levels. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.EtymopediaLearning=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const ROOT_MAP_EXAMPLES={"weid-":[{"w":"view","p":["weid-"],"ja":"眺め、見解","en":"scene / opinion","pos":"名/動","languages":["ラテン語"]},{"w":"history","p":["weid-"],"ja":"歴史","en":"chronicles","pos":"名","languages":["古代ギリシャ語"]},{"w":"story","p":["weid-"],"ja":"物語","en":"narrative","pos":"名/動","languages":["古代ギリシャ語"]},{"w":"advice","p":["ad-","weid-"],"ja":"助言","en":"guidance","pos":"名","languages":["ラテン語"]},{"w":"wise","p":["weid-"],"ja":"賢い、やり方","en":"sagacious / manner","pos":"名/形","languages":["古英語"]},{"w":"vision","p":["weid-"],"ja":"視力、幻","en":"sight / apparition","pos":"名","languages":["ラテン語"]}],"reg-":[{"w":"rule","p":["reg-"],"ja":"規則、定規","en":"regulation / measuring bar","pos":"名/動","languages":["ラテン語"]},{"w":"dress","p":["de-","reg-"],"ja":"ドレス","en":"attire","pos":"名/動/形","languages":["ラテン語"]},{"w":"rich","p":["reg-"],"ja":"金持ちの、濃厚な","en":"affluent / heavy in flavor","pos":"形","languages":["古英語"]},{"w":"right","p":["reg-"],"ja":"正しい、右、権利","en":"correct / rightward / entitlement","pos":"名/動/形/副","languages":["古英語"]},{"w":"direct","p":["dwis-","reg-"],"ja":"導く、直接の","en":"guide / straight","pos":"動/形/副","languages":["ラテン語"]},{"w":"correct","p":["kom","reg-"],"ja":"正しい","en":"accurate","pos":"動/形","languages":["ラテン語"]}],"gwei-":[{"w":"quick","p":["gwei-"],"ja":"速い","en":"swift","pos":"名/形/副","languages":["古英語"]},{"w":"zoo","p":["gwei-"],"ja":"動物園","en":"animal park","pos":"名","languages":["古代ギリシャ語"]},{"w":"survive","p":["uper","gwei-"],"ja":"生き残る","en":"live on","pos":"動","languages":["ラテン語"]},{"w":"vivid","p":["gwei-"],"ja":"鮮やかな","en":"bright","pos":"形","languages":["ラテン語"]},{"w":"vital","p":["gwei-"],"ja":"生命の、不可欠な","en":"of life / essential","pos":"形","languages":["ラテン語"]},{"w":"whiskey","p":["wed-1","gwei-"],"ja":"ウイスキー","en":"grain liquor","pos":"名","languages":["アイルランド語"]}],"bhā-2":[{"w":"phone","p":["bhā-2"],"ja":"電話","en":"handset","pos":"名/動","languages":["古代ギリシャ語"]},{"w":"fate","p":["bhā-2"],"ja":"運命","en":"destiny","pos":"名","languages":["ラテン語"]},{"w":"infant","p":["ne","bhā-2"],"ja":"幼児","en":"baby","pos":"名/形","languages":["ラテン語"]},{"w":"ban","p":["bhā-2"],"ja":"禁止","en":"prohibition","pos":"名/動","languages":["古英語"]},{"w":"confess","p":["kom","bhā-2"],"ja":"自白する","en":"admit","pos":"動","languages":["ラテン語"]},{"w":"famous","p":["bhā-2"],"ja":"有名な","en":"renowned","pos":"形","languages":["ラテン語"]}],"men-1":[{"w":"mind","p":["men-1"],"ja":"心、気にする","en":"intellect / object to","pos":"名/動","languages":["古英語"]},{"w":"mental","p":["men-1"],"ja":"精神の","en":"psychological","pos":"名/形","languages":["ラテン語"]},{"w":"mention","p":["men-1"],"ja":"言及する、表彰","en":"refer / commendation","pos":"名/動","languages":["ラテン語"]},{"w":"comment","p":["kom","men-1"],"ja":"論評、注釈","en":"critique / annotation","pos":"名/動","languages":["ラテン語"]},{"w":"monitor","p":["men-1"],"ja":"監視装置","en":"surveillance device","pos":"名/動","languages":["ラテン語"]},{"w":"monument","p":["men-1"],"ja":"記念碑","en":"memorial","pos":"名","languages":["ラテン語"]}],"dō-":[{"w":"date","p":["dō-"],"ja":"日付、デート","en":"day / romantic outing","pos":"名/動","languages":["ラテン語"]},{"w":"tradition","p":["terə-2","dō-"],"ja":"伝統","en":"custom","pos":"名","languages":["ラテン語"]},{"w":"edition","p":["eghs","dō-"],"ja":"版","en":"version","pos":"名","languages":["ラテン語"]},{"w":"donate","p":["dō-"],"ja":"寄付する","en":"contribute","pos":"動","languages":["ラテン語"]},{"w":"donation","p":["dō-"],"ja":"寄付","en":"contribution","pos":"名","languages":["ラテン語"]},{"w":"donor","p":["dō-"],"ja":"提供者","en":"giver","pos":"名","languages":["ラテン語"]}],"kaput-":[{"w":"head","p":["kaput-"],"ja":"頭、首長","en":"top of body / chief","pos":"名/動","languages":["古英語"]},{"w":"captain","p":["kaput-"],"ja":"船長、主将","en":"ship commander / team leader","pos":"名/動","languages":["ラテン語"]},{"w":"chief","p":["kaput-"],"ja":"長","en":"leader","pos":"名/形","languages":["ラテン語"]},{"w":"capital","p":["kaput-"],"ja":"首都、資本、大文字","en":"chief city / fund / upper case","pos":"名/形","languages":["ラテン語"]},{"w":"cabbage","p":["kaput-"],"ja":"キャベツ","en":"leafy head vegetable","pos":"名","languages":["ラテン語"]},{"w":"chef","p":["kaput-"],"ja":"シェフ","en":"cook","pos":"名","languages":["ラテン語"]}],"oi-no-":[{"w":"one","p":["oi-no-"],"ja":"一つ","en":"single","pos":"名","languages":["古英語"]},{"w":"an","p":["oi-no-"],"ja":"一つの","en":"one","pos":"冠","languages":["古英語"]},{"w":"no","p":["ne","oi-no-"],"ja":"一つも〜ない","en":"zero","pos":"形","languages":["古英語"]},{"w":"eleven","p":["oi-no-","leikʷ-"],"ja":"11","en":"11","pos":"名","languages":["古英語"]},{"w":"onion","p":["oi-no-"],"ja":"タマネギ","en":"bulb vegetable","pos":"名","languages":["ラテン語"]},{"w":"alone","p":["al-5","oi-no-"],"ja":"ひとりで","en":"solitary","pos":"形","languages":["古英語"]}],"yē-":[{"w":"project","p":["per1","yē-"],"ja":"計画、投影する","en":"plan / cast forth","pos":"名/動","languages":["ラテン語"]},{"w":"inject","p":["en","yē-"],"ja":"注入する","en":"infuse","pos":"動","languages":["ラテン語"]},{"w":"subject","p":["upo","yē-"],"ja":"主題、被験者","en":"topic / test person","pos":"名/動/形","languages":["ラテン語"]},{"w":"object","p":["epi","yē-"],"ja":"物体、反対する","en":"item / protest","pos":"名","languages":["ラテン語"]},{"w":"reject","p":["re-","yē-"],"ja":"拒絶する","en":"refuse","pos":"名/動","languages":["ラテン語"]},{"w":"eject","p":["eghs","yē-"],"ja":"押し出す","en":"expel","pos":"動","languages":["ラテン語"]}],"mori-":[{"w":"marine","p":["mori-"],"ja":"海の","en":"oceanic","pos":"名/形","languages":["ラテン語"]},{"w":"marsh","p":["mori-"],"ja":"湿地","en":"wetland","pos":"名","languages":["古英語"]},{"w":"submarine","p":["mori-","upo"],"ja":"潜水艦","en":"undersea ship","pos":"名/動/副","languages":["ラテン語"]},{"w":"mermaid","p":["mori-","maghu-"],"ja":"人魚","en":"siren","pos":"名","languages":["古英語"]},{"w":"maritime","p":["mori-"],"ja":"海事の","en":"nautical","pos":"名/形","languages":["ラテン語"]},{"w":"rosemary","p":["ers-2","mori-"],"ja":"ローズマリー","en":"fragrant shrub","pos":"名","languages":["ラテン語"]}],"anə-":[{"w":"animal","p":["anə-"],"ja":"動物","en":"beast","pos":"名","languages":["ラテン語"]},{"w":"animation","p":["anə-","-ti-"],"ja":"動画","en":"cartoon","pos":"名","languages":["ラテン語"]},{"w":"unanimous","p":["oi-no-","anə-"],"ja":"満場一致の","en":"in agreement","pos":"形","languages":["ラテン語"]},{"w":"anemone","p":["anə-"],"ja":"アネモネ","en":"windflower","pos":"名","languages":["古代ギリシャ語"]},{"w":"animate","p":["anə-"],"ja":"生命を吹き込む、アニメーション化する","en":"enliven / create moving images","pos":"動/形","languages":["ラテン語"]},{"w":"inanimate","p":["ne","anə-"],"ja":"生命のない","en":"lifeless","pos":"形","languages":["ラテン語"]}],"genu-1":[{"w":"knee","p":["genu-1"],"ja":"ひざ","en":"leg joint","pos":"名/動","languages":["古英語"]},{"w":"kneel","p":["genu-1"],"ja":"ひざまずく","en":"genuflect","pos":"名/動","languages":["古英語"]},{"w":"polygon","p":["pelə-1","genu-1"],"ja":"多角形","en":"multi-sided shape","pos":"名","languages":["古代ギリシャ語"]},{"w":"hexagon","p":["genu-1","s(w)eks"],"ja":"六角形","en":"six-sided shape","pos":"名","languages":["古代ギリシャ語"]},{"w":"pentagon","p":["penkʷe","genu-1"],"ja":"五角形","en":"five-sided shape","pos":"名","languages":["古代ギリシャ語"]},{"w":"diagonal","p":["dwo-","genu-1"],"ja":"斜めの","en":"slanted","pos":"形","languages":["古代ギリシャ語"]}]};
 const ROOT_MAP_NOTES={"weid-":"view と vision はラテン語の「見る」につながる。history と story はギリシャ語の「調べて知ること」から分かれ、調査・歴史と物語になった。advice のもとには「見方・判断」があり、wise は知ることから「賢い」を表すようになった。","reg-":"right の古い意味には「まっすぐな」があり、correct は曲がったものを正すこと、direct は方向を定めることにつながる。rule はまっすぐな棒や基準の系統。dress にも、もとは形を整えるという動作がある。rich は力や支配と富が結び付いた語である。","gwei-":"quick はもとは「生きている」で、vital と survive にも命の意味が残る。vivid は生き生きとした様子から、鮮やかな色や記憶にも使われた。zoo は生き物を扱う zoological garden の短縮形。whiskey のもとはゲール語の「命の水」である。","bhā-2":"phone は声の名を受け継ぎ、fate は神々が口にした言葉から運命を表した。infant は「まだ話せない」子ども。ban は公に告げることから禁止へ、confess は認めて言い表すことへ、famous は人々の話題になることから有名という意味へつながった。","men-1":"mind と mental には心や考える働きが残る。mention は話や文章で思い出させること、comment は考え出したものから説明や注釈へ進んだ。monitor のもとは注意を促す人。monument は忘れないよう思い出させるもので、今は記念碑も指す。","dō-":"donate と donation、donor は贈り物や与えることの語群。tradition は次の人へ渡すことから伝統になった。edition は外へ出す、世に送り出すことから出版につながる。date の日付は、文書の「与えられた」というラテン語の書式に由来する。","kaput-":"head と、ラテン語の caput「頭」を受け継ぐ captain・chief・capital がつながる。chef はフランス語の「台所の長」の短縮。cabbage の丸い葉のかたまりは、小さな頭に見立てられた。","oi-no-":"one の古い形は an にも残り、no には否定と一つという材料がある。eleven は十を越えて一つ残るという古い数え方の名残。alone は「まったく一人」、onion のラテン語名には一つという語が関係するが、その名づけの細かな理由には議論がある。","yē-":"project は前へ、inject は中へ、eject は外へ投げるという組み合わせ。reject は投げ返すことから受け付けないことへ進んだ。object は目や心の前に置かれるもの、subject は議論の下に置かれる土台から主題を表す。向きを添える部品によって、同じ「投げる」が違う場面を作る。","mori-":"marine・maritime・submarine はラテン語の海につながり、海の、海に関する、海の下のという違いを作る。marsh と mermaid には古英語系の水域の名が残る。rosemary はラテン語の「海の露」を受け継いだ名前で、rose と Mary の組み合わせが出発点ではない。","anə-":"animal は命あるもの、animate と animation は息や命を与えることにつながる。inanimate はそれを否定して命のないもの。unanimous は心を一つにすることから全員一致を表す。anemone はギリシャ語の風の名に結び付けられた花の名前である。","genu-1":"knee と kneel はひざとひざまずく動作。曲がったひざとつながるギリシャ語の角の名が、polygon・hexagon・pentagon・diagonal に現れる。多角形、六角形、五角形、角から向こうの角へ渡る対角線という違いを、前の部品が作っている。"};
 const key=row=>JSON.stringify([row.w,row.p||[]]);
 const norm=value=>String(value||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[–—]/g,'-').trim().replace(/\s+/g,' ');
 const first=value=>norm(String(value||'').split('、')[0]);
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const valid=level=>Number.isInteger(level)&&level>=1&&level<=10;
 const theme=level=>valid(level)?Math.ceil(level*7/10):0;
 function stars(level){
  if(!valid(level))return '';
  return Array.from({length:Math.ceil(level/2)},(_,i)=>'<span class="el-star'+(i*2+1===level?' el-half':'')+'">★</span>').join('');
 }
 function pill(level,big=false,word){
  const known=valid(level),label=known?'難易度 '+level/2+' / 5（独自10段階のレベル'+level+'）':'難易度 未分類';
  return '<button type="button" class="etymon-rarity er-surface er-t'+theme(level)+' er-'+(big?'detail':'list')+' el-pill" data-etymopedia-difficulty="1" data-level="'+(known?level:'')+'"'+(word?' data-word="'+esc(word.w)+'" data-roots="'+esc(JSON.stringify(word.p||[]))+'"':'')+' data-stars="'+(known?level/2:0)+'" data-scale="5" title="'+esc(label+'。タップして根拠を表示')+'" aria-label="'+esc(label+'。根拠を表示')+'">'+(known?'<span class="el-stars" aria-hidden="true">'+stars(level)+'</span>':'<span>未分類</span>')+'</button>';
 }
 function create(difficulty,index,rows,roots=[]){
  const canonical=new Map(),duplicates=new Set(),rootMap=new Map(),confirmedLayout=new Set();
  for(const row of rows){const k=key(row);if(canonical.has(k))duplicates.add(k);canonical.set(k,row);}
  for(const row of roots){if(rootMap.has(row.key))rootMap.set(row.key,null);else rootMap.set(row.key,row);}
  function status(row){
   const k=key(row),source=canonical.get(k);
   if(!source)return {status:'missing',source:null};
   if(duplicates.has(k))return {status:'ambiguous',source:null};
   if(first(row.jp)!==first(source.ja)&&!confirmedLayout.has(k))return {status:'sense_hold',source:null};
   return {status:'matched',source};
  }
  function lookup(row){const s=status(row);return s.source?difficulty.evaluate(s.source,index):null;}
  function update(row){
   const s=status(row);row.canonicalStatus=s.status;
   if(s.source){const w=s.source;row.jp=w.ja||'';row.gloss=w.en||'';row.memo=w.b||'';row.pos=w.pos||'';row.region=w.g||'';row.ipa=w.phonetic||'';}
   return row;
  }
  const api={lookup,status,update,source:row=>status(row).source,roots:rootMap};
  api.pieRoots=row=>api.source(row)?.p||null;
  // Display selection only: do not mistake familiar spelling for a basic sense.
  const exampleHolds=new Set([['anima',['anə-']],['animus',['anə-']],['rectus',['reg-']],['mare',['mori-']],['mere',['mori-']]].map(x=>JSON.stringify(x)));
  const everydayExamples=new Set(['head','animal','anime','phone','fate','ban','infant','quick','zoo','survive','vitamin','a','an','no','one','eleven','onion','rule','dress','rich','view','story','history','wise','advice','advise','project','inject','marine','marsh','submarine','mermaid','automatic','date','tradition','edition','donate','donation','knee','kneel','polygon','hexagon']);
  api.mapOriginLanguages=word=>{for(const rows of Object.values(ROOT_MAP_EXAMPLES)){const hit=rows.find(x=>x.w===word);if(hit)return hit.languages;}return [];};
  api.rootExamples=function(rootKey,explanation,candidates,hasArt){
   const chosen=ROOT_MAP_EXAMPLES[rootKey];if(!chosen)return [];
   const out=[];for(const wanted of chosen){const source=canonical.get(key(wanted));const row=candidates.find(x=>key(x)===key(wanted));const level=row&&api.lookup(row)?.level;
    if(!source||!row||['ja','en','pos'].some(k=>source[k]!==wanted[k])||api.status(row).status!=='matched'||!Number.isInteger(level)||level<1||level>9||!hasArt(source))throw Error('Six-example validation failed: '+wanted.w);
    out.push(row);
   }if(out.length!==6)throw Error('Exactly six examples required');return out;
  };
  api.apply=function(words,lexicon,displayRoots,byId){
   // Featured cards and the family list sometimes use different Japanese wording.
   // Accept that wording only when the existing page independently contains the
   // same exact canonical identity AND first sense; never infer from spelling.
   const legacy=[...words,...Object.values(lexicon).flat().map(row=>({w:row[0],jp:row[2],p:row[4]}))];
   for(const row of legacy){const k=key(row),source=canonical.get(k);if(source&&!duplicates.has(k)&&first(row.jp)===first(source.ja))confirmedLayout.add(k);}
   words.forEach(update);Object.values(byId).forEach(update);
   for(const arr of Object.values(lexicon))for(const row of arr){
    const s=status({w:row[0],jp:row[2],p:row[4]});
    if(s.source){row[1]=s.source.g||'';row[2]=s.source.ja||'';row[3]=s.source.b||'';}
   }
   for(const root of Object.values(displayRoots)){
    const source=rootMap.get(root.pie);
    if(source?.definition_reviewed===true&&typeof source.d==='string'&&source.d){root.note=source.d+(ROOT_MAP_NOTES[root.pie]&&ROOT_MAP_EXAMPLES[root.pie].some(x=>!new RegExp("\\b"+x.w+"\\b","i").test(source.d))?"<br><br>"+ROOT_MAP_NOTES[root.pie]:"");root.jp=source.ja||root.jp;}
   }
  };
  return api;
 }
 async function decodeSnapshot(envelope){
  if(envelope?.schema!==1||envelope.encoding!=='gzip-base64')throw Error('Current Etymopedia data unavailable');
  const packed=Uint8Array.from(atob(envelope.data),c=>c.charCodeAt(0));
  const bytes=new Uint8Array(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
  if(hash!==envelope.sha256)throw Error('Current Etymopedia data checksum mismatch');
  const data=JSON.parse(new TextDecoder().decode(bytes));
  if(data.schema!==1||!Array.isArray(data.words)||!Array.isArray(data.roots))throw Error('Incomplete current Etymopedia data');
  return data;
 }
 async function load(options={}){
  const scope=options.scope||globalThis;
  // Use the same integrity-checked public projection on HTTP and file://.
  // Never overwrite it with older shared dictionary JSON or source shards.
  const data=await decodeSnapshot(scope.ETYMOPEDIA_CURRENT_DATA);
  const engine=scope.EtymonDifficultyV2;
  if(!engine||!Array.isArray(scope.ETYMON_WEBLIO_LEVELS?.entries)||!Array.isArray(scope.ETYMON_LEARNING_LEVELS?.entries))throw Error('Current difficulty evidence unavailable');
  const api=create(engine,engine.makeIndex(scope.ETYMON_WEBLIO_LEVELS,scope.ETYMON_LEARNING_LEVELS),data.words,data.roots);
  api.phonetic=async row=>api.source(row)?.phonetic||'';
  return api;
 }
 function details(word,result,status='matched'){
  const level=result?.level??null;
  const hold=status==='sense_hold'?'旧表示と正本の語義が異なるため、自動更新を保留しています。':status==='ambiguous'?'同じ識別情報を持つ語が複数あり、特定できません。':status==='missing'?'現在の正本と同じ綴り・語根構成を確認できません。':status==='unavailable'?'現在の正本データを読み込めませんでした。再読み込みまたはデータ更新が必要です。':'';
  const official=result?.official?.length?result.official.map(x=>esc(x.pos)+' '+esc(x.level)).join(' / '):'該当なし';
  return '<h2>'+esc(word?.w||'難易度の目安')+'</h2><div class="el-dialog-stars">'+pill(level,true)+'</div><p>星は最大5個、半星刻みです。正本の独自10段階を表示時だけ2で割ります。'+(valid(level)?' レベル'+level+' → '+level/2+'つ星。':' 未分類は最低レベルに置き換えません。')+'</p>'+(word?'<dl><dt>Weblio Lv（1〜30）</dt><dd>'+esc(result?.web??'—')+'</dd><dt>CEFR-J（品詞別）</dt><dd>'+official+'</dd><dt>補助資料（加工r）</dt><dd>'+esc(result?.raw??'—')+'</dd></dl>':'')+'<p>'+esc(hold||result?.note||'Weblioを主指標とし、未収録語はCEFR-J、加工rの順に補います。')+'</p><p class="el-caution">公式CEFRの細分類や実測の学習難易度ではありません。</p>';
 }
 function bind(scope=globalThis){
  if(scope.document.documentElement.dataset.etymopediaDifficultyBound)return;
  scope.document.documentElement.dataset.etymopediaDifficultyBound='1';
  scope.document.addEventListener('click',event=>{
   const button=event.target.closest?.('[data-etymopedia-difficulty]');if(!button||button.closest('#etymopediaDifficultyDialog'))return;
   event.stopPropagation();event.preventDefault();
   let dialog=scope.document.getElementById('etymopediaDifficultyDialog');
   if(!dialog){dialog=scope.document.createElement('dialog');dialog.id='etymopediaDifficultyDialog';dialog.setAttribute('aria-label','難易度の説明');dialog.innerHTML='<div class="el-details"></div><button type="button" class="el-close">閉じる</button>';scope.document.body.append(dialog);dialog.querySelector('.el-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
   const word=button.dataset.word?{w:button.dataset.word,p:JSON.parse(button.dataset.roots),jp:''}:null;
   const service=scope.etymopediaLevels,actual=word&&scope.etymopediaWord?.(word.w,word.p);
   const result=actual?service?.lookup(actual):{level:button.dataset.level?Number(button.dataset.level):null};
   const state=!service?'unavailable':actual?service.status(actual).status:'matched';
   dialog.querySelector('.el-details').innerHTML=details(actual||word,result,state);
   dialog.showModal();
  },true);
 }
 return {key,norm,first,valid,theme,stars,pill,create,decodeSnapshot,load,details,bind};
});

/* Grouped language hubs. Pure geometry is also exported for deterministic tests. */
(function(scope){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 const hit=(a,b,r)=>{ // segment versus the open interior of a padded obstacle
  let lo=0,hi=1;for(const [k,min,max] of [['x',r.left,r.right],['y',r.top,r.bottom]]){const d=b[k]-a[k];if(Math.abs(d)<1e-7){if(a[k]<=min||a[k]>=max)return false;}else{let x=(min-a[k])/d,y=(max-a[k])/d;if(x>y)[x,y]=[y,x];lo=Math.max(lo,x);hi=Math.min(hi,y);if(lo>=hi)return false;}}return hi>0&&lo<1;
 };
 const cross=(a,b,c,d)=>{const side=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);return side(a,b,c)*side(a,b,d)<-1e-7&&side(c,d,a)*side(c,d,b)<-1e-7;};
 function permutations(a){if(a.length<2)return[a];return a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(p=>[v,...p]));}
 function plan(items,width){
  if(items.length!==6)throw Error('Root map requires exactly six verified examples');
  const W=Math.max(300,width),compact=W<560,H=compact?380:330;
  const image=compact?56:82,nodeWidth=compact?86:Math.min(144,W*.19),char=compact?96:138,radius=compact?79:103,hubRadius=compact?19:23;
  const cx=W/2,cy=H/2-9;const x=compact?nodeWidth/2+3:nodeWidth/2+8;
  const slots=[{x,y:57},{x:W-x,y:57},{x,y:cy},{x:W-x,y:cy},{x,y:H-72},{x:W-x,y:H-72}];
  const groups=[...new Set(items.flatMap(x=>x.languages))].sort();if(!groups.length)throw Error('Reviewed origin language is required');
  let best=null;const layoutsSeen=new Set();
  for(const order of permutations([0,1,2,3,4,5])){
   const groupOrder=order.map(i=>items[i].languages.slice().sort().join("+")).join("|");if(layoutsSeen.has(groupOrder))continue;layoutsSeen.add(groupOrder);
   const nodes=order.map((index,i)=>({...items[index],slot:i,x:slots[i].x,y:slots[i].y}));
   const hubs=groups.map(language=>{const own=nodes.filter(n=>n.languages.includes(language));const ax=own.reduce((s,n)=>s+n.x-cx,0),ay=own.reduce((s,n)=>s+n.y-cy,0);return{language,angle:groups.length===1?-Math.PI/2:Math.abs(ax)+Math.abs(ay)<1?-Math.PI/2:Math.atan2(ay,ax),count:own.length};}).sort((a,b)=>a.angle-b.angle||a.language.localeCompare(b.language));
   // Search free circle positions instead of putting a label over the character.
   const occupied=nodes.map(n=>({left:n.x-nodeWidth/2-5,right:n.x+nodeWidth/2+5,top:n.y-image/2-5,bottom:n.y+image/2+32}));
   occupied.push({left:cx-char*.54-5,right:cx+char*.54+5,top:cy-char*.54-5,bottom:cy+char*.54+38});
   const placed=[];let hubPenalty=0;
   hubs.sort((a,b)=>b.count-a.count||a.language.localeCompare(b.language));
   for(const h of hubs){let choice=null;
    for(const rad of [radius,radius+14,radius+28,radius+42,radius+56])for(let j=0;j<32;j++){
     const angle=-Math.PI/2+j*Math.PI/16,x=cx+rad*Math.cos(angle),y=cy+rad*Math.sin(angle);
     if(x-hubRadius<2||x+hubRadius>W-2||y-hubRadius<2||y+hubRadius>H-2)continue;
     const box={left:x-hubRadius-3,right:x+hubRadius+3,top:y-hubRadius-3,bottom:y+hubRadius+3};
     if([...occupied,...placed].some(r=>box.left<r.right&&box.right>r.left&&box.top<r.bottom&&box.bottom>r.top))continue;
     const cost=nodes.filter(n=>n.languages.includes(h.language)).reduce((v,n)=>v+dist({x,y},n)+(hit({x,y},n,occupied[occupied.length-1])?450:0),0)+(rad-radius)*.5;
     if(!choice||cost<choice.cost)choice={x,y,angle,cost,box};
    }
    if(!choice){hubPenalty+=100000;choice={x:cx,y:24,angle:-Math.PI/2,box:{left:cx-24,right:cx+24,top:0,bottom:48}};}
    Object.assign(h,{x:choice.x,y:choice.y,angle:choice.angle});placed.push(choice.box);
   }
   let score=hubPenalty;const edges=[];
   for(const n of nodes)for(const lang of n.languages){const h=hubs.find(h=>h.language===lang);score+=dist(h,n);edges.push([h,n]);}
   for(let i=0;i<edges.length;i++)for(let j=0;j<i;j++)if(edges[i][0]!==edges[j][0]&&cross(...edges[i],...edges[j]))score+=500;
   for(const h of hubs){if(h.x-hubRadius<2||h.x+hubRadius>W-2||h.y-hubRadius<2||h.y+hubRadius>H-2)score+=10000;for(const n of nodes)if(Math.abs(h.x-n.x)<nodeWidth/2+hubRadius+5&&h.y+hubRadius>n.y-image/2-5&&h.y-hubRadius<n.y+image/2+26)score+=10000;}
   if(!best||score<best.score)best={nodes,hubs,score,width:W,height:H,image,nodeWidth,char,hubRadius,cx,cy};
  }
  if(!best||best.score>=100000)throw Error("No collision-free hub placement at this width");
  return best;
 }
 function route(a,b,obstacles,previous=[]){
  // Visibility graph around expanded image/text/icon boxes. Length, bends and
  // existing crossings are costs; no branch may pass through an image or word.
  const points=[a,b];for(const r of obstacles)for(const x of [r.left,r.right])for(const y of [r.top,r.bottom])points.push({x,y});
  const graph=points.map(()=>[]);for(let i=0;i<points.length;i++)for(let j=0;j<i;j++)if(!obstacles.some(r=>hit(points[i],points[j],r))){let cost=dist(points[i],points[j])+7;for(const e of previous)if(cross(points[i],points[j],...e))cost+=90;graph[i].push([j,cost]);graph[j].push([i,cost]);}
  const costs=points.map(()=>Infinity),prev=points.map(()=>-1),done=new Set();costs[0]=0;
  for(let k=0;k<points.length;k++){let v=-1;for(let i=0;i<points.length;i++)if(!done.has(i)&&(v<0||costs[i]<costs[v]))v=i;if(v<0||!Number.isFinite(costs[v]))break;if(v===1)break;done.add(v);for(const [u,c]of graph[v])if(costs[v]+c<costs[u]){costs[u]=costs[v]+c;prev[u]=v;}}
  if(!Number.isFinite(costs[1]))return null;const path=[];for(let i=1;i!==-1;i=prev[i])path.unshift(points[i]);return path;
 }
 function install(window,service){
  if(!window.document||typeof window.drawRootLines!=='function')return;
  let style=window.document.getElementById('grouped-origin-map-style');if(!style){style=window.document.createElement('style');style.id='grouped-origin-map-style';style.textContent=`.rootMap.groupedOrigins{height:330px;margin:8px auto 16px}.groupedOrigins .originSealSlot{display:none!important}.groupedOrigins .rmCenter{left:50%;top:calc(50% - 9px)}.groupedOrigins .rmCharWrap{width:var(--group-char);height:var(--group-char)}.groupedOrigins .rmConcept{font-size:25px;top:calc(100% + 8px)}.groupedOrigins .wnode{width:var(--group-node);left:var(--group-x);top:var(--group-y);transform:translate(-50%,-50%);gap:3px}.groupedOrigins .wnImg{width:var(--group-image);height:var(--group-image)}.groupedOrigins .wnW{font-size:14px;line-height:1.2;min-height:17px}.originHub{position:absolute;z-index:2;border:1.5px solid #797078;border-radius:50%;background:#fffaf0;color:#534953;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10px;font-weight:800;line-height:1.15;box-sizing:border-box;pointer-events:none;transform:translate(-50%,-50%);padding:3px}.groupedOrigins .rmLines{z-index:0}.groupedOrigins .rmChar{width:108%;height:108%}@media(max-width:560px){.groupedOrigins .wnW{font-size:12px}.groupedOrigins .rmConcept{font-size:20px}.originHub{font-size:9px}}`;window.document.head.append(style);}
  const short=language=>({'古代ギリシャ語':'古代\nギリシャ','ギリシャ語':'古代\nギリシャ','ラテン語':'ラテン','古英語':'古英語','英語':'英語','古フランス語':'古\nフランス','フランス語':'フランス','日本語':'日本語','アイルランド語':'アイル\nランド','ゲルマン祖語':'ゲルマン\n祖語'}[language]||language.replace(/語$/,''));
  let pending=false,last='';
  window.drawRootLines=function(){
   const map=window.document.querySelector('.rootMap');if(!map)return;
   const nodes=[...map.querySelectorAll('.wnode')];if(nodes.length!==6){map.dataset.layoutError='six-examples-required';return;}
   const items=nodes.map((node,index)=>{const word=node.querySelector('.wnW').textContent;const langs=service.mapOriginLanguages?.(word)||[];return{id:index,word,languages:langs.length?langs:['確認中']};});
   const W=map.getBoundingClientRect().width;const signature=JSON.stringify([W,items]);if(map.dataset.groupedSignature===signature)return;
   const layout=plan(items,W);map.dataset.groupedSignature=signature;map.classList.add('groupedOrigins');map.style.height=layout.height+'px';map.style.setProperty('--group-char',layout.char+'px');map.style.setProperty('--group-node',layout.nodeWidth+'px');map.style.setProperty('--group-image',layout.image+'px');
   for(const n of layout.nodes){const node=nodes[n.id];node.style.setProperty('--group-x',n.x+'px');node.style.setProperty('--group-y',(n.y+10)+'px');node.dataset.layoutSlot=n.slot;}
   map.querySelectorAll('.originHub').forEach(n=>n.remove());
   for(const h of layout.hubs){const el=window.document.createElement('span');el.className='originHub';el.dataset.language=h.language;el.textContent=short(h.language);el.style.whiteSpace='pre-line';el.title=h.language;el.style.left=h.x+'px';el.style.top=h.y+'px';el.style.width=el.style.height=layout.hubRadius*2+'px';map.append(el);}
   const svg=map.querySelector('.rmLines');svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${W} ${layout.height}`);svg.style.width=W+'px';svg.style.height=layout.height+'px';
   const rects=layout.nodes.map(n=>({left:n.x-layout.nodeWidth/2-5,right:n.x+layout.nodeWidth/2+5,top:n.y-layout.image/2-5,bottom:n.y+layout.image/2+32,id:n.id}));
   const center={left:layout.cx-layout.char*.54-5,right:layout.cx+layout.char*.54+5,top:layout.cy-layout.char*.54-5,bottom:layout.cy+layout.char*.54+38};
   const hubRects=layout.hubs.map(h=>({left:h.x-layout.hubRadius-4,right:h.x+layout.hubRadius+4,top:h.y-layout.hubRadius-4,bottom:h.y+layout.hubRadius+4,language:h.language}));
   const previous=[];let failures=0;
   function path(points,attrs){const el=window.document.createElementNS(NS,'path');el.setAttribute('d',points.map((p,i)=>(i?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1)).join(' '));el.setAttribute('fill','none');el.setAttribute('stroke','#777078');el.setAttribute('stroke-width','1.7');el.setAttribute('stroke-linejoin','round');el.setAttribute('stroke-linecap','round');for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);svg.append(el);}
   for(const h of layout.hubs){const u={x:(h.x-layout.cx)/dist(h,{x:layout.cx,y:layout.cy}),y:(h.y-layout.cy)/dist(h,{x:layout.cx,y:layout.cy})};path([{x:layout.cx+u.x*layout.char*.5,y:layout.cy+u.y*layout.char*.5},{x:h.x-u.x*layout.hubRadius,y:h.y-u.y*layout.hubRadius}],{'data-trunk':h.language});}
   for(const n of layout.nodes)for(const language of n.languages){const h=layout.hubs.find(h=>h.language===language);const dx=n.x-h.x,dy=n.y-h.y,len=Math.hypot(dx,dy);const a={x:h.x+dx/len*(layout.hubRadius+.75),y:h.y+dy/len*(layout.hubRadius+.75)};const own=rects.find(r=>r.id===n.id);const side=n.x<layout.cx?'right':'left',b={x:n.x+(side==='right'?1:-1)*(layout.image/2+5),y:n.y};const obstacles=[...rects.filter(r=>r!==own),center,...hubRects.filter(r=>r.language!==language)];const points=route(a,b,obstacles,previous);if(!points){failures++;continue;}path(points,{'data-word':n.word,'data-language':language});for(let i=1;i<points.length;i++)previous.push([points[i-1],points[i]]);}
   map.dataset.layoutError=failures?'unroutable-'+failures:'';map.dataset.languageHubs=layout.hubs.length;map.dataset.wordBranches=svg.querySelectorAll('[data-word]').length;
  };
  const render=window.renderRoot;
  if(typeof render==='function'&&!render.groupedOriginRenderer){
   window.renderRoot=function(...args){const result=render.apply(this,args);for(const image of window.document.querySelectorAll('.rootMap .wnImg img'))image.onerror=function(){this.onerror=null;this.removeAttribute('src');this.alt='画像を読み込めません';this.closest('.wnode').dataset.imageStatus='unavailable';window.drawRootLines();};return result;};
   window.renderRoot.groupedOriginRenderer=true;
  }
  // The page's existing resize/font/image listeners call this same global binding.
  window.requestAnimationFrame(window.drawRootLines);
 }
 const api={plan,route,hit,cross,install};if(typeof module==='object'&&module.exports){if(module.exports.create)module.exports.rootMap=api;else module.exports=api;}
 else{scope.EtymopediaRootMap=api;const prior=scope.EtymopediaLearning.bind;scope.EtymopediaLearning.bind=function(...args){const result=prior.apply(this,args);install(scope,scope.etymopediaLevels);return result;};}
})(typeof globalThis==='object'?globalThis:this);
