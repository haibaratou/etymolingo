const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const scenes=require('./reviewed-scenes.js');
const game=fs.readFileSync(__dirname+'/game.js','utf8');
const valid=()=>({id:'exact@composition',en:'book',w:'ほん',ja:'本',pic:'book',generatedImage:true,bindingStatus:'bound',image:{path:'assets/word/book.png',sha256:'a'.repeat(64),git_blob_sha:'b'.repeat(40)},availability:{en:{playable:true,answer:'book',reason:''},ja:{playable:true,answer:'ほん',reason:''}}});
function blocked(reason){const word=valid();for(const lang of ['en','ja'])word.availability[lang]={playable:false,answer:'',reason};word.issues=[{code:reason}];return word;}
const labels={ja:'画像の構図を確認中',en:'Image composition is under review'};
const generic={ja:'この問題は現在利用できません',en:'This puzzle is currently unavailable'};

test('composition hold gives the approved reason in each requested language without enabling or hiding it',()=>{
  const word=blocked('image_composition_defect'),before=JSON.stringify(word);
  for(const lang of ['ja','en']){
    assert.equal(scenes.unavailableReason(word,lang),labels[lang]);
    assert.equal(scenes.supportsLanguage(word,lang),false);
  }
  assert.equal(scenes.filterCatalog([word])[0],word);
  assert.equal(JSON.stringify(word),before);
});

test('unknown, absent and prototype-name codes produce neutral reasons in both languages',()=>{
  for(const reason of ['future_quality_issue','constructor','__proto__','toString','',undefined,null]){
    const word=blocked(reason),before=JSON.stringify(word);
    for(const lang of ['ja','en'])assert.equal(scenes.unavailableReason(word,lang),generic[lang]);
    assert.equal(JSON.stringify(word),before);
  }
});

test('known reading reasons and reading-length limitations retain their legitimate wording',()=>{
  for(const reason of ['reading_candidate','reading_needs_review','reading_missing','reading_unreviewed','first_reading_unavailable']){
    for(const lang of ['ja','en'])assert.equal(scenes.unavailableReason(blocked(reason),lang),'日本語の読みは未確認です');
  }
  assert.equal(scenes.unavailableReason(blocked('unsupported_japanese_answer_length'),'ja'),'この読みの文字数は未対応です');
  assert.equal(scenes.unavailableReason(blocked('known_image_mismatch'),'ja'),'画像と語義の対応を確認中です');
  assert.equal(scenes.unavailableReason({...blocked('future_quality_issue'),bindingStatus:'ownership_pending'},'ja'),'画像の対応確認中');
});

test('display language is independent of the unavailable puzzle language',()=>{
  for(const target of ['en','ja'])for(const display of ['en','ja']){
    assert.equal(scenes.unavailableReason(blocked('image_composition_defect'),target,display),labels[display]);
    assert.equal(scenes.unavailableReason(blocked('future_quality_issue'),target,display),generic[display]);
    assert.equal(scenes.unavailableReason(valid(),target,display),'');
  }
});

function launchStatus(word,requestedLanguage,mode){
  const elements={};
  const context={requestedWord:{present:true,index:-1,reason:'unavailable',wordId:word.id,language:requestedLanguage},catalog:[word],offline:{hasSavedScene:()=>false,state:{supported:true,online:true}},supports:(w,lang)=>scenes.supportsLanguage(w,lang),mode,datasetUnavailable:false,location:{protocol:'https:'},window:{WordBloomReviewedScenes:scenes},$:id=>elements[id]||=( {hidden:false,disabled:false,textContent:''})};
  const start=game.indexOf('  function updateOfflineStatus()');
  vm.runInNewContext(game.slice(start,game.indexOf("  $('saveOffline').addEventListener",start))+';updateOfflineStatus();',context);
  return elements;
}

test('exact-link error shows composition or generic text and dictionary guidance in the requested language',()=>{
  for(const reason of ['image_composition_defect','future_quality_issue'])for(const language of ['en','ja']){
    const word=blocked(reason),before=JSON.stringify(word);
    const elements=launchStatus(word,language,language==='en'?'ja':'en');
    assert.equal(elements.offlineStatus.textContent,(reason==='image_composition_defect'?labels:generic)[language]+(language==='ja'?'。辞典でこの画像を確認できます。':'. You can view this image in the dictionary.'));
    assert.equal(elements.startPlay.hidden,true);assert.equal(elements.startPlay.disabled,true);
    assert.equal(elements.saveOffline.hidden,true);assert.equal(elements.launchDifficulty.hidden,true);
    assert.equal(JSON.stringify(word),before);
  }
  assert.equal(launchStatus(blocked('image_composition_defect'),undefined,'ja').offlineStatus.textContent,labels.en+'. You can view this image in the dictionary.');
});

test('English exact-link requests preserve complete legacy image, format and reading messages',()=>{
  for(const [reason,label] of [['known_image_mismatch','画像と語義の対応を確認中です'],['image_first_sense_mismatch','画像と第一語義の対応を確認中です'],['unsupported_english_answer_format','このつづりの形式は未対応です'],['reading_unreviewed','日本語の読みは未確認です']]){
    assert.equal(launchStatus(blocked(reason),'en','en').offlineStatus.textContent,label+'。辞典でこの画像を確認できます。');
  }
});

test('unavailable language-toggle title uses current UI language while retaining the new tappable behavior',()=>{
  const start=game.indexOf('  function updateLabels()'),end=game.indexOf('\n  }',start)+4;
  for(const mode of ['en','ja'])for(const phase of ['playing','answer-demo','solved'])for(const reason of ['image_composition_defect','future_quality_issue','constructor','__proto__','toString']){
    const expected=(reason==='image_composition_defect'?labels:generic)[mode];
    const elements={};
    const context={entry:blocked(reason),mode,phase,window:{WordBloomReviewedScenes:scenes},document:{documentElement:{}},text:()=>({}),updateSound(){},updateTheme(){},updateLayout(){},$:id=>elements[id]||={dataset:{},setAttribute(k,v){this[k]=v;}}};
    vm.runInNewContext(game.slice(start,end)+';updateLabels();',context);
    assert.equal(elements.modeToggle.disabled,false);
    assert.equal(elements.modeToggle['aria-disabled'],'false');
    assert.equal(elements.modeToggle.dataset.unavailable,mode==='en'?'ja':'en');
    assert.equal(elements.modeToggle.title,expected);
    assert.equal(elements.modeToggle['aria-label'],expected+'。タップして理由を確認');
  }
});

test('dispatched blocked language-switch feedback uses current UI language and cannot change the row or mode',()=>{
  const start=game.indexOf("  document.querySelectorAll('[data-mode]').forEach"),end=game.indexOf("  $('retryImage').addEventListener",start);
  for(const mode of ['en','ja'])for(const phase of ['playing','answer-demo','solved'])for(const reason of ['image_composition_defect','future_quality_issue','constructor','__proto__','toString']){
    const expected=(reason==='image_composition_defect'?labels:generic)[mode];
    let handler,feedback;const word=blocked(reason),button={dataset:{mode:mode==='en'?'ja':'en'},addEventListener:(_,fn)=>handler=fn};
    const context={entry:word,mode,phase,window:{WordBloomReviewedScenes:scenes},document:{querySelectorAll:()=>[button]},setFeedback:message=>feedback=message};
    vm.runInNewContext(game.slice(start,end),context);handler();
    assert.equal(feedback,expected);assert.equal(context.mode,mode);assert.equal(context.entry,word);
  }
});

test('dictionary card and challenge call sites explicitly use the current selected UI language',()=>{
  assert.match(game,/subtitle\.textContent = playable \?[^\n]+unavailableReason\(word,lang,mode\)/);
  assert.match(game,/challenge\.textContent = challenge\.disabled \?[^\n]+unavailableReason\(word, challengeLang, mode\)/);
});
