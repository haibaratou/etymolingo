const fs=require('fs'),vm=require('vm'),zlib=require('zlib'),crypto=require('crypto');
const path=require('path'),option=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
const root=path.resolve(option('--root')||path.join(__dirname,'../../..'));process.chdir(root);
const base=path.resolve(option('--report-dir')||path.join(root,'work/build-reports/picture-words'));fs.mkdirSync(base,{recursive:true});const scope={window:{}};
const files={catalog:'app/games/picture-words/catalog.js',cefr:'app/data/generated-etymon/learning-levels.js',custom:'app/data/generated-etymon/custom-learning-levels.js',scores:'app/data/generated-etymon/puzzle-visual-scores.js',eligibility:'app/data/generated-etymon/puzzle-eligibility.js',scenes:'app/data/generated-etymon/illustration-scenes.json'};
for(const k of ['catalog','cefr','custom','scores','eligibility'])vm.runInNewContext(fs.readFileSync(files[k],'utf8'),scope);
const rt=require(root+'/app/games/picture-words/reviewed-scenes.js'),learning=require(root+'/app/shared/custom-learning-levels.js').create(JSON.parse(zlib.gunzipSync(Buffer.from(scope.window.ETYMON_CUSTOM_LEARNING_LEVELS.data,'base64'))));
const rows=scope.window.PICTURE_WORDS_CATALOG,scores=new Map(scope.window.ETYMON_PUZZLE_VISUAL_SCORES.entries.map(e=>[e.id,e]));
const eligibility=JSON.parse(zlib.gunzipSync(Buffer.from(scope.window.ETYMON_PUZZLE_ENVELOPE.data,'base64'))),rules=new Map(eligibility.entries.map(e=>[e.id,e]));
const scenes=JSON.parse(fs.readFileSync(files.scenes)),byScene=new Map(scenes.entries.map(e=>[JSON.stringify([e.w,e.p,e.art]),e]));
const hash=(b,a='sha256')=>crypto.createHash(a).update(b).digest('hex');
if(hash(zlib.gunzipSync(Buffer.from(scope.window.ETYMON_CUSTOM_LEARNING_LEVELS.data,'base64')))!==scope.window.ETYMON_CUSTOM_LEARNING_LEVELS.sha256)throw Error('Custom learning checksum mismatch');
const sourceHashes=Object.fromEntries(Object.entries(files).map(([k,f])=>[k,{file:f,sha256:hash(fs.readFileSync(f))}]));
const counts=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,0])),excluded={},diagnostics={},entries=[],holds=[];let candidateCount=0;
function hold(w,why){excluded[why]=(excluded[why]||0)+1;holds.push({id:w.id,en:w.en,reason:why});}
for(const w of rows){
 const e=rules.get(w.id),level=learning.lookup(w),score=scores.get(w.id),scene=byScene.get(JSON.stringify([w.en,w.roots,w.pic]));
 const missingCaption=!scene?.scene?.en?.trim()||!scene?.scene?.ja?.trim();
 const captionMismatch=!missingCaption&&(scene.status!=='reviewed'||scene.image?.git_blob_sha!==w.image?.git_blob_sha||scene.sense?.sha256!==w.sense?.sha256);
 for(const [why,yes] of Object.entries({difficulty_unconfirmed:!level,image_unscored:!score,low_visual_score:score&&score.score<50,score_image_mismatch:score&&score.imageGitBlobSha!==w.image?.git_blob_sha,caption_missing:missingCaption,caption_mismatch:captionMismatch}))if(yes)diagnostics[why]=(diagnostics[why]||0)+1;
 if(e?.status!=='OK'||!rt.supportsLanguage(w,'en')||e.imageGitBlobSha!==w.image.git_blob_sha||e.senseSha256!==w.sense.sha256){hold(w,'existing_conditions');continue;}
 candidateCount++;
 if(!level){hold(w,'difficulty_unconfirmed');continue;}
 if(!score){hold(w,'image_unscored');continue;}
 if(score.w!==w.en||JSON.stringify(score.p||[])!==JSON.stringify(w.roots)||score.imagePath!==w.image.path||score.imageGitBlobSha!==w.image.git_blob_sha){hold(w,'score_image_mismatch');continue;}
 if(score.score<50){hold(w,'low_visual_score');continue;}
 if(missingCaption){hold(w,'caption_missing');continue;}
 if(captionMismatch){hold(w,'caption_mismatch');continue;}
 const reviewedScene={schema:1,status:'reviewed',w:scene.w,p:scene.p,art:scene.art,sense:scene.sense,scene:scene.scene,image:scene.image,review:scene.review};
 const description={status:'reviewed',en:scene.scene.en,ja:scene.scene.ja,reason:'',ttsAllowed:true};
 const updated={...w,reviewedScene,description};
 if(!rt.validCaption(updated)){hold(w,'caption_mismatch');continue;}
 const path=root+'/'+w.image.path;if(!fs.existsSync(path)){hold(w,'current_image_missing');continue;}
 const raw=fs.readFileSync(path),blob=hash(Buffer.concat([Buffer.from('blob '+raw.length+'\0'),raw]),'sha1');
 // Git's header contains a NUL byte.
 const actualBlob=hash(Buffer.concat([Buffer.from('blob '+raw.length),Buffer.from([0]),raw]),'sha1');
 if(actualBlob!==score.imageGitBlobSha||hash(raw)!==w.image.sha256){hold(w,'current_image_mismatch');continue;}
 counts[level.level]++;entries.push({id:w.id,customLearningLevel:{level:level.level,basis:level.basis,senseSha256:level.senseSha256},description,reviewedScene,visualReview:{score:score.score,imageGitBlobSha:score.imageGitBlobSha,rubricVersion:score.rubricVersion},currentImageGitBlobSha:actualBlob});
}
const report={schema:1,scheme:'custom-learning-hint',version:learning.data.ruleVersion,customSourceWordsSha256:learning.data.sourceWordsSha256,customProfileSha256:learning.data.profileSha256,threshold:50,sourceHashes,totalCatalog:rows.length,existingCandidateCount:candidateCount,eligible:entries.length,counts,excludedSequential:excluded,excludedOverlapping:diagnostics,scoreSourceEntries:scores.size,allEligibleImagesLocallyRehashed:true,scoreSourceVerification:'current published source SHA256 recorded; candidate images rehashed',prohibitedPieRead:false};
fs.writeFileSync(base+'/selection-report.json',JSON.stringify(report,null,2));fs.writeFileSync(base+'/selection-holds.json',JSON.stringify(holds,null,2));
fs.writeFileSync(base+'/level-examples.json',JSON.stringify(Array.from({length:10},(_,i)=>({level:i+1,examples:entries.filter(e=>e.customLearningLevel.level===i+1).map(e=>rows.find(w=>w.id===e.id)).sort((a,b)=>a.en.length-b.en.length).slice(0,8).map(w=>({id:w.id,en:w.en}))})),null,2));
const data={schema:1,report,scenesSha256:sourceHashes.scenes.sha256,entries};
const envelope={schema:1,encoding:'gzip-base64',data:zlib.gzipSync(Buffer.from(JSON.stringify(data))).toString('base64')};
fs.writeFileSync('app/data/generated-etymon/picture-words-selection.js','window.PICTURE_WORDS_SELECTION='+JSON.stringify(envelope)+';\n');
console.log(JSON.stringify(report));
