(()=>{
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function install(){
  const hero=document.querySelector('#hero.ww'),panel=hero?.querySelector('.wwPanel');if(!panel)return;
  const rows=window.ETYMOPEDIA_BRAINROT?.characters||[];
  const featured=['kaput','weid','bha'].map(id=>rows.find(r=>r.id===id)).filter(Boolean);
  panel.innerHTML=`<span class="sticker">約6000年前からつながる、ことばの世界</span><span class="wwMark">Wild <span>Wordopia</span></span><h1>ことばは、<br>こんなにワイルド。</h1><p class="lead">キャベツの船長。目玉の魔法使い。<br>不思議な体には、英単語のひみつがある。<br>ワイルドたちの歌で、ことばの家族に出会おう。</p><div id="heroCtas"><a class="btn coral" href="#roots">ワイルドたちに会う →</a><a class="btn yellow" href="#worldSongs">歌の世界を見る</a></div>`;
  hero.querySelectorAll('.world-creature,.world-caption').forEach(e=>e.remove());
  featured.forEach((r,i)=>{const a=document.createElement('a');a.className='world-creature c'+i;a.href='#/root/'+r.id;a.setAttribute('aria-label',r.kana+'の語源を見る');a.innerHTML=`<img src="../assets/chara/brainrot/${esc(r.file)}" alt="${esc(r.kana)}"><span class="world-label">${esc(r.kana)}</span>`;hero.append(a);});
  const caption=document.createElement('span');caption.className='world-caption';caption.textContent='野生のことばたちが暮らす、空想の世界。';hero.append(caption);
  const nav=document.querySelector('#nav')||document.querySelector('header nav');if(nav)nav.innerHTML='<a href="#worldStory">この世界</a><a href="#roots">ワイルド</a><a href="#worldSongs">歌</a>';
  if(!document.querySelector('#worldStory')){const story=document.createElement('section');story.id='worldStory';story.innerHTML=`<div class="wrap world-story-grid"><div class="world-copy"><span class="world-eyebrow">THE WORLD OF WILD WORDS</span><h2>遠い昔のひとことが、<br>たくさんの英単語になった。</h2><p>「頭」「見る」「話す」。約6000年前にさかのぼる言葉の祖先、印欧祖語。時代と土地を旅した言葉は、いろいろな英単語へ姿を変えた。<br>その家族が、ひとつの生き物になったのがワイルド。</p></div><div class="world-family"><span class="world-eyebrow">ONE ROOT · MANY WORDS</span><p><strong>頭から生まれた、意外な家族。</strong></p><p>丸いキャベツも、みんなを率いる船長も。<br>歌を聞けば、不思議な体の理由がわかる。</p><div class="world-words"><span>cabbage · キャベツ</span><span>captain · 船長</span><span>biceps · 二頭筋</span><span>cattle · 牛</span></div></div></div>`;document.querySelector('#ticker').after(story);}
  let songs=document.querySelector('#worldSongs');if(!songs){songs=document.createElement('section');songs.id='worldSongs';document.querySelector('#worldStory').after(songs);}
  const lyrics=[['頭の家族を歌う','Cabbage, captain, head, head, head!\nキャベツのあたま　船長は先頭\nBiceps, two heads!　力こぶ'],['見ると知るの歌','Video, vision, wise, wizard!\n見てわかったら　wise, wise, wise!\n知恵の魔法使い　wizard!'],['話すから広がる歌','Fairy, phone, fable!\n妖精が話す　電話で話す\nことばでつながる　物語']];
  songs.innerHTML=`<div class="wrap"><div class="secHead"><h2>ワイルドが歌う、ことばの歌。</h2><p>一曲で、同じ語源の英単語に出会う。</p></div><div class="world-song-grid">${featured.map((r,i)=>`<article class="world-song"><img src="../assets/chara/brainrot/${esc(r.file)}" alt="${esc(r.kana)}" loading="lazy"><h3>${esc(r.kana)}</h3><p>${lyrics[i][0]}。キャラの体と歌詞が、ひとつの単語グループになる。</p><details><summary>歌詞の試案を見る</summary><pre>${esc(lyrics[i][1])}</pre><p>歌唱動画は制作準備中です。</p></details></article>`).join('')}</div><div class="world-social"><b>YouTube</b><b>TikTok</b><span>歌う動画から、この世界へ。図鑑・ゲームへの展開も準備中。</span></div></div>`;
 }
 const original=window.renderHome;if(typeof original==='function')window.renderHome=function(...args){const result=original.apply(this,args);install();return result;};
 const observer=new MutationObserver(()=>{if(document.querySelector('.wwPanel')){observer.disconnect();install();}});observer.observe(document.querySelector('#hero')||document.body,{childList:true,subtree:true});install();
})();
