const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
global.crypto=crypto.webcrypto;
const api=require('./illustration-scenes.js');
const bytes=Buffer.from('actual picture'),sha=crypto.createHash('sha256').update(bytes).digest('hex');
const word={w:'mountain',p:['men-2'],ja:'山',en:'peak'};
const entry={...word,art:'mountain',sense:{ja:'山',en:'peak'},status:'reviewed',image:{sha256:sha},scene:{en:'A mountain rises above the trees.',ja:'木々の上に山がそびえる。'}};
test('HTTP verifies actual image bytes',async()=>{global.fetch=async()=>({ok:true,arrayBuffer:async()=>bytes});assert.equal((await api.verify(entry,{word,imageUrl:'https://example/image.png'})).status,'reviewed')});
test('HTTP stale image fails closed',async()=>{global.fetch=async()=>({ok:true,arrayBuffer:async()=>Buffer.from('replacement')});assert.equal((await api.verify(entry,{word,imageUrl:'https://example/image.png'})).status,'stale_image')});
test('file snapshot explicit provenance skips unavailable byte fetch',async()=>{global.fetch=()=>{throw Error('must not fetch')};const r=await api.verify(entry,{word,imageUrl:'file:///image.png',protocol:'file:',snapshot:true});assert.equal(r.status,'reviewed');assert.equal(r.verification,'export_snapshot')});
test('file without snapshot remains unavailable',async()=>{global.fetch=()=>{throw Error('blocked')};assert.equal((await api.verify(entry,{word,imageUrl:'file:///image.png',protocol:'file:'})).status,'unavailable')});
test('snapshot still guards word identity and first sense',async()=>assert.equal((await api.verify(entry,{word:{...word,ja:'山脈'},imageUrl:'file:///image.png',protocol:'file:',snapshot:true})).status,'stale_sense'));
test('mismatch persisted status survives valid HTTP hash',async()=>{global.fetch=async()=>({ok:true,arrayBuffer:async()=>bytes});assert.equal((await api.verify({...entry,status:'mismatch'},{word,imageUrl:'https://example/image.png'})).status,'mismatch')});
test('mismatch does not survive replaced image',async()=>{global.fetch=async()=>({ok:true,arrayBuffer:async()=>Buffer.from('new')});assert.equal((await api.verify({...entry,status:'mismatch'},{word,imageUrl:'https://example/image.png'})).status,'stale_image')});
function fakeContainer(){
  const nodes=[];return {nodes,dataset:{},classList:{add(){}},replaceChildren(){nodes.length=0},append(n){nodes.push(n)}};
}
global.document={createElement(tag){return {tag,textContent:'',className:'',title:''}}};
test('mismatch label and snapshot disclosure render distinctly',()=>{const c=fakeContainer();api.render(c,{status:'mismatch',entry,verification:'export_snapshot'});assert.equal(c.dataset.sceneStatus,'mismatch');assert.equal(c.nodes[0].textContent,'イラスト要修正');assert.equal(c.nodes[1].textContent,'保存時の画像で確認済み');assert.match(c.nodes[1].title,/再照合していません/)});
test('reviewed caption renders author text without HTML interpretation',()=>{const c=fakeContainer();api.render(c,{status:'reviewed',entry});assert.equal(c.nodes[0].textContent,entry.scene.en);assert.equal(c.nodes[1].textContent,entry.scene.ja)});
test('missing record and unavailable result show distinct messages',()=>{const a=fakeContainer(),b=fakeContainer();api.render(a,{status:'unreviewed'});api.render(b,{status:'unavailable'});assert.notEqual(a.nodes[0].textContent,b.nodes[0].textContent)});
