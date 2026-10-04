const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const game=fs.readFileSync(__dirname+'/game.js','utf8');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),scope);
const rows=scope.window.PICTURE_WORDS_CATALOG;
const plain=value=>JSON.parse(JSON.stringify(value));

function rewardContext(){
 const calls=[],panel={hidden:true,children:['old'],replaceChildren(){this.children=[];}};
 const entry={id:'book'},roundScene={status:'reviewed',entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
 const c={phase:'playing',entry,roundScene,sceneReadingHold:false,$:()=>panel,window:{IllustrationScenes:{render:(target,result)=>calls.push({target,result})}}};
 const start=game.indexOf('  function showRewardExplanation('),end=game.indexOf('\n  const shuffle',start);
 assert.ok(start>=0&&end>start);vm.runInNewContext(game.slice(start,end),c);
 return {c,panel,calls};
}

test('the already-verified explanation renders synchronously only for the solved current picture',()=>{
 const {c,panel,calls}=rewardContext();
 c.showRewardExplanation(c.entry);assert.equal(calls.length,0);assert.equal(panel.hidden,true);
 c.phase='solved';c.roundScene={status:'unavailable'};c.showRewardExplanation(c.entry);assert.equal(calls.length,0);
 c.roundScene={status:'reviewed',entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
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

test('every offered puzzle has the exact reviewed bilingual sense and artwork binding',()=>{
 const scenes=JSON.parse(fs.readFileSync(__dirname+'/../../data/generated-etymon/illustration-scenes.json'));
 const helper=require('../../shared/illustration-scenes.js'),gate=require('./reviewed-scenes.js');
 assert.ok(rows.length>0);assert.equal(rows.length,scope.window.PICTURE_WORDS_CATALOG_META.count);
 assert.equal(require('./difficulty.js').bilingualCatalog(rows).length,rows.length);
 assert.equal(gate.filterCatalog(rows).length,rows.length);
 for(const row of rows){
  assert.ok(gate.validRow(row),row.id);
  const entry=helper.find(scenes,row.sceneBinding,row.pic);assert.ok(entry,row.id);
  assert.equal(entry.review.status,'reviewed');assert.equal(entry.status||entry.review.status,'reviewed');
  assert.ok(helper.firstSenseMatches(entry,row.sceneBinding));assert.equal(row.en,row.sceneBinding.w);
  assert.equal(row.reviewedScene.w,entry.w);assert.equal(row.reviewedScene.art,entry.art);
  assert.deepEqual(plain(row.reviewedScene.p),entry.p);assert.deepEqual(plain(row.reviewedScene.sense),entry.sense);
  assert.deepEqual(plain(row.reviewedScene.scene),entry.scene);assert.deepEqual(plain(row.reviewedScene.image),entry.image);
 }
 const means=rows.filter(row=>row.en==='mean');assert.equal(means.length,1);
 assert.equal(means[0].pic,'mean@medhyo');assert.equal(means[0].reviewedScene.sense.en,'average');
 assert.ok(rows.some(row=>row.en==='energy'&&row.w==='かつりょく'));
});

test('missing, unreviewed, mismatched or empty scene records cannot be restored as puzzles',()=>{
 const gate=require('./reviewed-scenes.js'),valid=plain(rows[0]);
 const invalid=[
  row=>{delete row.reviewedScene;}, row=>{row.reviewedScene.status='pending';},
  row=>{row.reviewedScene.scene.en='';},row=>{row.reviewedScene.scene.ja='';},
  row=>{row.reviewedScene.scene.en='This is '+row.en+'.';},
  row=>{row.reviewedScene.p=['wrong-root'];},row=>{row.sceneBinding.en='wrong sense';},
  row=>{row.pic='wrong-art';},row=>{row.sceneAsset='picture-words/scene-assets/wrong.js';}
 ].map(mutate=>{const row=plain(valid);mutate(row);return row;});
 assert.equal(gate.filterCatalog([valid]).length,1);
 for(const row of invalid){assert.equal(gate.validRow(row),false);assert.equal(gate.filterCatalog([row]).length,0);}
 assert.equal(gate.filterCatalog([valid,plain(valid)]).length,0);
});

test('correct-answer narration uses the verified sentence synchronously before reward timers',()=>{
 const start=game.indexOf('  function win() {'),end=game.indexOf("    $('rankUp').hidden",start);
 assert.ok(start>=0&&end>start);const prefix=game.slice(start,end)+'\n  }';
 for(const mode of ['en','ja']){
  const calls=[],entry={id:'book'},roundScene={status:'reviewed',entry:{scene:{en:'An open book.',ja:'開いた本。'}}};
  const c={entry,roundScene,mode,speech:{speakScene:(...args)=>calls.push(args)}};
  vm.runInNewContext(prefix,c);c.win();assert.equal(calls.length,1);assert.deepEqual(calls[0],[entry,roundScene,mode]);
  c.roundScene=null;c.win();assert.equal(calls.length,1);
  c.roundScene={status:'unavailable'};c.win();assert.equal(calls.length,1);
 }
 assert.doesNotMatch(prefix,/await|later\(|setTimeout\(|explanationFor\(/);
});

test('Listen is disabled before answering and replays only a verified solved description',()=>{
 const controls={listenClue:{setAttribute(){}},listenClueLabel:{}};
 const start=game.indexOf('  function updateLabels()'),end=game.indexOf("    $('shuffle').setAttribute",start);
 const prefix=game.slice(start,end)+'\n  }';
 const c={phase:'playing',mode:'en',roundScene:{status:'reviewed'},saved:{sound:true},$:id=>controls[id]};
 vm.runInNewContext(prefix,c);c.updateLabels();assert.equal(controls.listenClue.disabled,true);
 c.phase='solved';c.updateLabels();assert.equal(controls.listenClue.disabled,false);
 c.saved.sound=false;c.updateLabels();assert.equal(controls.listenClue.disabled,true);
 c.saved.sound=true;c.roundScene=null;c.updateLabels();assert.equal(controls.listenClue.disabled,true);
 let handler;const calls=[];const entry={id:'book'},roundScene={status:'reviewed'};
 const h={entry,phase:'playing',mode:'en',roundScene,cluePlayback:false,speech:{speakScene:(...args)=>calls.push(args)},$:()=>({addEventListener:(_,fn)=>handler=fn})};
 vm.runInNewContext(game.slice(game.indexOf("  $('listenClue').addEventListener"),game.indexOf("  $('hint').addEventListener")),h);
 handler();assert.equal(calls.length,0);assert.equal(h.cluePlayback,false);
 h.phase='solved';handler();assert.deepEqual(calls,[[entry,roundScene,'en']]);assert.equal(h.cluePlayback,true);
});

test('every offered puzzle waits for the existing Next control rather than automatic advance',()=>{
 const {c}=rewardContext();c.phase='solved';let schedules=0;
 Object.assign(c,{REWARD_DURATION:3000,pauseAdvance(){},document:{hidden:false},advanceTimers:[],later(){schedules++;return 1}});
 const start=game.indexOf('  function queueAdvance('),end=game.indexOf('\n  function ',start+5);
 vm.runInNewContext(game.slice(start,end),c);
 for(const row of rows){
  c.entry=row;c.roundScene={status:'reviewed',entry:row.reviewedScene};c.sceneReadingHold=false;
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
