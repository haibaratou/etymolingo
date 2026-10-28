/* Original IP portal: fictional world, genuine links to the dictionary. */
(() => {
  const art = '../assets/chara/etymopedia-wild/';
  const people = [
    {id:'kaput',file:'root-kaput-v004.png',name:'カプト',family:'head / captain / cabbage',place:'首都のない首都',story:'王様はいない。みんなが「自分が頭だ」と言い張るので、毎朝、首都の場所が変わる。キャベツの隊長だけは、昨日の地図をまだ信じている。',color:'#f7c7bb'},
    {id:'oino',file:'root-oino-v006.png',name:'オイノ',family:'one / onion / unicorn',place:'一人しか入れない遊園地',story:'観覧車は一席。回転木馬は一頭。入口も出口も同じ扉。「一緒に来てね」と書いた招待状だけが、二枚残っている。',color:'#dbddaa'},
    {id:'men',file:'root-men1-v003.png',name:'メン',family:'mind / monitor / monster',place:'まだ考えている駅',story:'列車は一度も来ない。駅長が、どこへ行きたいのか考えているから。ホームのテレビには、誰かが忘れた夢が流れっぱなし。',color:'#c9c6ed'}
  ];
  const img = p => `<img src="${art+p.file}" alt="${p.name}" width="512" height="512">`;
  const card = p => `<a class="ip-product" href="wildwords-product.html?character=${p.id}"><div class="ip-merch" style="background:${p.color}"><span class="ip-ring" aria-hidden="true"></span>${img(p)}<span class="ip-product-stamp">WILD WORDS<br>KEY CHARM</span></div><small>ACRYLIC KEY CHARM / 01</small><h3>${p.name} アクリルキーホルダー</h3><p>¥880 <small>税込・企画価格</small><span>見る ↗</span></p></a>`;
  const initHome = () => {
    if (!document.querySelector('.wild-stage') || document.querySelector('.ip-home-ready')) return;
    const nav = document.getElementById('nav');
    nav.innerHTML = '<a href="wildwords-world.html">WORLD</a><a href="#roots">CHARACTERS</a><a href="wildwords-shop.html">STORE</a>';
    document.getElementById('hero').classList.add('ip-home-ready');
    document.querySelector('.wild-eyebrow').textContent='';
    document.querySelector('#hero h1').textContent='WILD WORDS';
    document.querySelector('#hero .lead').textContent='言葉の祖先、ワイルドワード。';
    document.querySelector('#heroCtas').innerHTML='<a class="btn wild-primary" href="#roots">キャラクターに会う ↓</a>';
    document.querySelector('.wild-stage-hint').textContent='気になるやつを、タップ。';
    document.querySelector('.wild-stage-word').textContent='';
    document.querySelector('.wild-stamp').hidden=true;
    document.getElementById('roots').after(document.getElementById('wildIntro'));
    document.getElementById('rootsHead').innerHTML='キャラクター';
    document.getElementById('rootsSub').innerHTML='気になる祖先から、言葉の一族へ。';
    const field=document.createElement('div'); field.className='ip-dictionary';
    field.innerHTML='<label for="ipWordSearch">祖先をさがす</label><input id="ipWordSearch" type="search" placeholder="head、one、頭…"><p id="ipSearchStatus" role="status"></p>';
    document.getElementById('rootStrip').before(field);
    field.querySelector('input').addEventListener('input', e=>{const q=e.target.value.trim().toLowerCase();let n=0;document.querySelectorAll('.wild-root-card').forEach(c=>{const hit=!q||(c.textContent+" "+c.dataset.familySearch).toLowerCase().includes(q);c.hidden=!hit;if(hit)n++;});document.getElementById('ipSearchStatus').textContent=q?`${n}体の祖先が見つかりました`:'英語・意味・祖先の名前で検索できます。';});
  };
  const standalone = document.getElementById('ipPage');
  if (standalone) {
    const type = document.body.dataset.page;
    document.querySelector('#ipNav').innerHTML='<a href="etymopedia-wild.html">WILD WORDS</a><nav><a href="wildwords-world.html">WORLD</a><a href="etymopedia-wild.html#roots">CHARACTERS</a><a href="wildwords-shop.html">STORE</a></nav>';
    if(type==='world') standalone.innerHTML=`<header class="ip-page-title"><small>FIELD NOTES FROM A LOST WORLD</small><h1>誰もいない。<br>でも、暮らした跡がある。</h1><p>六千年前、ここにはワイルドワードたちがいた。<br>彼らは消えた。奇妙な習慣と、私たちの言葉を残して。</p></header>${people.map((p,i)=>`<section id="${p.id}" class="ip-world-chapter" style="--place:${p.color}"><div class="ip-world-portrait scene-${p.id}"><div class="ip-relic" aria-hidden="true"><i></i><b></b><em></em></div>${img(p)}<span>LOST RESIDENT / 0${i+1}</span></div><div><small>0${i+1} / ${p.family}</small><h2>${p.place}</h2><p>${p.story}</p><p class="ip-archive">ことばの痕跡<br><b>${p.family}</b></p><a class="ip-button" href="etymopedia-wild.html#/root/${p.id}">この祖先の言葉を調べる ↗</a></div></section>`).join('')}<p class="ip-disclaimer">場所と住人の物語はフィクション。語源のつながりは辞書でたどれます。</p>`;
    if(type==='shop') standalone.innerHTML=`<header class="ip-page-title"><small>WILD WORDS / THE STORE</small><h1>ご先祖、<br>連れて歩こう。</h1><p>六千年前の野生を、かばんにひとつ。<br>言葉の血筋ごと持ち歩く、ワイルドワードのグッズ。</p></header><div class="ip-category">KEY CHARMS <span>第１弾 / ３つの祖先</span></div><div class="ip-products">${people.map(card).join('')}</div><section class="ip-store-note"><h2>ただのヘンなやつ、ではありません。</h2><p>背面には祖先の語根と、その血筋を受け継ぐ英単語。<br>友だちに「それ何？」と聞かれたら、言葉の冒険のはじまり。</p><a href="etymopedia-wild.html#roots">祖先たちを知る ↗</a></section><p class="ip-disclaimer">商品化を想定したストアデザイン。掲載画像は完成品の写真ではありません。価格・仕様は企画案で、現在は購入できません。</p>`;
    if(type==='product') {
      const p=people.find(p=>p.id===new URLSearchParams(location.search).get('character'))||people[0];
      document.title=`${p.name} キーホルダー | WILD WORDS STORE`;
      standalone.innerHTML=`<p class="ip-breadcrumb"><a href="wildwords-shop.html">STORE</a> / KEY CHARMS / ${p.name}</p><section class="ip-product-detail"><div class="ip-merch" style="background:${p.color}"><span class="ip-ring" aria-hidden="true"></span>${img(p)}<span class="ip-product-stamp">WILD WORDS<br>KEY CHARM</span></div><div><small>THE LOST ANCESTORS / SERIES 01</small><h1>${p.name}<br>アクリルキーホルダー</h1><p class="ip-price">¥880 <small>税込・企画価格</small></p><p>かばんにぶら下がる、言葉のご先祖。<br>${p.family}。この言葉たちは、同じ一族。</p><label for="ipQuantity">数量</label><select id="ipQuantity"><option>1</option><option>2</option><option>3</option></select><button class="ip-button" disabled>販売準備中</button><p class="ip-disclaimer">商品化イメージ。注文・決済はまだ受け付けていません。</p><dl><dt>仕様案</dt><dd>透明アクリル / ナスカン付き</dd><dt>サイズ案</dt><dd>約60mm（キャラクターにより異なります）</dd><dt>裏面案</dt><dd>語根と英単語の系譜</dd></dl><a href="etymopedia-wild.html#/root/${p.id}">このキャラクターの祖先を調べる ↗</a></div></section><section class="ip-store-note"><h2>${p.place}から来ました。</h2><p>${p.story}</p><a href="wildwords-world.html#${p.id}">彼らの世界をのぞく ↗</a></section><div class="ip-products">${people.filter(x=>x!==p).map(card).join('')}</div>`;
    }
  } else { initHome();new MutationObserver(initHome).observe(document.getElementById('home'),{childList:true,subtree:true}); }
})();
