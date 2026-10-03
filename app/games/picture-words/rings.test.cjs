const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const { planLetters, canSelectRing, activeBatch, advanceSelection, sweptHits } = require('./gesture.js');
const { buildCatalog, challenge } = require('./difficulty.js');
const scope = { window: {} }; vm.runInNewContext(fs.readFileSync(require.resolve('./catalog.js'), 'utf8'), scope);

test('GLASSES shows all three S letters together; longer words never have a lone outer letter', () => {
  const words = buildCatalog(scope.window.PICTURE_WORDS_CATALOG);
  const glasses = words.find(word => word.en === 'glasses');
  const profile = challenge(glasses, 'en');
  const plan = planLetters([...'GLASSES'], [], profile.innerCount, profile.dual);
  assert.equal(plan.batches.length,1);
  assert.equal(plan.letters.filter(node=>node.char==='S').length,3);
  for (const word of words) {
    const p=challenge(word,'en');
    if(p.dual) assert.ok(p.length-p.innerCount >= 4);
  }
});

test('honeycomb targets remain separated, inside the board and fixed between phases', () => {
  const code=fs.readFileSync(require.resolve('./game.js'),'utf8');
  const fn=code.slice(code.indexOf('  function letterPositions('),code.indexOf('  function layoutNodes('));
  const context={};vm.runInNewContext(fn,context);
  for(let length=2;length<=14;length++){
    const dual=length>8,inner=dual?Math.min(6,Math.ceil(length/2)):length;
    const points=[...context.letterPositions(inner,0,dual,length),...(dual?context.letterPositions(length-inner,1,dual,length):[])];
    for(const p of points){
      assert.ok(p.x>=33&&p.x<=327&&p.y>=33&&p.y<=327);
      for(const q of points)if(p!==q)assert.ok(Math.hypot(p.x-q.x,p.y-q.y)>=59);
    }
    assert.equal(new Set(points.map(p=>`${p.x},${p.y}`)).size,length);
  }
});
test('every answer is complete in one or two rings, without paging or hiding letters', () => {
  for (const word of buildCatalog(scope.window.PICTURE_WORDS_CATALOG)) for (const language of ['ja','en']) {
    if (language === 'ja' && !word.w) continue;
    const answer = [...(language === 'ja' ? word.w : word.en.toUpperCase())], profile = challenge(word, language);
    const { letters, batches } = planLetters(answer, Array(profile.decoys).fill('X'), profile.innerCount, profile.dual);
    let path = [];
    assert.equal(batches.length, answer.length > 8 ? 2 : 1);
    assert.ok(letters.filter(n => n.batch === 0).length <= 8);
    assert.ok(letters.filter(n => n.batch === 1).length <= 8);
    assert.equal(letters.filter(n => n.answerIndex >= 0).length, answer.length);
    for (let index = 0; index < answer.length; index++) {
      const node = letters.find(n => n.answerIndex === index); assert.ok(canSelectRing(node, path, batches));
      path = advanceSelection(path, node.id, answer.length);
    }
    assert.equal(path.map(id => letters.find(n => n.id === id).char).join(''), answer.join(''));
  }
});
test('outer letters stay locked until every inner letter is used; outer chords ignore previously selected inner hits', () => {
  const { letters, batches } = planLetters([...'GARLIC'], ['X','Y','Z'], 3, true);
  const outer = letters[3], inner = letters[1];
  assert.equal(canSelectRing(outer, [], batches), false);
  assert.equal(canSelectRing(outer, [0,1], batches), false);
  assert.equal(canSelectRing(outer, [0,1,2], batches), true);
  assert.equal(canSelectRing(inner, [0,1,2], batches), false);
  assert.equal(canSelectRing(inner, [0,1,2,3], batches), false);
  const positioned = [{ ...letters[3], x:0,y:0 }, { ...inner,x:50,y:0 }, { ...letters[4],x:100,y:0 }];
  let path=[0,1,2,3];
  for (const id of sweptHits(positioned,{x:0,y:0},{x:100,y:0},()=>8)) {
    if (canSelectRing(letters[id],path,batches)) path=advanceSelection(path,id,6);
  }
  assert.deepEqual(path,[0,1,2,3,4]);
});
test('undo can reopen an inner ring, while repeated letters remain separate nodes', () => {
  const { letters,batches }=planLetters([...'まんじょういっち'],[],4,true);
  const path=[0,1,2,3]; assert.equal(activeBatch(path,batches),1);
  path.pop(); assert.equal(activeBatch(path,batches),0); assert.ok(canSelectRing(letters[3],path,batches));
  const repeated=planLetters([...'UNPRECEDENTED'],[],6,true);
  assert.equal(new Set(repeated.letters.map(n=>n.id)).size,13);
});
test('TRANSFORMATION shows all fourteen required letters, including both N and O, from the start', () => {
  const {letters,batches}=planLetters([...'TRANSFORMATION'],['X','Y','Z','Q'],6,true);
  assert.deepEqual(batches.map(b=>b.length),[6,8]);
  assert.equal(letters.length,14);
  assert.equal(letters.filter(n=>n.char==='N').length,2);
  assert.equal(letters.filter(n=>n.char==='O').length,2);
  assert.ok(letters.every(n=>n.batch===0||n.batch===1));
  assert.equal(activeBatch(Array.from({length:12},(_,i)=>i),batches),1);
});

test('six tiles lie on a staggered hex lattice with equally spaced neighbours',()=>{
 const code=fs.readFileSync(require.resolve('./game.js'),'utf8'),ctx={};
 vm.runInNewContext(code.slice(code.indexOf('  function letterPositions('),code.indexOf('  function layoutNodes(')),ctx);
 const points=ctx.letterPositions(6,0,false,6),step=86;
 const rows=[...new Set(points.map(p=>p.y))].sort((a,b)=>a-b);
 assert.equal(rows.length,2);
 assert.ok(Math.abs(rows[1]-rows[0]-step*Math.sqrt(3)/2)<1e-8);
 const first=points.filter(p=>p.y===rows[0]),second=points.filter(p=>p.y===rows[1]);
 assert.ok(Math.abs(Math.abs(first[0].x-second[0].x)-step/2)<1e-8);
 for(const p of points)assert.ok(Math.abs(Math.min(...points.filter(q=>q!==p).map(q=>Math.hypot(q.x-p.x,q.y-p.y)))-step)<1e-8);
});

test('every size and shuffle has an adjacent one-stroke solution, with no reused cells',()=>{
 const {connectedPath,areNeighbours}=require('./gesture.js');
 const code=fs.readFileSync(require.resolve('./game.js'),'utf8'),ctx={};
 vm.runInNewContext(code.slice(code.indexOf('  function letterPositions('),code.indexOf('  function arrangeNodes(')),ctx);
 for(let length=2;length<=14;length++){
  const dual=length>8,inner=dual?Math.min(6,Math.ceil(length/2)):length;
  const cells=[...ctx.letterPositions(inner,0,dual,length),...(dual?ctx.letterPositions(length-inner,1,dual,length):[])];
  const step=length<=4?100:length<=8?86:68;
  for(let seed=1;seed<=100;seed++){
   let state=seed;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
   const route=connectedPath(cells,step,random);
   assert.equal(new Set(route.map(p=>`${p.x},${p.y}`)).size,length);
   for(let i=1;i<route.length;i++)assert.ok(areNeighbours(route[i-1],route[i],step));
  }
  assert.equal(areNeighbours({x:0,y:0},{x:step*2,y:0},step),false);
 }
});
