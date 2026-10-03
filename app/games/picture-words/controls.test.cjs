const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/game.js','utf8');
test('the illustration has no opposite-language answer or letter-count caption',()=>{
  const html=fs.readFileSync(__dirname+'/../picture-words.html','utf8');
  assert.doesNotMatch(html,/pictureCaption|picture-caption/);
  assert.doesNotMatch(code,/updateAnswerDisclosure|caption-mask|otherAnswer/);
  const hint=code.slice(code.indexOf("  $('hint').addEventListener"),code.indexOf("  $('sound').addEventListener"));
  assert.doesNotMatch(hint,/entry\.w|entry\.en|bilingualHint/);
});
test('central shuffle responds to a tap but ignores dragging and a live letter gesture',()=>{
  const handlers={};let layouts=0;
  const context={
    $:()=>({addEventListener:(name,fn)=>handlers[name]=fn}),
    phase:'playing',shuffleBusy:false,pointer:null,nodes:[{id:0},{id:1}],
    cancelGesture:()=>{},sound:{unlock:()=>{},mix:()=>{}},shuffle:items=>items.reverse(),
    arrangeNodes:()=>{},layoutNodes:()=>layouts++,setFeedback:()=>{},text:()=>({mix:''}),
    later:fn=>fn(),reducedMotion:{matches:true},
  };
  vm.runInNewContext(code.slice(code.indexOf('  let shuffleTap ='),code.indexOf("  $('listenClue').addEventListener")),context);
  handlers.pointerdown({clientX:10,clientY:10});
  handlers.pointermove({clientX:40,clientY:10});
  handlers.click({detail:1});assert.equal(layouts,0);
  handlers.pointerdown({clientX:10,clientY:10});handlers.click({detail:1});assert.equal(layouts,1);
  context.pointer={id:1};handlers.pointerdown({clientX:10,clientY:10});handlers.click({detail:1});assert.equal(layouts,1);
});

test('listening uses the current answer language without revealing letters or changing the puzzle',()=>{
  let handler;const calls=[];
  const entry={id:'glasses',en:'glasses',w:'めがね'};
  const context={$:()=>({addEventListener:(_,fn)=>handler=fn}),entry,mode:'en',phase:'playing',cluePlayback:false,
    speech:{stop:()=>{},speak:(...args)=>calls.push(args)}};
  const start=code.indexOf("  $('listenClue').addEventListener");
  vm.runInNewContext(code.slice(start,code.indexOf("  $('hint').addEventListener",start)),context);
  handler();context.mode='ja';handler();
  assert.deepEqual(calls,[[entry,'en',false,true],[entry,'ja',false,true]]);
  assert.equal(context.entry,entry);
});
test('reload changes the URL without deleting saved progress',()=>{
  let handler,target;
  const start=code.indexOf("  $('reloadGame').addEventListener");
  const end=code.indexOf('  const originalCatalog',start);
  vm.runInNewContext(code.slice(start,end),{
    $:()=>({addEventListener:(_,fn)=>handler=fn}),URL,Date,
    location:{href:'https://example.test/app/games/picture-words.html',replace:url=>target=url},
  });
  handler();assert.ok(new URL(target).searchParams.has('refresh'));
});

test('lifting a finger cancels an unfinished stroke; complete strokes still submit',()=>{
  const start=code.indexOf("  $('wheel').addEventListener('pointerup'");
  const end=code.indexOf("  $('wheel').addEventListener('pointercancel'",start);
  let handler,updates=0,checked=0;
  const context={pointer:{id:3,last:{x:0,y:0}},wheelRect:{},selected:[0],answer:['A','B'],
    pointFrom:()=>({x:0,y:0}),sweep:()=>{},resetSelection:()=>{context.selected=[];updates++;},updateAnswer:()=>updates++,drawTrail:()=>{},setFeedback:()=>{},text:()=>({tap:''}),checkAnswer:()=>checked++,
    $:()=>({addEventListener:(_,fn)=>handler=fn,hasPointerCapture:()=>true,releasePointerCapture:()=>assert.equal(context.pointer,null),classList:{remove:()=>{}}})};
  vm.runInNewContext(code.slice(start,end),context);handler({pointerId:3});
  assert.equal(context.selected.length,0);assert.equal(updates,1);assert.equal(checked,0);
  context.pointer={id:4,last:{x:0,y:0}};context.selected=[0,1];handler({pointerId:4});assert.equal(checked,1);
});

test('short rectangular boards map pointer Y to the same coordinates as visible letters',()=>{
 const start=code.indexOf('  function pointFrom('),end=code.indexOf('  function hitRadius(',start);
 const context={wheelRect:{left:10,top:100,width:320,height:120},boardHeight:135};
 vm.runInNewContext(code.slice(start,end),context);
 const p=context.pointFrom({clientX:170,clientY:160});assert.equal(p.x,180);assert.equal(p.y,67.5);
});
test('a released stroke has no remaining SVG trail',()=>{
 const elements={};const get=id=>elements[id]||(elements[id]={style:{},setAttribute:(k,v)=>elements[id][k]=v});
 const context={pointer:null,selected:[1],nodes:[{id:1,x:20,y:30}],$:get};
 const start=code.indexOf('  function drawTrail('),end=code.indexOf('  function resetSelection(',start);
 vm.runInNewContext(code.slice(start,end)+';drawTrail();',context);
 assert.equal(elements.trail.style.visibility,'hidden');assert.equal(elements.trailLine.points,'');assert.equal(elements.trailGlow.points,'');
});

test('selection refuses a non-neighbour, but allows the next adjacent cell',()=>{
 const {advanceSelection,areNeighbours}=require('./gesture.js');
 const nodes=[0,1,2].map(id=>({id,lang:'en',x:id*100,y:0,button:{hidden:false,classList:{remove:()=>{}}}}));
 const context={mode:'en',hintCount:0,tileStep:()=>100,round:{answers:{en:['A','B','C']},hints:{en:0},completed:{en:false}},phase:'playing',selected:[0],nodes,answer:['A','B','C'],ringBatches:[[0,1,2]],areNeighbours,advanceSelection,canSelectRing:()=>true,
  sound:{pick:()=>{}},vibrate:()=>{},petals:{burst:()=>{}},boardHeight:120,updateAnswer:()=>{},drawTrail:()=>{},$:()=>({getBoundingClientRect:()=>({left:0,top:0,width:360,height:120})})};
 const start=code.indexOf('  function selectNode('),end=code.indexOf('  function pauseAdvance(',start);
 vm.runInNewContext(code.slice(start,end),context);context.selectNode(2);assert.equal(context.selected.length,1);
 context.selectNode(1);context.selectNode(2);assert.deepEqual([...context.selected],[0,1,2]);
});
test('actual pointer handlers finish an adjacent stroke and erase cancelled selections',()=>{
 const g=require('./gesture.js'),ctx={};
 vm.runInNewContext(code.slice(code.indexOf('  function tileStep('),code.indexOf('  function arrangeNodes(')),ctx);
 for(const length of [3,6,14]){
  const dual=length>8,inner=dual?6:length,step=length<=4?100:length<=8?86:68;
  const cells=[...ctx.letterPositions(inner,0,dual,length),...(dual?ctx.letterPositions(length-inner,1,dual,length):[])];
  const route=g.connectedPath(cells,step),plan=g.planLetters(Array.from({length},(_,i)=>String(i)),[],inner,dual);
  const nodes=plan.letters.map((n,i)=>({...n,lang:'en',...route[i],button:{hidden:false,offsetWidth:step*.94,classList:{remove:()=>{}}}}));
  const handlers={};let result=null;
  const wheel={getBoundingClientRect:()=>({left:0,top:0,width:360,height:360}),addEventListener:(name,fn)=>handlers[name]=fn,
   setPointerCapture:()=>{},hasPointerCapture:()=>true,releasePointerCapture:()=>{},classList:{add:()=>{},remove:()=>{}}};
  const c={...g,tileStep:ctx.tileStep,mode:'en',hintCount:0,round:{answers:{en:plan.letters.map(n=>n.char)},hints:{en:0},completed:{en:false}},nodes,selected:[999],ringBatches:plan.batches,answer:plan.letters.map(n=>n.char),boardHeight:360,phase:'playing',shuffleBusy:false,pointer:null,wheelRect:null,
   $:()=>wheel,sound:{unlock:()=>{},pick:()=>{}},vibrate:()=>{},petals:{burst:()=>{}},updateAnswer:()=>{},drawTrail:()=>{},setFeedback:()=>{},text:()=>({}),
   resetSelection:()=>{c.selected=[];},checkAnswer:()=>{result=[...c.selected];}};
  vm.runInNewContext(code.slice(code.indexOf('  function selectNode('),code.indexOf('  function pauseAdvance(')),c);
  vm.runInNewContext(code.slice(code.indexOf('  function pointFrom('),code.indexOf("  $('wheel').addEventListener('pointercancel'")),c);
  const event=(p)=>({clientX:p.x,clientY:p.y,pointerId:1,isPrimary:true,button:0,pointerType:'touch',target:{closest:()=>null},preventDefault:()=>{}});
  handlers.pointerdown(event(route[0]));assert.deepEqual([...c.selected],[0]);
  handlers.pointermove(event(route[1]));handlers.pointerup(event(route[1]));assert.equal(c.selected.length,0);assert.equal(c.pointer,null);
  handlers.pointerdown(event(route[0]));for(const p of route.slice(1))handlers.pointermove(event(p));handlers.pointerup(event(route.at(-1)));
  assert.deepEqual(result,Array.from({length},(_,i)=>i));
 }
});

test('even a live pointer with selected hexes never draws a line or finger tip',()=>{
 const source=fs.readFileSync(require.resolve('./game.js'),'utf8');
 const elements={trail:{style:{}},trailLine:{setAttribute(k,v){this[k]=v}},trailGlow:{setAttribute(k,v){this[k]=v}}};
 const c={pointer:{id:1},selected:[0,1],nodes:[{id:0,x:10,y:10},{id:1,x:20,y:20}],$:id=>elements[id]};
 vm.runInNewContext(source.slice(source.indexOf('  function drawTrail('),source.indexOf('  function resetSelection(')),c);
 c.drawTrail({x:200,y:200});assert.equal(elements.trail.style.visibility,'hidden');assert.equal(elements.trailLine.points,'');assert.equal(elements.trailGlow.points,'');
});
