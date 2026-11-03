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
