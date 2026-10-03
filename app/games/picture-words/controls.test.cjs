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
    layoutNodes:()=>layouts++,setFeedback:()=>{},text:()=>({mix:''}),
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

test('lifting a finger preserves partial answers and capture release cannot clear them',()=>{
  const start=code.indexOf("  $('wheel').addEventListener('pointerup'");
  const end=code.indexOf("  $('wheel').addEventListener('pointercancel'",start);
  let handler,updates=0,checked=0;
  const context={pointer:{id:3,last:{x:0,y:0}},wheelRect:{},selected:[0],answer:['A','B'],
    pointFrom:()=>({x:0,y:0}),sweep:()=>{},updateAnswer:()=>updates++,drawTrail:()=>{},setFeedback:()=>{},text:()=>({tap:''}),checkAnswer:()=>checked++,
    $:()=>({addEventListener:(_,fn)=>handler=fn,hasPointerCapture:()=>true,releasePointerCapture:()=>assert.equal(context.pointer,null),classList:{remove:()=>{}}})};
  vm.runInNewContext(code.slice(start,end),context);handler({pointerId:3});
  assert.equal(context.selected.length,1);assert.equal(updates,1);assert.equal(checked,0);
  context.pointer={id:4,last:{x:0,y:0}};context.selected=[0,1];handler({pointerId:4});assert.equal(checked,1);
});
