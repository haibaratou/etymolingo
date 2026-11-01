'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {pathToFileURL,fileURLToPath}=require('node:url');
const root=path.resolve(__dirname,'../../..'),runtime=path.resolve(process.env.VOCABULARY_RUNTIME_ROOT||root);
const output=process.env.VOCABULARY_CLASSIFICATION_REPORT;
let pw;try{pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');}catch(error){if(!process.env.NODE_REPL_NODE_MODULE_DIRS)throw error;pw=require(path.join(process.env.NODE_REPL_NODE_MODULE_DIRS,'playwright'));}
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
function source(relative){
 if(!/^(app|assets)\//.test(relative)||relative.split('/').includes('..'))return null;
 for(const base of [root,runtime]){const name=path.join(base,...relative.split('/'));if(fs.existsSync(name)&&fs.statSync(name).isFile())return name;}
 return null;
}
async function dependencies(page,remote=false){
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.protocol==='file:'){
   const relative=path.relative(root,fileURLToPath(url)).split(path.sep).join('/'),name=source(relative);
   if(!name)return route.abort();
   return route.fulfill({body:fs.readFileSync(name),contentType:types[path.extname(name)]||'application/octet-stream'});
  }
  if(remote&&url.hostname==='example.invalid'){
   const name=source(decodeURIComponent(url.pathname).replace(/^\//,''));
   if(!name)return route.fulfill({status:404,body:'Not found'});
   return route.fulfill({body:fs.readFileSync(name),contentType:types[path.extname(name)]||'application/octet-stream'});
  }
  if(url.hostname==='127.0.0.1')return route.continue();
  return route.abort();
 });
}
const rectangle=page=>page.locator('#tableWrap').evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
async function openManager(page){
 await page.locator('[data-open-classifications]').click();
 await page.waitForSelector('html[data-classification-ready="1"]',{timeout:60000});
 assert(await page.locator('#classificationDialog').isVisible());
 assert.equal(await page.locator('#classificationManager [data-act=save]').isVisible(),false,'unverified direct write is unavailable');
}
async function chooseJSON(page,button,data){
 const event=page.waitForEvent('filechooser');await button.click();
 await (await event).setFiles({name:'local-classification-test.json',mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});
}
async function downloadJSON(page,button,label){
 const event=page.waitForEvent('download');await button.click();const download=await event;
 const destination=path.join(output||require('node:os').tmpdir(),label);
 await download.saveAs(destination);return JSON.parse(fs.readFileSync(destination,'utf8'));
}
async function ready(page,url){
 await page.goto(url+'#root:weid-',{waitUntil:'load'});
 await page.waitForSelector('html[data-explorer-ready="1"][data-classification-local-attached="1"]',{timeout:60000});
 await page.waitForSelector('#toolbar [data-difficulty-filter="10"]',{timeout:60000});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
async function workflow(page,url,label){
 await ready(page,url);const before=await rectangle(page);
 await openManager(page);assert.deepEqual(await rectangle(page),before,'manager does not resize the list');
 const manager=page.locator('#classificationManager'),query=manager.locator('[data-query]');
 const identities=await page.evaluate(()=>{
  const index=p=>WORDS.findIndex(w=>w.w==='bear'&&(w.p||[]).includes(p));
  return {verb:index('bher-1'),noun:index('bher-3'),review:JSON.stringify(JSON.parse(document.getElementById('semanticData').textContent))};
 });
 assert(identities.verb>=0&&identities.noun>=0);
 await query.fill('bear');
 const nounRow=manager.locator(`[data-word="${identities.noun}"]`).locator('..');
 assert.match(await nounRow.textContent(),/レビュー済み分類/);
 await manager.locator(`[data-word="${identities.verb}"]`).click();
 await manager.locator('[data-categories]').fill('actions');
 await manager.locator('[data-categories]').press('End');
 await manager.locator('[data-categories]').press('/');
 await manager.locator('[data-categories]').pressSequentially('hand');
 assert.equal(await manager.locator('[data-categories]').inputValue(),'actions/hand','slash shortcut never steals category typing');
 await manager.locator('[data-tags]').fill('local-software-test');
 await manager.locator('[data-act=apply]').click();
 assert.match(await manager.locator('[data-status]').textContent(),/まだ保存していません/);
 assert.match(await nounRow.textContent(),/レビュー済み分類/,'same spelling with other origin stays reviewed');
 await manager.locator('[data-tag]').fill('local-software-test');
 assert.equal(await manager.locator('[data-results] [data-word]').count(),1,'only selected origin receives tag');
 const patch=await downloadJSON(page,manager.locator('[data-act=export]'),label+'-patch.json');
 assert.equal(patch.changes.length,1);assert.equal(patch.changes[0].identity.w,'bear');
 assert.deepEqual(patch.changes[0].identity.p,['bher-1']);assert.deepEqual(patch.changes[0].after.tags,['local-software-test']);
 assert.equal(await page.evaluate(()=>JSON.stringify(JSON.parse(document.getElementById('semanticData').textContent))),identities.review,'reviewed snapshot stays identical');
 await page.locator('#classificationDialog [data-close]').click();
 assert.deepEqual(await rectangle(page),before,'closing restores list unchanged');
 await page.reload({waitUntil:'load'});await page.waitForSelector('html[data-classification-local-attached="1"]',{timeout:60000});await openManager(page);
 await chooseJSON(page,manager.locator('[data-act=import]'),patch);
 await page.waitForFunction(()=>document.querySelector('#classificationManager [data-status]').textContent.includes('下書きとして読み込みました'));
 assert.match(await manager.locator('[data-count]').textContent(),/下書き 1件/);
 await manager.locator('[data-act=draft]').click();
 assert.match(await manager.locator('[data-status]').textContent(),/GitHub正本は未更新/);
 await page.reload({waitUntil:'load'});await page.waitForSelector('html[data-classification-local-attached="1"]',{timeout:60000});await openManager(page);
 assert.match(await manager.locator('[data-status]').textContent(),/復元しました/,'local draft reload works');
 const stale=await page.evaluate(async entry=>VocabularyClassificationEditor.canonical([{identity:entry.identity,guard:{...entry.guard,ja:'software fixture stale guard'},...entry.after}]),patch.changes[0]);
 await chooseJSON(page,manager.locator('[data-act=open]'),stale);
 await page.waitForFunction(()=>document.querySelector('#classificationManager [data-status]').textContent.startsWith('中止:'));
 assert.match(await manager.locator('[data-status]').textContent(),/語義・画像が変更/);
 assert.match(await manager.locator('[data-count]').textContent(),/下書き 1件/,'rejected file cannot destroy draft');
 await manager.locator('[data-query]').fill('bear');
 await manager.locator(`[data-word="${identities.verb}"]`).click();
 await manager.locator('[data-categories]').fill('');await manager.locator('[data-tags]').fill('');await manager.locator('[data-act=apply]').click();
 const empty=await downloadJSON(page,manager.locator('[data-act=export]'),label+'-explicit-empty.json');
 assert.deepEqual(empty.changes[0].after,{categories:[],tags:[]},'explicit empty override is preserved');
 const managed=await page.evaluate(async p=>VocabularyClassificationEditor.applyPatch(p,await VocabularyClassificationEditor.canonical([]),VocabularyClassificationEditor.indexWords(WORDS)),empty);
 const recovery=page.locator('#classificationRecovery');await recovery.locator('summary').click();
 await chooseJSON(page,recovery.locator('[data-open]'),managed);
 await page.waitForFunction(()=>document.querySelector('#classificationRecovery [data-status]').textContent.includes('1件・要再確認 0件'));
 await recovery.locator('[data-old-index="0"]').click();await recovery.locator('[data-remove]').click();
 const plan=await downloadJSON(page,recovery.locator('[data-export]'),label+'-remove-plan.json');
 assert.equal(plan.operations[0].operation,'remove');assert.deepEqual(plan.operations[0].identity,patch.changes[0].identity,'management removal is an explicit recovery operation');
 await manager.locator('[data-query]').fill('constable');
 await manager.locator('[data-results] [data-word]').first().click();
 assert(await manager.locator('[data-act=apply]').isDisabled(),'duplicate exact identity cannot be edited');
 if(output)await page.screenshot({path:path.join(output,label+'-manager.png')});
 await page.locator('#classificationDialog [data-close]').click();
 await page.locator('#rootExplanationOpen').click();
 assert(await page.locator('#rootExplanation').isVisible(),'root reader remains available');
 await page.keyboard.press('Escape');
 assert(await page.locator('#tableWrap').isVisible());
 return {label,list:before,selectedOrigin:patch.changes[0].identity,patchDownloadImport:true,localDraftReload:true,staleRejected:true,explicitEmptyAndRemovalDistinct:true,otherOriginUnchanged:true,duplicateBlocked:true};
}
(async()=>{
 if(output)fs.mkdirSync(output,{recursive:true});
 const server=process.env.VOCABULARY_TEST_HTTP==='1'?http.createServer((req,res)=>{
  if(req.method!=='GET'){res.writeHead(405);return res.end();}
  const relative=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname).replace(/^\//,''),name=source(relative);
  if(!name){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'content-type':types[path.extname(name)]||'application/octet-stream','cache-control':'no-store'});fs.createReadStream(name).pipe(res);
 }):null;
 if(server)await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=server?`http://127.0.0.1:${server.address().port}/app/vocabulary-master.html`:null,file=pathToFileURL(path.join(root,'app/vocabulary-master.html')).href;
 const browser=await pw.chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})}),results=[];
 try{
  for(const [label,url,viewport] of [[process.env.VOCABULARY_TEST_HTTP==='1'?'pc-http':'pc-file',process.env.VOCABULARY_TEST_HTTP==='1'?base:file,{width:1440,height:900}],['phone-file',file,{width:390,height:844}]]){
   const context=await browser.newContext({viewport,acceptDownloads:true});
   await context.addInitScript(()=>{window.showOpenFilePicker=()=>{throw Error('Native picker must not run in local import mode');};});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await dependencies(page);
   try{const result=await workflow(page,url,label);assert.deepEqual(errors,[]);results.push({...result,errors});console.log(JSON.stringify(results.at(-1)));}finally{await context.close();}
  }
  for(const viewport of [{width:360,height:640},{width:320,height:740}]){
   const page=await browser.newPage({viewport});await dependencies(page);await ready(page,file);
   const before=await rectangle(page);assert(before.height>=viewport.height*.25);
   await openManager(page);assert.deepEqual(await rectangle(page),before);await page.keyboard.press('Escape');assert.deepEqual(await rectangle(page),before);
   results.push({viewport,list:before,openClose:true});console.log(JSON.stringify(results.at(-1)));await page.close();
  }
  const vm=require('node:vm'),module={exports:{}},context={module,location:{protocol:'https:',hostname:'example.invalid'},document:{currentScript:null,createElement(){throw Error('Remote mount must never create a DOM element');}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'classification-manager.js'),'utf8'),context);
  assert.equal(module.exports.isLocal(context.location),false);assert.equal(module.exports.attach([{w:'fixture',p:[]}]),undefined);
  results.push({remoteHostDisabledUnit:true,httpTested:process.env.VOCABULARY_TEST_HTTP==='1'});
 }finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));if(output)fs.writeFileSync(path.join(output,'classification-browser-report.json'),JSON.stringify({root,runtime,results},null,2));}
 console.log('PASS: file editing, download/import/reload, origin isolation, rejected stale data, explicit empty/removal, narrow layout and remote-host unit boundary');
})().catch(error=>{console.error(error);process.exitCode=1;});
