'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=process.env.PICTURE_WORDS_TEST_ROOT||path.resolve(__dirname,'../../..');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),context={window:{}};
const text=fs.readFileSync(path.join(root,'app/games/picture-words/catalog.js'),'utf8');vm.runInNewContext(text,context);
const rows=JSON.parse(JSON.stringify(context.window.PICTURE_WORDS_CATALOG)),meta=JSON.parse(JSON.stringify(context.window.PICTURE_WORDS_CATALOG_META));
const report=JSON.parse(fs.readFileSync(path.join(root,'app/games/picture-words/reviewed-catalog-report.json')));
const words=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-etymon/words.json')));
const seeds=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-image-legacy-ids.json'))).rows;
const {supportsLanguage,captionOnlyIssue}=require(path.join(root,'app/games/picture-words/reviewed-scenes.js'));
const issueHistory=JSON.parse(fs.readFileSync(path.join(root,'app/data/generated-image-issues.json')));
const sorted=value=>Array.isArray(value)?value.map(sorted):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,sorted(value[k])])):value;
const issuesByHash=new Map(issueHistory.issues.map(issue=>[sha(Buffer.from(JSON.stringify(sorted(issue)))),issue]));
test('schema2 metadata binds current inputs without caption inclusion gate',()=>{
 assert.equal(meta.schema,2);assert.equal(meta.count,rows.length);assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
 for(const [field,file] of [['sourceWordsSha256','app/data/generated-etymon/words.json'],['scenesSha256','app/data/generated-etymon/illustration-scenes.json'],['indexSha256','assets/word/illustration-index.js']])assert.equal(meta[field],sha(fs.readFileSync(path.join(root,file))));
 assert.deepEqual(report.meta,meta);assert.equal(report.captionGateApplied,false);assert.equal(report.dateGateApplied,false);assert.equal(report.posGateApplied,false);
});
test('every usable current PNG is represented once with verified hashes and no invented owner',()=>{
 // A partial recovery checkout may supply an externally verified inventory.
 // Full ordinary checkouts still rehash every original PNG directly.
 const inventoryPath=process.env.PICTURE_WORDS_INVENTORY_MANIFEST;
 const inventory=inventoryPath?JSON.parse(fs.readFileSync(inventoryPath,'utf8')):null;
 if(inventory){assert.equal(inventory.schema,1);assert.equal(inventory.verification,'current_git_tree_and_exact_prior_catalog_or_current_bytes');}
 const invalid=report.invalidPngFiles||[];
 const invalidNames=new Set(invalid.map(x=>path.basename(x.path)));assert.equal(invalidNames.size,invalid.length);
 if(inventory){assert.deepEqual(invalid,inventory.invalid);for(const name of fs.readdirSync(path.join(root,'assets/word')).filter(x=>x.endsWith('.png')))assert(invalidNames.has(name)||inventory.images[name.slice(0,-4)],'Local PNG absent from verified inventory: '+name);}
 const actual=inventory?Object.keys(inventory.images).map(art=>art+'.png').sort():fs.readdirSync(path.join(root,'assets/word')).filter(x=>x.endsWith('.png')&&!invalidNames.has(x)).sort();
 assert.deepEqual(rows.map(r=>r.pic+'.png').sort(),actual);
 if(invalid.length){assert.equal(report.observedPngPaths,actual.length+invalid.length);assert.equal(report.usablePngPaths,actual.length);assert.equal(report.exclusionCounts.invalid_png,invalid.length);}
 for(const item of invalid){const b=fs.readFileSync(path.join(root,item.path));assert.equal(item.path,'assets/word/'+path.basename(item.path));const validHeader=b.length>=24&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))&&b.subarray(12,16).toString()==='IHDR';assert.equal(validHeader,false,'A valid PNG cannot be hidden in the invalid-file report');assert.equal(item.reason,b.length?'invalid_png_header':'empty_file');assert.equal(b.length,item.bytes);assert.equal(sha(b),item.sha256);assert.equal(crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'),item.git_blob_sha);assert(!rows.some(r=>r.image.path===item.path));}
 for(const r of rows){
  assert.equal(r.image.path,`assets/word/${r.pic}.png`);
  if(fs.existsSync(path.join(root,r.image.path))){const b=fs.readFileSync(path.join(root,r.image.path));assert.equal(sha(b),r.image.sha256);assert.equal(crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex'),r.image.git_blob_sha);}
  else {assert(inventory,'Missing original without independently verified inventory: '+r.image.path);const observed=inventory.images[r.pic];assert.equal(observed.path,r.image.path);assert.equal(observed.sha256,r.image.sha256);assert.equal(observed.git_blob_sha,r.image.git_blob_sha);}
  if(r.bindingStatus==='bound'){const w=words[r.dictionaryIndex];assert.equal(w.w,r.en);assert.deepEqual(w.p||[],r.roots);assert.deepEqual(r.sceneBinding,Object.fromEntries(['w','p','ja','en'].map(k=>[k,w[k]??(k==='p'?[]:'')])));}
  else {assert.equal(r.en,'');assert.equal(r.ja,'');assert(!r.availability.en.playable&&!r.availability.ja.playable);}
 }
});
test('caption absence is honest and never deletes English-only entries',()=>{
 let missing=0;for(const r of rows){const d=r.description;assert(['reviewed','missing','stale','held'].includes(d.status));if(d.status==='reviewed'){assert(d.en&&d.ja&&d.ttsAllowed);assert.deepEqual(r.reviewedScene.scene,{en:d.en,ja:d.ja});assert.deepEqual(r.reviewedScene.image,r.image);}else{assert.equal(d.en,'');assert.equal(d.ja,'');assert.equal(d.ttsAllowed,false);assert(!r.reviewedScene);assert(!r.sceneAsset);missing++;}}
 assert(missing>0);assert(rows.some(r=>r.description.status==='missing'&&r.availability.en.playable&&!r.availability.ja.playable));
});
test('language counts derive from independent safe answer contracts',()=>{
 for(const lang of ['en','ja']){assert.equal(meta.playableCounts[lang],rows.filter(r=>r.availability[lang].playable).length);for(const r of rows)assert.equal(supportsLanguage(r,lang),r.availability[lang].playable,r.id+' '+lang);}
 for(const r of rows){if(r.availability.en.playable){assert.match(r.en,/^[A-Za-z]{1,14}$/);assert.equal(r.availability.en.answer,r.en);assert(r.issues.every(issue=>captionOnlyIssue(issue,r)));}if(r.availability.ja.playable){assert.match(r.w,/^[ぁ-ゔー]{1,14}$/);assert.equal(r.availability.ja.answer,r.w);assert(r.issues.every(issue=>captionOnlyIssue(issue,r)));}}
});
test('caption-only play permissions retain exact latest review evidence and never enable captions',()=>{
 let scopes=0;for(const r of rows)for(const issue of r.issues){if(!issue.scopeReview)continue;scopes++;const original=issuesByHash.get(issue.issueSha256);assert.ok(original,r.id+' original issue');assert(original.codes.includes(issue.code));assert.equal(issue.detail,original.detail);assert.equal(original.w,r.en);assert.deepEqual(original.p,r.roots);assert.equal(original.art,r.pic);assert.equal(original.imageSha256,r.image.sha256);assert.equal(original.senseSha256,r.sense.sha256);
  const latest=issueHistory.scope_reviews.filter(review=>review.targetIssueSha256===issue.issueSha256).at(-1);assert.deepEqual(issue.scopeReview,latest);assert.equal(captionOnlyIssue(issue,r),true);assert.equal(r.description.status,'held');assert.equal(r.description.en,'');assert.equal(r.description.ja,'');assert.equal(r.description.ttsAllowed,false);assert.equal(r.reviewedScene,undefined);assert.equal(r.sceneAsset,undefined);
 }
 assert(scopes>0);
});
test('all stable current IDs survive with unchanged word and image identity',()=>{
 const byId=new Map(rows.map(r=>[r.id,r]));for(const seed of seeds){const r=byId.get(seed.id);assert(r);assert.equal(r.en,seed.en);assert.equal(r.pic,seed.pic);}
 for(const id of ['egg','ring','plane'])assert(byId.has(id));
});
test('each reviewed lazy pack matches current bound bytes, without eager catalog images',()=>{
 for(const r of rows.filter(r=>r.description.status==='reviewed')){const scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'app/games',r.sceneAsset),'utf8'),scope);const p=scope.window.PICTURE_WORDS_SCENE_ASSETS[r.image.sha256];assert(p);const b=Buffer.from(p.base64,'base64');assert.equal(sha(b),r.image.sha256);assert.deepEqual(b,fs.readFileSync(path.join(root,r.image.path)));}
 assert(!text.includes('base64'));assert(!text.includes('data:image/'));
 const checkTimestamps=(value,keys=[])=>{if(!value||typeof value!=='object')return;for(const [key,item]of Object.entries(value)){const location=[...keys,key];if(key==='reviewed_at')assert.match(location.join('.'),/^rows\.\d+\.issues\.\d+\.scopeReview\.reviewed_at$/);checkTimestamps(item,location);}};checkTimestamps({rows,meta});
});
test('game HTML catalog cache token is current and exactly once',()=>{
 const html=fs.readFileSync(path.join(root,'app/games/picture-words.html'),'utf8');const matches=[...html.matchAll(/picture-words\/catalog\.js\?v=([^"'&\s<>]+)/g)];assert.equal(matches.length,1);assert.equal(matches[0][1],sha(Buffer.from(text)).slice(0,12));
});
