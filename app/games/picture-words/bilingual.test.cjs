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
test('first correct stroke retains picture and playing state; second calls win once',()=>{
 const round=bilingualRound('cat','ねこ'),nodes=[...'CAT'].map((char,id)=>({char,id}));let wins=0;
 const c={round,nodes,mode:'en',selected:[0,1,2],answer:round.answers.en,phase:'playing',entry:{pic:'cat'},finishLanguage,
  win:()=>wins++,sound:{win:()=>{}},speech:{speak:()=>{}},updateAnswer:()=>{},drawTrail:()=>{},setFeedback:()=>{},$:()=>({})};
 vm.runInNewContext(code.slice(code.indexOf('  function checkAnswer('),code.indexOf('  const praiseWords')),c);
 c.checkAnswer();assert.equal(wins,0);assert.equal(c.phase,'playing');assert.equal(c.entry.pic,'cat');assert.equal(c.mode,'ja');
 c.nodes=[...'ねこ'].map((char,id)=>({char,id}));c.selected=[0,1];c.checkAnswer();assert.equal(wins,1);
});

test('answer button demonstrates both complete routes once without submitting, then unlocks play',()=>{
 const round=bilingualRound('id','いど'),events=[],timers=[],buttons={hint:{},shuffle:{},game:{dataset:{}}};let handler;
 const nodes=['I','D','い','ど'].map((char,id)=>({char,lang:id<2?'en':'ja',answerIndex:id%2,button:{classList:{add:()=>events.push(char),remove:()=>{}}}}));
 const c={round,nodes,phase:'playing',shuffleBusy:false,comboEligible:true,cancelGesture:()=>{},resetSelection:()=>{},sound:{unlock:()=>{},hint:()=>{}},breakCombo:()=>{},setFeedback:()=>{},later:(fn,ms)=>timers.push({fn,ms}),$:id=>({...buttons[id],addEventListener:(_,fn)=>handler=fn})};
 vm.runInNewContext(code.slice(code.indexOf("  $('hint').addEventListener"),code.indexOf("  $('sound').addEventListener")),c);
 handler();assert.equal(round.answerViewed,true);assert.equal(c.phase,'answer-demo');assert.equal(c.comboEligible,false);
 timers.sort((a,b)=>a.ms-b.ms).forEach(t=>t.fn());assert.deepEqual(events,['I','D','い','ど']);
 assert.equal(c.phase,'playing');assert.equal(round.completed.en,false);assert.equal(round.completed.ja,false);
 assert.equal(round.hints.en,0);assert.equal(round.hints.ja,0);
});
test('assisted and independent awards accumulate separately and keep earlier history',()=>{
 const start=code.indexOf('    const record=saved.answerRecords[entry.id]');
 const end=code.indexOf("    for(const lang of ['en','ja'])",start);
 const c={saved:{answerRecords:{}},entry:{id:'id'},round:{answerViewed:true}};
 const record=code.slice(start,end);
 vm.runInNewContext('{'+record+'}',c);assert.equal(c.saved.answerRecords.id.assisted,1);
 c.round.answerViewed=false;vm.runInNewContext('{'+record+'}',c);
 assert.equal(c.saved.answerRecords.id.assisted,1);assert.equal(c.saved.answerRecords.id.independent,1);assert.equal(c.saved.answerRecords.id.last,'independent');
});
