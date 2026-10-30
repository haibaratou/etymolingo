'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url');
const api=require('./build-latest-site-images.cjs');
const root=path.resolve(__dirname,'../../..');

test('pure parser follows direct main cards and the first image within visual, including HTML entities',()=>{
 const cards=api.cardsFromMarkup('<article data-root="outside"><a class="visual"><img src="wrong.png"></a></article><main><article data-root="x" data-image-id="v1" data-updated="2"><img src="not-visual.png"><a title="quoted > text" class="visual"><img src="one&amp;two.png"><img src="ignored.png"></a><aside><article data-root="nested"><a class="visual"><img src="nested.png"></a></article></aside></article></main>');
 assert.equal(cards.length,1);assert.equal(cards[0].root,'x');assert.equal(cards[0].src,'one&two.png');
});
test('selection preserves strict timestamp order and tie behavior',()=>{
 const a={root:'x',id:'first',updated:10,src:'a'},b={root:'x',id:'tie',updated:10,src:'b'},c={root:'x',id:'newer',updated:11,src:'c'};
 assert.equal(api.pickLatest([a,b]).x.id,'first');assert.equal(api.pickLatest([a,b,c]).x.id,'newer');
});
test('all current choices remain identical while adding actual image metadata',()=>{
 const before=api.assignment(fs.readFileSync(path.join(__dirname,'latest-site-images.js'),'utf8'),'WILDWORDOPIA_LATEST_CHARACTER_IMAGES'),after=api.produce(root);
 api.assertSameChoices(before,after);assert.ok(Object.keys(after.selections).length>0);
 for(const [key,item]of Object.entries(after.selections)){
  assert.match(item.imageSha256,/^[a-f0-9]{64}$/);assert.ok(Number.isFinite(Date.parse(item.fileUpdatedAt)),key);
  assert.equal(item.updatedAt,before.selections[key].updatedAt,key+' keeps the candidate date distinct from file mtime');
 }
});
test('image revision changes only with bytes, not access time or candidate date',t=>{
 const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'wild-image-revision-'));t.after(()=>{
  const target=path.resolve(fixture),relative=path.relative(path.resolve(os.tmpdir()),target);
  assert.ok(relative.startsWith('wild-image-revision-')&&!relative.startsWith('..')&&!path.isAbsolute(relative));
  fs.rmSync(target,{recursive:true,force:true});
 });
 const support=path.join(fixture,'app/support/character-manager'),image=path.join(fixture,'work/image/same.png');fs.mkdirSync(support,{recursive:true});fs.mkdirSync(path.dirname(image),{recursive:true});fs.writeFileSync(image,'first PNG bytes');
 const fragment='<main><article data-root="x" data-image-id="selected" data-updated="1000"><a class="visual"><img src="'+pathToFileURL(image).href+'"></a></article></main>';
 fs.writeFileSync(path.join(support,'comparison-markup.js'),'window.WILDWORDOPIA_COMPARISON_MARKUP='+JSON.stringify(fragment)+';\n');
 const first=api.produce(fixture),same=api.produce(fixture);assert.equal(first.selections.x.imageSha256,same.selections.x.imageSha256);
 fs.utimesSync(image,new Date(5000),new Date(5000));const touched=api.produce(fixture);assert.equal(first.selections.x.imageSha256,touched.selections.x.imageSha256);assert.notEqual(first.selections.x.fileUpdatedAt,touched.selections.x.fileUpdatedAt);
 fs.writeFileSync(image,'second PNG bytes');const changed=api.produce(fixture);assert.notEqual(first.selections.x.imageSha256,changed.selections.x.imageSha256);api.assertSameChoices(first,changed);
});
test('metadata refresh fails closed on any existing selected root/id/path change',()=>{
 const before={selections:{x:{id:'one',path:'../work/image/one.png'}}};
 for(const after of [{selections:{}},{selections:{x:{id:'two',path:'../work/image/one.png'}}},{selections:{x:{id:'one',path:'../work/image/two.png'}}}])assert.throws(()=>api.assertSameChoices(before,after),/changed/);
});

function fixtureProject(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'wild-image-revision-'));
 t.after(()=>{const target=path.resolve(root),relative=path.relative(path.resolve(os.tmpdir()),target);assert.ok(relative.startsWith('wild-image-revision-')&&!relative.startsWith('..')&&!path.isAbsolute(relative));fs.rmSync(target,{recursive:true,force:true});});
 const support=path.join(root,'app/support/character-manager');fs.mkdirSync(support,{recursive:true});fs.mkdirSync(path.join(root,'work/image'),{recursive:true});
 return {root,support,image(name,bytes){const p=path.join(root,'work/image',name+'.png');fs.writeFileSync(p,bytes);return p;},cards(items){const markup='<main>'+items.map(i=>'<article data-root="'+i.root+'" data-image-id="'+i.id+'" data-updated="'+i.updated+'"><a class="visual"><img src="'+pathToFileURL(i.file).href+'"></a></article>').join('')+'</main>';fs.writeFileSync(path.join(support,'comparison-markup.js'),'window.WILDWORDOPIA_COMPARISON_MARKUP='+JSON.stringify(markup)+';\n');}};
}
test('metadata covers older compared pins, deduplicates paths and refreshes their changed bytes without choosing them',t=>{
 const f=fixtureProject(t),old=f.image('old','old PNG bytes'),latest=f.image('latest','latest PNG bytes');
 f.cards([{root:'x',id:'old',updated:1,file:old},{root:'x',id:'latest',updated:2,file:latest},{root:'y',id:'same-old-path',updated:1,file:old}]);
 const a=api.produce(f.root);assert.equal(a.selections.x.id,'latest');assert.equal(a.images.length,2);
 const oldPath='../work/image/old.png',oldHash=a.images.find(i=>i.path===oldPath).imageSha256;
 fs.writeFileSync(old,'replacement bytes at same old pin path');const b=api.produce(f.root);
 assert.notEqual(b.images.find(i=>i.path===oldPath).imageSha256,oldHash);assert.equal(b.selections.x.imageSha256,a.selections.x.imageSha256);assert.equal(b.selections.x.id,'latest');
});
test('intentional choice flag records identity differences and backups; default and check remain read-only on changes',t=>{
 const f=fixtureProject(t),old=f.image('old','old PNG'),next=f.image('next','next PNG');
 const entry='<html><script src="support/character-manager/latest-site-images.js"></script><script src="shared/other.js?v=keep"></script><p>Keep concurrent UI text</p></html>';
 fs.writeFileSync(path.join(f.root,'app/wild-wordopia.html'),entry);fs.mkdirSync(path.join(f.root,'tools'));fs.writeFileSync(path.join(f.root,'tools/wild-wordopia-template.html'),entry);
 f.cards([{root:'x',id:'old',updated:1,file:old}]);api.main(['--root',f.root]);
 const target=path.join(f.support,'latest-site-images.js'),before=fs.readFileSync(target,'utf8'),beforeEntry=fs.readFileSync(path.join(f.root,'app/wild-wordopia.html'),'utf8');
 f.cards([{root:'x',id:'new',updated:2,file:next}]);
 assert.throws(()=>api.main(['--root',f.root]),/accept-choice-changes/);assert.equal(fs.readFileSync(target,'utf8'),before);assert.equal(fs.readFileSync(path.join(f.root,'app/wild-wordopia.html'),'utf8'),beforeEntry);
 assert.throws(()=>api.main(['--root',f.root,'--check','--accept-choice-changes']),/stale/);assert.equal(fs.readFileSync(target,'utf8'),before);
 const accepted=api.main(['--root',f.root,'--accept-choice-changes']);assert.equal(accepted.selections.x.id,'new');
 const runs=path.join(f.root,'work/wild-image-refresh-20261030/builder/runs'),records=fs.readdirSync(runs).map(d=>({directory:path.join(runs,d),report:JSON.parse(fs.readFileSync(path.join(runs,d,'identity-changes.json'),'utf8'))}));
 const record=records.find(r=>r.report.accepted);assert.equal(record.report.changes.length,1);assert.deepEqual(record.report.changes[0],{root:'x',before:{id:'old',path:'../work/image/old.png'},after:{id:'new',path:'../work/image/next.png'}});
 assert.equal(fs.readFileSync(path.join(record.directory,'before-latest-site-images.js'),'utf8'),before);
 const crypto=require('node:crypto'),token=crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex').slice(0,12);
 for(const file of ['app/wild-wordopia.html','tools/wild-wordopia-template.html']){const html=fs.readFileSync(path.join(f.root,file),'utf8');assert.ok(html.includes('latest-site-images.js?v='+token));assert.ok(html.includes('shared/other.js?v=keep'));assert.ok(html.includes('Keep concurrent UI text'));}
 api.main(['--root',f.root,'--check']);
});
