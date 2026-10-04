const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('quiz only requests reward explanation in solved path and clears on next puzzle',()=>{
 const game=fs.readFileSync(__dirname+'/game.js','utf8');
 const call=game.indexOf('    showRewardExplanation(entry);');
 assert(call>game.indexOf('  function win()'));
 assert(call<game.indexOf('  function ',game.indexOf('  function win()')+5));
 assert(game.includes("phase !== 'solved'"));
 assert(game.includes("sceneRequest++; sceneReadingHold = false; $('rewardExplanation').hidden = true; $('rewardExplanation').replaceChildren();"));
});

test('reviewed scene bindings never alter headwords, first-sense roots or art IDs',()=>{
 const scope={window:{}};vm.runInNewContext(fs.readFileSync(__dirname+'/catalog.js','utf8'),scope);
 const scenes=JSON.parse(fs.readFileSync(__dirname+'/../../data/generated-etymon/illustration-scenes.json'));
 const helper=require('../../shared/illustration-scenes.js');
 const rows=scope.window.PICTURE_WORDS_CATALOG;
 const bound=rows.filter(row=>row.sceneBinding);assert.equal(bound.length,115);
 for(const row of bound){
  const entry=helper.find(scenes,row.sceneBinding,row.pic);assert(entry,row.id);
  assert.equal(entry.review.status,'reviewed');assert(helper.firstSenseMatches(entry,row.sceneBinding));
  assert.equal(row.en,row.sceneBinding.w);
 }
 const playable=require('./difficulty.js').bilingualCatalog(rows).filter(row=>row.sceneBinding);
 assert.equal(playable.length,94);
 assert(bound.some(row=>row.en==='energy' && row.w==='かつりょく' && /^[0-9a-f]{64}$/.test(row.imageRevision)));
});

test('reviewed explanation waits for existing Next; normal rounds retain auto advance',()=>{
 const code=fs.readFileSync(__dirname+'/game.js','utf8');
 const start=code.indexOf('  function queueAdvance('),end=code.indexOf('\n  function ',start+5);
 let schedules=0;const c={REWARD_DURATION:3000,pauseAdvance(){},phase:'solved',sceneReadingHold:true,$:()=>({open:false}),document:{hidden:false},advanceTimers:[],later(){schedules++;return 1}};
 vm.runInNewContext(code.slice(start,end),c);
 c.queueAdvance();assert.equal(schedules,0);
 c.sceneReadingHold=false;c.queueAdvance();assert.equal(schedules,2);
 assert(code.includes("sceneReadingHold = result.status === 'reviewed'"));
 assert(code.includes('if (!sceneReadingHold) queueAdvance();'));
});

test('reward has one normal-flow Next outside the keyboard-scrollable content',()=>{
 const html=fs.readFileSync(__dirname+'/../picture-words.html','utf8');
 const css=fs.readFileSync(__dirname+'/../../shared/illustration-scenes.css','utf8');
 assert.equal((html.match(/id="advanceLabel"/g)||[]).length,1);
 assert(html.includes('id="rewardScroll" tabindex="0"'));
 assert(html.indexOf('id="rewardScroll"')<html.indexOf('id="rewardExplanation"'));
 assert(html.slice(html.indexOf('id="rewardExplanation"'),html.indexOf('id="advanceLabel"')).includes('</div>'));
 assert(css.includes('#rewardScene .advance-label{position:static;flex:0 0 auto'));
 assert(css.includes('#rewardScroll{flex:1 1 auto;min-height:0;overflow-y:auto'));
 assert(css.includes('.advance-label:focus-visible'));
});
