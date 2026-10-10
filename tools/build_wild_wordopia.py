# エティモペディアを丸ごと複製し、看板とトップだけ Wild Wordopia に作り替える。
# 元の etymopedia.html と CSV には一切手を触れない(読むだけ)。
import sys
# 使いかた: python3 tools/build_wild_wordopia.py app/etymopedia.html app/wild-wordopia.html
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding="utf-8").read()

def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, (old[:60], n)
    s = s.replace(old, new)

rep("<title>エティモペディア | 描ける英語語源辞典</title>",
    "<title>Wild Wordopia | 英単語の祖先ずかん</title>")
rep("family=Zen+Maru+Gothic:wght@500;700;900&family=Shippori+Mincho:wght@800&display=swap",
    "family=Bagel+Fat+One&family=Zen+Maru+Gothic:wght@500;700;900&family=Shippori+Mincho:wght@800&display=swap")
rep('<b>エティモ<span>ペディア</span></b>', '<b class="wwLogo">Wild <span>Wordopia</span></b>')

CSS = r"""
<style>
/* ===== Wild Wordopia: 看板とトップの上書き ===== */
.wwLogo{font-family:"Bagel Fat One",sans-serif!important;font-weight:400!important;font-size:27px!important;color:var(--yellow);-webkit-text-stroke:1.5px var(--ink);paint-order:stroke fill;letter-spacing:.01em}
.wwLogo span{color:var(--coral)!important}
#hero.ww{padding:0;height:min(calc(100vh - 70px),900px);min-height:760px;border-bottom:3px solid var(--ink);
  background:#36a3ef url("../assets/ground/T_BG_base_ground.png") center bottom/cover no-repeat;--g:21.3vw}
#hero.ww>.wrap{height:100%}
.wwPanel{position:relative;z-index:6;max-width:720px;margin:0 auto;top:clamp(24px,5vh,56px);text-align:center;background:#fffdf8f2;border:3px solid var(--ink);border-radius:32px;box-shadow:6px 6px 0 var(--ink);padding:26px 30px 24px}
.wwMark{font-family:"Bagel Fat One",sans-serif;font-size:clamp(46px,6.6vw,88px);line-height:.95;color:var(--yellow);-webkit-text-stroke:4px var(--ink);paint-order:stroke fill;letter-spacing:.01em;display:block}
.wwMark span{color:var(--coral)}
.wwPanel h1{font-size:clamp(22px,2.6vw,32px)!important;line-height:1.5!important;margin-top:10px}
.wwPanel .lead{font-size:15px!important;margin-top:10px!important;line-height:1.9!important}
.wwPanel #heroCtas{justify-content:center;margin-top:16px}
.wwPanel #heroCtas .btn{font-size:15px;padding:10px 20px}
.wwPanel #stats{justify-content:center;gap:26px;margin-top:16px}
.wwPanel #stats .st .n{font-size:28px}
.wwCritter{position:absolute;z-index:3;transform:translateX(-50%);width:var(--w);bottom:calc(var(--g) * var(--f));border:0;background:none;padding:0;cursor:pointer}
.wwCritter::after{content:"";position:absolute;left:14%;right:14%;bottom:-2%;height:9%;border-radius:50%;background:radial-gradient(closest-side,rgba(30,60,20,.45),transparent);z-index:-1}
.wwCritter img{width:100%;display:block;transform-origin:50% 100%;animation:wwBreathe 3.6s ease-in-out infinite}
.wwCritter:hover img,.wwCritter:focus-visible img{animation:wwHop .55s ease-in-out infinite}
.wwCritter .say{position:absolute;left:50%;bottom:100%;transform:translateX(-50%) scale(0);transform-origin:50% 100%;background:#fff;border:2.5px solid var(--ink);border-radius:14px;padding:3px 12px;font-weight:900;font-size:13px;white-space:nowrap;transition:transform .15s;pointer-events:none}
.wwCritter:hover .say,.wwCritter:focus-visible .say{transform:translateX(-50%) scale(1)}
@keyframes wwBreathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.025) translateY(-2px)}}
@keyframes wwHop{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px) rotate(-3deg)}}
@media (max-width:860px){
  #hero.ww{height:auto;min-height:0;padding-bottom:250px;--g:150px;background-size:auto 100%}
  .wwPanel{top:18px;padding:20px 16px 18px;margin:0 4px}
  .wwCritter{width:var(--wm)}
  .wwCritter.back{display:none}
  .wwCritter .say{display:none}
}

/* トップは祖先が主役: 投稿・単語リストは出さない(単語は検索したときだけ) */
#join{display:none!important}
#words{display:none}
body.wwSearching #words{display:block}
.wwPanel{max-width:620px;padding:22px 26px 20px}
.wwMark{font-size:clamp(44px,5.6vw,76px)}
.wwPanel #heroCtas,.wwPanel #stats{display:none}
.wwScroll{position:absolute;right:24px;bottom:18px;z-index:30;background:#fff;border:3px solid var(--ink);border-radius:999px;padding:6px 18px;font-weight:900;font-size:14px;box-shadow:3px 3px 0 var(--ink)}
/* 祖先カード(大) */
#rootStrip.ww{grid-template-columns:repeat(3,1fr);gap:26px}
.wwCard{position:relative;display:block;background:#fff;border:3px solid var(--ink);border-radius:30px;overflow:hidden;cursor:pointer;box-shadow:6px 6px 0 var(--ink);transition:transform .15s}
.wwCard:hover{transform:translateY(-6px) rotate(-.6deg)}
.wwCard .art{position:relative;aspect-ratio:1/1;background:radial-gradient(circle at 50% 58%,#fff 0,color-mix(in srgb,var(--rc) 38%,#fff) 72%);border-bottom:3px solid var(--ink)}
.wwCard .art img{position:absolute;inset:6% 5% 3%;width:90%;height:91%;object-fit:contain;transition:transform .25s}
.wwCard:hover .art img{transform:scale(1.05) translateY(-2%)}
.wwCard .no{position:absolute;left:16px;top:14px;background:var(--ink);color:#fff;font-weight:900;font-size:13px;border-radius:999px;padding:3px 12px}
.wwCard .body{padding:16px 18px 18px}
.wwCard .nm{font-size:21px;font-weight:900;line-height:1.35}
.wwCard .rt{display:flex;align-items:baseline;gap:8px;margin-top:4px;font-weight:900}
.wwCard .rt i{font-family:"Shippori Mincho",serif;font-size:20px;color:var(--rc)}
.wwCard .parts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.wwCard .parts span{border:2px solid var(--ink);border-radius:999px;padding:1px 10px;font-weight:900;font-size:13px;background:var(--paper2)}
/* ほかの祖先 */
#wwOthers .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.wwMini{display:block;background:#fff;border:3px solid var(--ink);border-radius:22px;overflow:hidden;box-shadow:4px 4px 0 var(--ink);transition:transform .15s}
.wwMini:hover{transform:translateY(-4px)}
.wwMini .art{aspect-ratio:1;background:radial-gradient(circle at 50% 58%,#fff 0,color-mix(in srgb,var(--rc) 30%,#fff) 72%);border-bottom:3px solid var(--ink)}
.wwMini .art img{width:100%;height:100%;object-fit:contain;padding:8%}
.wwMini .body{padding:9px 12px 11px;font-weight:900;font-size:13px;line-height:1.45}
.wwMini .body small{display:block;font-size:12px;color:var(--ink2)}
@media (max-width:980px){#rootStrip.ww{grid-template-columns:repeat(2,1fr)}#wwOthers .grid{grid-template-columns:repeat(3,1fr)}}
@media (max-width:560px){#rootStrip.ww{grid-template-columns:1fr}#wwOthers .grid{grid-template-columns:repeat(2,1fr)}.wwScroll{display:none}}
@media (max-width:640px){.wwLogo{font-size:21px!important;white-space:nowrap}#logo small{display:none}}
@media (prefers-reduced-motion:reduce){.wwCritter img{animation:none!important}}
</style>
<script src="../assets/chara/brainrot/characters.js"></script>
<script src="../assets/chara/brainrot/top30.js"></script>
</head>"""
rep("</head>", CSS)

JS = r"""
/* ===== Wild Wordopia: 文言と祖先の姿の上書き(CSVは書き換えない) ===== */
const WW_LIB=(window.ETYMOPEDIA_BRAINROT&&window.ETYMOPEDIA_BRAINROT.characters)||[];
function wwApply(){
  Object.assign(UI,{site_title:"Wild Wordopia",site_sub:"英単語の祖先ずかん",
    footer:"<b>WILD WORDOPIA</b> ― 英単語の祖先ずかん / 祖先の姿は制作中の候補をふくむ(このページはコンセプト提示用モック)",
    roots_head:"ワードピアの祖先たち",roots_sub:"体のパーツは、ぜんぶ自分の子孫の英単語。タップすると、その祖先から生まれた単語の家系図へ。"});
  WW_LIB.forEach(c=>{const r=ROOTS[c.id];if(r&&!r.artOld){r.artOld=r.art;r.art="chara/brainrot/"+c.file;r.wwKana=c.kana;}});
}
/* 草原の立ち位置: id, 横%, 奥行き(0=手前 1=地平線), PC幅, スマホ幅, 奥(スマホで隠す) */
const WW_MEADOW=[["kaput",50,.02,"19vw","170px",0],["reg",28,.20,"12vw","104px",0],["weid",72,.16,"15vw","140px",0],
  ["ane",10,.04,"15vw","0",1],["men",90,.05,"14.5vw","0",1],["oino",39,.56,"8vw","0",1],["do",61,.60,"8vw","0",1],
  ["bha",19,.46,"9vw","0",1],["ye",81,.38,"10vw","0",1],["gwei",65,.32,"9.5vw","0",1],["mori",35,.28,"10.5vw","0",1],["genu",49,.66,"6vw","0",1]];
function wwHero(){
  const hero=$("#hero");hero.classList.add("ww");
  const inner=$("#heroInner");
  const keep=inner.querySelector("h1"),lead=inner.querySelector(".lead"),ctas=inner.querySelector("#heroCtas"),stats=inner.querySelector("#stats");
  const panel=document.createElement("div");panel.className="wwPanel";
  panel.innerHTML=`<span class="wwMark" aria-hidden="true">Wild <span>Wordopia</span></span>`;
  [keep,lead,ctas,stats].forEach(el=>el&&panel.appendChild(el));
  inner.innerHTML="";inner.appendChild(panel);
  hero.querySelectorAll(".wwCritter").forEach(e=>e.remove());
  hero.insertAdjacentHTML("beforeend",WW_MEADOW.map(([id,x,f,w,wm,back],i)=>{const r=ROOTS[id];if(!r||!r.wwKana)return"";
    return `<button type="button" class="wwCritter${back?" back":""}" style="left:${x}%;--f:${f};--w:${w};--wm:${wm};z-index:${10-Math.round(f*8)}" onclick="location.hash='#/root/${id}'" aria-label="${r.wwKana}(${r.r}「${r.jp}」)">
      <span class="say">${r.r}「${r.jp}」</span><img src="${imgURL(r.art)}" alt="" style="animation-delay:${-i*.4}s"></button>`;}).join(""));
  if(!hero.querySelector(".wwScroll"))hero.insertAdjacentHTML("beforeend",`<a class="wwScroll" href="#roots">祖先たちに会う ↓</a>`);
  $("#nav").innerHTML=`<a href="#roots">祖先たち</a><a href="#wwOthers">ほかの祖先</a>`;
  wwCards();wwOthers();
  const si=$("#searchInput");
  if(!si.dataset.ww){si.dataset.ww=1;si.addEventListener("input",e=>document.body.classList.toggle("wwSearching",!!e.target.value.trim()),true);}
}
const WW_LIBMAP={};WW_LIB.forEach(c=>WW_LIBMAP[c.id]=c);
function wwCards(){
  const strip=$("#rootStrip");strip.classList.add("ww");
  strip.innerHTML=Object.entries(ROOTS).map(([id,r],i)=>{const c=WW_LIBMAP[id];
    const parts=c?(c.motifs||[]).map(m=>`<span>${m.word}</span>`).join(""):"";
    return `<div class="wwCard" style="--rc:${r.c}" onclick="location.hash='#/root/${id}'">
      <div class="art"><span class="no">${String(i+1).padStart(2,"0")}</span><img src="${imgURL(r.art)}" alt="" loading="lazy"></div>
      <div class="body"><div class="nm">${r.wwKana||r.jp}</div><div class="rt"><i>${r.r}</i>「${r.jp}」</div><div class="parts">${parts}</div></div></div>`;}).join("");
}
function wwOthers(){
  const TOP=(window.WILDWORDOPIA_TOP30&&window.WILDWORDOPIA_TOP30.characters)||[];
  const have=new Set(Object.values(ROOTS).map(r=>(r.pie||r.r.replace(/^\*/,""))));
  const list=TOP.filter(c=>!have.has(c.rootKey)&&!Object.keys(ROOTS).includes(c.id));
  if(!list.length)return;
  let sec=$("#wwOthers");
  if(!sec){sec=document.createElement("section");sec.id="wwOthers";$("#roots").after(sec);}
  sec.innerHTML=`<div class="wrap"><div class="secHead"><h2>ほかにも見つかっている祖先</h2><p>子孫の多い祖先から順に、姿がわかってきた。タップすると語源データベースで子孫の単語が見られる。</p></div>
    <div class="grid">${list.map(c=>{const v=(c.candidates||[])[0]||{};return `<a class="wwMini" style="--rc:${c.color||"#e8875a"}" href="etymon-explorer.html#root:${encodeURIComponent(c.rootKey)}">
      <div class="art"><img src="../assets/chara/brainrot/${v.file}" alt="" loading="lazy"></div>
      <div class="body">${v.kana||""}<small>*${c.rootKey}「${c.meaning}」</small></div></a>`;}).join("")}</div></div>`;
}
/* ---- ホーム ---- */
function renderHome(){
  wwApply();"""
rep("/* ---- ホーム ---- */\nfunction renderHome(){", JS)
rep('  $("#footer").innerHTML=UI.footer||"";\n}', '  $("#footer").innerHTML=UI.footer||"";\n  wwHero();\n}')
open(dst, "w", encoding="utf-8").write(s)
print("ok", len(s))
