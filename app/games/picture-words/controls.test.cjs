const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(__dirname+'/game.js','utf8');
test('central shuffle responds to a tap but ignores dragging and a live letter gesture',()=>{
  const handlers={};let layouts=0;
  const context={
    $:()=>({addEventListener:(name,fn)=>handlers[name]=fn}),
    phase:'playing',shuffleBusy:false,pointer:null,nodes:[{id:0},{id:1}],
    cancelGesture:()=>{},sound:{unlock:()=>{},mix:()=>{}},shuffle:items=>items.reverse(),
    layoutNodes:()=>layouts++,setFeedback:()=>{},text:()=>({mix:''}),
    later:fn=>fn(),reducedMotion:{matches:true},
  };
  vm.runInNewContext(code.slice(code.indexOf('  let shuffleTap ='),code.indexOf("  $('hint').addEventListener")),context);
  handlers.pointerdown({clientX:10,clientY:10});
  handlers.pointermove({clientX:40,clientY:10});
  handlers.click({detail:1});assert.equal(layouts,0);
  handlers.pointerdown({clientX:10,clientY:10});handlers.click({detail:1});assert.equal(layouts,1);
  context.pointer={id:1};handlers.pointerdown({clientX:10,clientY:10});handlers.click({detail:1});assert.equal(layouts,1);
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
