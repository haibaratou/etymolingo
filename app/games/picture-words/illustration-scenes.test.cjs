const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const game=fs.readFileSync(__dirname+'/game.js','utf8');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),scope);
const rows=scope.window.PICTURE_WORDS_CATALOG;
const plain=value=>JSON.parse(JSON.stringify(value));

function rewardContext(){
 const calls=[],panel={hidden:true,children:['old'],replaceChildren(){this.children=[];}};
 const entry={id:'book'},roundScene={status:'reviewed',playable:true,ttsAllowed:true,entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
 const c={phase:'playing',entry,roundScene,sceneReadingHold:false,renderExplanation:(target,result)=>calls.push({target,result}),$:()=>panel,window:{IllustrationScenes:{render:(target,result)=>calls.push({target,result})}}};
 const start=game.indexOf('  function showRewardExplanation('),end=game.indexOf('\n  const shuffle',start);
 assert.ok(start>=0&&end>start);vm.runInNewContext(game.slice(start,end),c);
 return {c,panel,calls};
}

test('the already-verified explanation renders synchronously only for the solved current picture',()=>{
 const {c,panel,calls}=rewardContext();
 c.showRewardExplanation(c.entry);assert.equal(calls.length,0);assert.equal(panel.hidden,true);
 c.phase='solved';c.roundScene={status:'unavailable'};c.showRewardExplanation(c.entry);assert.equal(calls.length,0);
 c.roundScene={status:'reviewed',playable:true,ttsAllowed:true,entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
 c.showRewardExplanation({id:'stale-picture'});assert.equal(calls.length,0);assert.equal(panel.hidden,true);
 const returned=c.showRewardExplanation(c.entry);
 assert.equal(returned,undefined);assert.equal(calls.length,1);assert.equal(calls[0].result,c.roundScene);
 assert.equal(panel.hidden,false);assert.equal(c.sceneReadingHold,true);
 assert.ok(game.indexOf('    showRewardExplanation(entry);')>game.indexOf('  function win()'));
});

test('moving to another puzzle clears the prior verified explanation and reading hold',()=>{
 const panel={hidden:false,children:['old'],replaceChildren(){this.children=[];}};
 const c={sceneRequest:7,roundScene:{status:'reviewed'},sceneReadingHold:true,$:()=>panel};
 const start=game.indexOf('    sceneRequest++; roundScene = null;'),end=game.indexOf('\n    index =',start);
 assert.ok(start>=0&&end>start);vm.runInNewContext(game.slice(start,end),c);
 assert.equal(c.sceneRequest,8);assert.equal(c.roundScene,null);assert.equal(c.sceneReadingHold,false);
 assert.equal(panel.hidden,true);assert.deepEqual(panel.children,[]);
});

test('all rows keep image eligibility; captions separately require exact reviewed binding',()=>{
 const gate=require('./reviewed-scenes.js');assert.equal(gate.filterCatalog(rows).length,rows.length);
 for(const row of rows)if(row.description.status==='reviewed'){assert.ok(gate.validCaption(row),row.id);assert.equal(row.en,row.reviewedScene.w);}
 const original=rows.find(row=>gate.validCaption(row));
 for(const mutate of [row=>delete row.reviewedScene,row=>row.reviewedScene.status='pending',row=>row.reviewedScene.scene.en='',row=>row.reviewedScene.p=['wrong']]){const row=plain(original);mutate(row);assert.equal(gate.validRow(row),true);assert.equal(gate.validCaption(row),false);}
});
test('correct-answer narration uses the verified sentence synchronously before reward timers',()=>{
 const start=game.indexOf('  function win() {'),end=game.indexOf("    $('rankUp').hidden",start);
 assert.ok(start>=0&&end>start);const prefix=game.slice(start,end)+'\n  }';
 for(const mode of ['en','ja']){
  const calls=[],entry={id:'book'},roundScene={status:'reviewed',playable:true,ttsAllowed:true,entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
  const c={entry,roundScene,mode,speech:{speakScene:(...args)=>calls.push(args)}};
  vm.runInNewContext(prefix,c);c.win();assert.equal(calls.length,1);assert.deepEqual(calls[0],[entry,roundScene,mode]);
  c.roundScene=null;c.win();assert.equal(calls.length,1);
  c.roundScene={status:'unavailable'};c.win();assert.equal(calls.length,1);
 }
 assert.doesNotMatch(prefix,/await|later\(|setTimeout\(|explanationFor\(/);
});

test('word audio is enabled during play independently of description readiness and automatic sound',()=>{
 const controls={listenClue:{setAttribute(){}},listenClueLabel:{}};
 const start=game.indexOf('  function updateLabels()'),end=game.indexOf("    $('shuffle').setAttribute",start);
 const c={entry:{id:'book'},phase:'playing',mode:'en',saved:{sound:false},$:id=>controls[id]};
 vm.runInNewContext(game.slice(start,end)+'\n  }',c);
 c.updateLabels();assert.equal(controls.listenClue.disabled,false);
 c.phase='solved';c.updateLabels();assert.equal(controls.listenClue.disabled,false);
 c.phase='loading';c.updateLabels();assert.equal(controls.listenClue.disabled,true);
});

test('every offered puzzle waits for the existing Next control rather than automatic advance',()=>{
 const {c}=rewardContext();c.phase='solved';let schedules=0;
 Object.assign(c,{REWARD_DURATION:3000,pauseAdvance(){},document:{hidden:false},advanceTimers:[],later(){schedules++;return 1}});
 const start=game.indexOf('  function queueAdvance('),end=game.indexOf('\n  function ',start+5);
 vm.runInNewContext(game.slice(start,end),c);
 for(const row of rows){
  c.entry=row;c.roundScene={status:'reviewed',playable:true,ttsAllowed:true,entry:row.reviewedScene};c.sceneReadingHold=false;
  c.showRewardExplanation(row);c.queueAdvance();assert.equal(c.sceneReadingHold,true,row.id);
 }
 assert.equal(schedules,0);
 let handler;const loads=[];const n={phase:'solved',mode:'ja',index:2,nextUncollected:(mode,index)=>{assert.equal(mode,'ja');assert.equal(index,2);return 7;},loadLevel:(...args)=>loads.push(args),$:()=>({addEventListener:(_,fn)=>handler=fn})};
 const line=game.split('\n').find(line=>line.includes("$('advanceLabel').addEventListener"));assert.ok(line);
 vm.runInNewContext(line,n);handler();assert.deepEqual(loads,[[7,true,true]]);
 n.phase='playing';handler();assert.equal(loads.length,1);
});

test('reward has one normal-flow Next outside the keyboard-scrollable content',()=>{
 const html=fs.readFileSync(__dirname+'/../picture-words.html','utf8');
 const css=fs.readFileSync(__dirname+'/../../shared/illustration-scenes.css','utf8');
 assert.equal((html.match(/id="advanceLabel"/g)||[]).length,1);
 assert.ok(html.includes('id="rewardScroll" tabindex="0"'));
 assert.ok(html.indexOf('id="rewardScroll"')<html.indexOf('id="rewardExplanation"'));
 assert.ok(html.slice(html.indexOf('id="rewardExplanation"'),html.indexOf('id="advanceLabel"')).includes('</div>'));
 assert.ok(css.includes('#rewardScene .advance-label{position:static;flex:0 0 auto'));
 assert.ok(css.includes('#rewardScroll{flex:1 1 auto;min-height:0;overflow-y:auto'));
 assert.ok(css.includes('.advance-label:focus-visible'));
});


test('missing, stale and held captions display the exact honest label and never a substitute definition',()=>{
 const nodes=[],panel={dataset:{},classList:{add(){}},replaceChildren(){nodes.length=0;},append(node){nodes.push(node);}};
 const c={document:{createElement:()=>({})},window:{IllustrationScenes:{render:()=>{throw Error('Unreviewed caption must not render');}}}};
 const start=game.indexOf('  function renderExplanation('),end=game.indexOf('  function showRewardExplanation(',start);
 vm.runInNewContext(game.slice(start,end),c);
 for(const status of ['missing','stale','held']){c.renderExplanation(panel,{status,playable:true,ttsAllowed:false,entry:{scene:{en:'Do not speak this definition'}}});assert.equal(nodes.length,1);assert.equal(nodes[0].textContent,'解説未作成');assert.equal(panel.dataset.sceneStatus,status);}
});
test('missing captions still complete the win but never request automatic word or scene speech',()=>{
 const start=game.indexOf('  function win() {'),end=game.indexOf("    $('rankUp').hidden",start);
 const prefix=game.slice(start,end)+'\n return "continue-winning"; }';
 const c={entry:{id:'said'},roundScene:{status:'missing',playable:true,ttsAllowed:false},mode:'en',speech:{speakScene:()=>{throw Error('No caption speech');},speak:()=>{throw Error('No word fallback');}}};
 vm.runInNewContext(prefix,c);assert.equal(c.win(),'continue-winning');c.roundScene={status:'unavailable',playable:false};assert.equal(c.win(),undefined);
});
