const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {bilingualRound,finishLanguage,connectedPath,areNeighbours}=require('./gesture.js');
const code=fs.readFileSync(__dirname+'/game.js','utf8');
test('either language can be first; only both answers clear a fresh round',()=>{
 for(const order of [['en','ja'],['ja','en']]){
  const round=bilingualRound('cat','ねこ');assert.equal(finishLanguage(round,order[0],'wrong'),'incorrect');
  assert.equal(finishLanguage(round,order[0],round.answers[order[0]].join('')),'partial');
  assert.equal(round.completed[order[1]],false);
  assert.equal(finishLanguage(round,order[1],round.answers[order[1]].join('')),'complete');
  assert.equal(finishLanguage(round,order[1],round.answers[order[1]].join('')),'incorrect');
 }
});
test('both language groups have their own adjacent path at every combined size',()=>{
 const c={};vm.runInNewContext(code.slice(code.indexOf('  function tileStep('),code.indexOf('  function arrangeNodes(')),c);
 for(let en=2;en<=14;en++)for(let ja=2;ja<=14;ja++){
  const n=en+ja,step=c.tileStep(n),cells=c.letterPositions(n,0,false,n),path=connectedPath(cells,step);
  assert.equal(path.length,n);assert.equal(new Set(path.map(p=>`${p.x},${p.y}`)).size,n);
  for(const group of [path.slice(0,en),path.slice(en)])for(let i=1;i<group.length;i++)assert.ok(areNeighbours(group[i-1],group[i],step));
 }
});

test('one correct language immediately wins without completing the other',()=>{
 for(const mode of ['en','ja']){
 const round=bilingualRound('id','いど');let wins=0;
 const c={round,mode,nodes:round.answers[mode].map((char,id)=>({char,id})),selected:[0,1],answer:round.answers[mode],phase:'playing',finishLanguage,win:()=>wins++};
 vm.runInNewContext(code.slice(code.indexOf('  function checkAnswer('),code.indexOf('  const praiseWords')),c);
 c.checkAnswer();assert.equal(wins,1);assert.equal(round.completed[mode==='en'?'ja':'en'],false);
 }
});
test('answer demonstrates only the active language and records viewing only for it',()=>{
 for(const mode of ['en','ja']){
 const round=bilingualRound('id','いど');round.viewed={en:false,ja:false};const events=[],timers=[];let handler;
 const nodes=['I','D','い','ど'].map((char,id)=>({char,lang:id<2?'en':'ja',answerIndex:id%2,button:{classList:{add:()=>events.push(char),remove:()=>{}}}}));
 const c={mode,round,nodes,phase:'playing',shuffleBusy:false,comboEligible:true,cancelGesture:()=>{},resetSelection:()=>{},sound:{unlock:()=>{},hint:()=>{}},breakCombo:()=>{},setFeedback:()=>{},later:(fn,ms)=>timers.push({fn,ms}),$:()=>({dataset:{},addEventListener:(_,fn)=>handler=fn})};
 vm.runInNewContext(code.slice(code.indexOf("  $('hint').addEventListener"),code.indexOf("  $('sound').addEventListener")),c);
 handler();timers.sort((a,b)=>a.ms-b.ms).forEach(t=>t.fn());assert.deepEqual(events,mode==='en'?['I','D']:['い','ど']);
 assert.equal(round.viewed[mode],true);assert.equal(round.viewed[mode==='en'?'ja':'en'],false);assert.equal(c.phase,'playing');
 }
});
test('records accumulate per language while preserving old combined history',()=>{
 const start=code.indexOf('    const wordRecords=saved.answerRecords[entry.id]');
 const end=code.indexOf('    saved[mode].stars',start);
 const c={mistakes:0,clearScore:(miss,viewed)=>Math.max(0,100-10*miss-(viewed?30:0)),saved:{answerRecords:{id:{independent:2,assisted:1}}},entry:{id:'id'},mode:'en',round:{viewed:{en:true,ja:false}}};
 const record=code.slice(start,end);
 vm.runInNewContext('{'+record+'}',c);assert.equal(c.saved.answerRecords.id.en.assisted,1);
 c.mode='ja';vm.runInNewContext('{'+record+'}',c);
 assert.equal(c.saved.answerRecords.id.ja.independent,1);assert.equal(c.saved.answerRecords.id.en.independent,0);assert.equal(c.saved.answerRecords.id.assisted,1);
});


test('scores deduct only full wrong answers and charge a viewed answer once',()=>{
 const c={};vm.runInNewContext(code.slice(code.indexOf('  function clearScore('),code.indexOf('  function win()')),c);
 assert.equal(c.clearScore(0,false),100);assert.equal(c.clearScore(1,false),90);
 assert.equal(c.clearScore(0,true),70);assert.equal(c.clearScore(2,true),50);
 assert.equal(c.clearScore(20,true),0);
 assert.match(c.scoreStamp(100,false),/はなまる/);assert.match(c.scoreStamp(70,true),/答えを見た/);
});
