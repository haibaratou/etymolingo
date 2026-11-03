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
  if(items.length<6)throw Error('At least six distinct examples required');
  const W=Math.max(300,width),groups=[...new Set(items.flatMap(n=>n.languages))].sort((a,b)=>items.filter(n=>n.languages[0]===b).length-items.filter(n=>n.languages[0]===a).length||a.localeCompare(b));
  const primary=groups.map(language=>({language,items:items.filter(n=>n.languages[0]===language)}));
  let best=null;
  // Enumerate compact subtree packings and left/right partitions. A single
  // subtree naturally puts the character at the left; no language-name case.
  for(const image of (W<560?[44,40,32]:[72,64,56,48,40])){
   const nodeWidth=image+(W<560?28:40),nodeHeight=image+30,char=W<560?(image===32?64:70):128,hubRadius=W<560?15:22,gapX=W<560?14:26,gapY=W<560?32:42,linkGap=W<560?(image===32?12:18):42;
   const choices=primary.map(g=>!g.items.length?[{rows:0,cols:0,width:hubRadius*2,height:hubRadius*2}]:[1,2,3].filter(rows=>rows<=g.items.length).map(rows=>({rows,cols:Math.ceil(g.items.length/rows),width:Math.ceil(g.items.length/rows)*(nodeWidth+gapX)-gapX+hubRadius*2+linkGap,height:rows*(nodeHeight+gapY)-gapY+(rows===1&&g.items.length>1?gapY/2+hubRadius*2:0)})));
   const variants=[];function expand(i,arr){if(i===choices.length){variants.push(arr);return;}for(const c of choices[i])expand(i+1,[...arr,c]);}expand(0,[]);
   for(const shape of variants)for(const reverse of [false,true])for(let mask=0;mask<(1<<Math.min(primary.length,8));mask++){
    if(primary.length===1&&mask!==0)continue;
    const left=[],right=[];primary.forEach((g,i)=>((mask&(1<<i))?left:right).push({...g,...shape[i],index:i}));if(reverse){left.reverse();right.reverse();}
    const sideSize=arr=>({width:arr.length?Math.max(...arr.map(g=>g.width))+linkGap:0,height:arr.reduce((v,g)=>v+g.height,0)+Math.max(0,arr.length-1)*28});
    const L=sideSize(left),R=sideSize(right),totalW=L.width+char+R.width+24,H=Math.max(char+40,L.height,R.height)+24;
    if(totalW>W||H>(W<560?640:460))continue;
    const start=(W-totalW)/2+12,cx=start+L.width+char/2,cy=H/2-16,nodes=[],hubs=[];
    for(const[side,arr,size]of[[-1,left,L],[1,right,R]]){
     let y=(H-size.height)/2;
     for(const g of arr){const hy=!g.items.length?y+g.height/2:g.rows>1?y+nodeHeight+gapY/2:g.items.length>1?y+nodeHeight+gapY/2+hubRadius:y+g.height/2-10,hx=cx+side*(char/2+linkGap+hubRadius);hubs.push({language:g.language,x:hx,y:hy,side,angle:side<0?Math.PI:0,count:g.items.length});
      g.items.forEach((item,i)=>{const row=i%g.rows,col=Math.floor(i/g.rows),x=hx+side*(hubRadius+linkGap+nodeWidth/2+col*(nodeWidth+gapX)),imageY=y+row*(nodeHeight+gapY)+image/2;nodes.push({...item,slot:nodes.length,x,y:imageY,side,row,col,primaryLanguage:g.language});});
      y+=g.height+28;
     }
    }
    // Reduce height and excess line lengths without shrinking images unless
    // the larger measured boxes cannot fit. Prefer balanced subtree heights.
    let score=H*5+Math.abs(L.height-R.height)*.12+(72-image)*20;
    for(const h of hubs)score+=Math.hypot(h.x-cx,h.y-cy)*.25;
    for(const n of nodes)for(const language of n.languages){const h=hubs.find(h=>h.language===language);if(h){score+=dist(h,n)*.03;if(n.primaryLanguage!==language&&hit(h,n,{left:cx-char*.55,right:cx+char*.55,top:cy-char*.55,bottom:cy+char*.55+36}))score+=2500;}else score+=500;}
    if(!best||score<best.score)best={nodes,hubs,score,width:W,height:H,image,nodeWidth,char,hubRadius,cx,cy:Math.max(char*.54+10,Math.min(H-char*.54-38,hubs.reduce((v,h)=>v+h.y*h.count,0)/items.length)),gapX};
   }
  }
  if(!best)throw Error('Viewport too small for this graph');
  // A language used only as a secondary component still has one real hub.
  for(const language of groups)if(!best.hubs.some(h=>h.language===language)){
   const linked=best.nodes.filter(n=>n.languages.includes(language));const near=best.hubs.find(h=>h.language===linked[0].primaryLanguage);best.hubs.push({language,x:near.x,y:near.y-best.hubRadius*2-8,side:near.side,angle:near.angle,count:linked.length});
  }
  return best;
 }
 function curvePoints(a,c1,c2,b){return Array.from({length:25},(_,i)=>{const t=i/24,u=1-t;return{x:u*u*u*a.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*b.x,y:u*u*u*a.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*b.y};});}
 function curvedRoute(a,b,out,obstacles,previous=[],bounds=null){
  const inside=p=>!bounds||(p.x>=0&&p.x<=bounds.width&&p.y>=0&&p.y<=bounds.height);
  const length=dist(a,b),u={x:Math.cos(out),y:Math.sin(out)},v={x:(b.x-a.x)/length,y:(b.y-a.y)/length};let best=null;
  for(const f of [.28,.42,.58,.76])for(const end of [.18,.32,.48]){
   const c1={x:a.x+u.x*length*f,y:a.y+u.y*length*f},c2={x:b.x-v.x*length*end,y:b.y-v.y*length*end},points=curvePoints(a,c1,c2,b);
   if(points.some(p=>!inside(p))||points.some((p,i)=>i&&obstacles.some(r=>hit(points[i-1],p,r))))continue;
   let score=points.reduce((v,p,i)=>v+(i?dist(p,points[i-1]):0),0);for(let i=1;i<points.length;i++)for(const e of previous)if(cross(points[i-1],points[i],...e))score+=60;
   if(!best||score<best.score)best={score,points,d:`M ${a.x} ${a.y} C ${c1.x} ${c1.y},${c2.x} ${c2.y},${b.x} ${b.y}`};
  }
  if(best)return best;
  const expanded=obstacles.map(r=>({left:r.left-9,right:r.right+9,top:r.top-9,bottom:r.bottom+9}));const via=route(a,b,expanded,previous,bounds);if(!via)return null;
  // Convert a collision-free corridor to a continuous cubic spline. Decrease
  // tension if necessary; never return hard-edged SVG line segments.
  for(const tension of [.22,.14,.07,.025]){let d=`M ${a.x} ${a.y}`,points=[a];for(let i=0;i<via.length-1;i++){const p=via[i],q=via[i+1],before=via[Math.max(0,i-1)],after=via[Math.min(via.length-1,i+2)],c1={x:p.x+(q.x-before.x)*tension,y:p.y+(q.y-before.y)*tension},c2={x:q.x-(after.x-p.x)*tension,y:q.y-(after.y-p.y)*tension};for(const [c,anchor]of [[c1,p],[c2,q]]){const reach=dist(c,anchor),limit=dist(p,q)*.38;if(reach>limit){c.x=anchor.x+(c.x-anchor.x)*limit/reach;c.y=anchor.y+(c.y-anchor.y)*limit/reach;}}d+=` C ${c1.x} ${c1.y},${c2.x} ${c2.y},${q.x} ${q.y}`;points.push(...curvePoints(p,c1,c2,q).slice(1));}if(points.every(inside)&&!points.some((p,i)=>i&&obstacles.some(r=>hit(points[i-1],p,r))))return{d,points};}
  return null;
 }
 function route(a,b,obstacles,previous=[],bounds=null){
  // Visibility graph around expanded image/text/icon boxes. Length, bends and
  // existing crossings are costs; no branch may pass through an image or word.
  const points=[a,b];for(const r of obstacles)for(const x of [r.left,r.right])for(const y of [r.top,r.bottom])if(!bounds||(x>=0&&x<=bounds.width&&y>=0&&y<=bounds.height))points.push({x,y});
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
   const layout=plan(items,W);map.dataset.groupedSignature=signature;map.classList.add('groupedOrigins');map.style.height=layout.height+'px';map.querySelector('.rmCenter')?.style.setProperty('left',layout.cx+'px');map.querySelector('.rmCenter')?.style.setProperty('top',layout.cy+'px');map.style.setProperty('--group-char',layout.char+'px');map.style.setProperty('--group-node',layout.nodeWidth+'px');map.style.setProperty('--group-image',layout.image+'px');
   for(const n of layout.nodes){const node=nodes[n.id];node.style.setProperty('--group-x',n.x+'px');node.style.setProperty('--group-y',(n.y+10)+'px');node.dataset.layoutSlot=n.slot;}
   map.querySelectorAll('.originHub').forEach(n=>n.remove());
   for(const h of layout.hubs){const el=window.document.createElement('span');el.className='originHub';el.dataset.language=h.language;el.textContent=short(h.language);el.style.whiteSpace='pre-line';el.title=h.language;el.style.left=h.x+'px';el.style.top=h.y+'px';el.style.width=el.style.height=layout.hubRadius*2+'px';map.append(el);}
   const svg=map.querySelector('.rmLines');svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${W} ${layout.height}`);svg.style.width=W+'px';svg.style.height=layout.height+'px';
   const rects=layout.nodes.map(n=>({left:n.x-layout.nodeWidth/2-5,right:n.x+layout.nodeWidth/2+5,top:n.y-layout.image/2-5,bottom:n.y+layout.image/2+32,id:n.id}));
   const center={left:layout.cx-layout.char*.54-5,right:layout.cx+layout.char*.54+5,top:layout.cy-layout.char*.54-5,bottom:layout.cy+layout.char*.54+38};
   const hubRects=layout.hubs.map(h=>({left:h.x-layout.hubRadius-4,right:h.x+layout.hubRadius+4,top:h.y-layout.hubRadius-4,bottom:h.y+layout.hubRadius+4,language:h.language}));
   const previous=[];let failures=0;
   function path(points,attrs,curve){const el=window.document.createElementNS(NS,'path');el.setAttribute('d',curve||`M ${points[0].x} ${points[0].y} C ${points[0].x} ${points[0].y},${points.at(-1).x} ${points.at(-1).y},${points.at(-1).x} ${points.at(-1).y}`);el.setAttribute('fill','none');el.setAttribute('stroke','#777078');el.setAttribute('stroke-width','1.7');el.setAttribute('stroke-linejoin','round');el.setAttribute('stroke-linecap','round');for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);svg.append(el);}
   for(const h of layout.hubs){const side=h.side||Math.sign(h.x-layout.cx)||1,start={x:layout.cx+side*(layout.char*.60+5),y:Math.max(layout.cy-layout.char*.30,Math.min(layout.cy+layout.char*.30,h.y))},end={x:h.x-side*layout.hubRadius,y:h.y},reach=Math.max(2,Math.abs(end.x-start.x)*.5),c1={x:start.x+side*reach,y:start.y},c2={x:end.x-side*reach,y:end.y};path(curvePoints(start,c1,c2,end),{'data-trunk':h.language},`M ${start.x} ${start.y} C ${c1.x} ${c1.y},${c2.x} ${c2.y},${end.x} ${end.y}`);}

   for(const n of layout.nodes)for(const language of n.languages){const h=layout.hubs.find(h=>h.language===language);const dx=n.x-h.x,dy=n.y-h.y,len=Math.hypot(dx,dy);const a={x:h.x+dx/len*(layout.hubRadius+.75),y:h.y+dy/len*(layout.hubRadius+.75)};const own=rects.find(r=>r.id===n.id);const side=(n.side||Math.sign(n.x-layout.cx))<0?'right':'left',b={x:n.x+(side==='right'?1:-1)*(layout.image/2+5),y:n.y};const obstacles=[...rects.filter(r=>r!==own),center,...hubRects.filter(r=>r.language!==language)];let curve;
    if(n.primaryLanguage===language){
     const direction=n.side,pad=Math.min(18,layout.gapX/2),handle=Math.min(12,pad/2+3),bend=n.x-direction*(layout.nodeWidth/2+pad),start={x:h.x+direction*(layout.hubRadius+.75),y:h.y},joint={x:bend,y:h.y};
     const c1={x:bend+direction*handle,y:h.y},c2={x:bend+direction*handle,y:b.y};
     curve={d:`M ${start.x} ${start.y} C ${start.x} ${start.y},${joint.x} ${joint.y},${joint.x} ${joint.y} C ${c1.x} ${c1.y},${c2.x} ${c2.y},${b.x} ${b.y}`,points:[start,joint,...curvePoints(joint,c1,c2,b).slice(1)]};
     if(curve.points.some((p,i)=>i&&obstacles.some(r=>hit(curve.points[i-1],p,r))))curve=null;
    }
    if(!curve)curve=curvedRoute(a,b,n.primaryLanguage===language?h.angle:Math.atan2(b.y-a.y,b.x-a.x),obstacles,previous,{width:layout.width,height:layout.height});if(!curve){failures++;continue;}const points=curve.points;path(points,{'data-word':n.word,'data-language':language},curve.d);for(let i=1;i<points.length;i++)previous.push([points[i-1],points[i]]);}
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
 const api={plan,route,curvedRoute,curvePoints,hit,cross,install};if(typeof module==='object'&&module.exports){if(module.exports.create)module.exports.rootMap=api;else module.exports=api;}
 else{scope.EtymopediaRootMap=api;const prior=scope.EtymopediaLearning.bind;scope.EtymopediaLearning.bind=function(...args){const result=prior.apply(this,args);install(scope,scope.etymopediaLevels);return result;};}
})(typeof globalThis==='object'?globalThis:this);
