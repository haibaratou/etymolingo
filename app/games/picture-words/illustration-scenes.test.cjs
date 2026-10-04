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
 const bound=rows.filter(row=>row.sceneBinding);assert.equal(bound.length,39);
 for(const row of bound){
  const entry=helper.find(scenes,row.sceneBinding,row.pic);assert(entry,row.id);
  assert.equal(entry.review.status,'reviewed');assert(helper.firstSenseMatches(entry,row.sceneBinding));
  assert.equal(row.en,row.sceneBinding.w);
 }
 const playable=require('./difficulty.js').bilingualCatalog(rows).filter(row=>row.sceneBinding);
 assert.equal(playable.length,18);
 assert(!bound.some(row=>row.en==='energy'));
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
