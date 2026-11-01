'use strict';
// Real-browser regression: linkedom cannot measure the flex/scroll layout.
// Run with a locally available Playwright/browser; never downloads a browser.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {pathToFileURL}=require('node:url');
let playwright;
try{playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright');}
catch(error){
 if(!process.env.NODE_REPL_NODE_MODULE_DIRS)throw error;
 playwright=require(path.join(process.env.NODE_REPL_NODE_MODULE_DIRS,'playwright'));
}
const root=path.resolve(__dirname,'../../..');
const entrance=path.resolve(process.env.VOCABULARY_LAYOUT_HTML||path.join(root,'app/vocabulary-master.html'));
const output=process.env.VOCABULARY_LAYOUT_REPORT;
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const geometry=({scrollHeight,...rect})=>rect;
const box=async page=>page.evaluate(()=>{
 const rect=selector=>{
  const element=document.querySelector(selector),r=element.getBoundingClientRect();
  return {x:r.x,y:r.y,width:r.width,height:r.height,clientHeight:element.clientHeight,scrollHeight:element.scrollHeight,scrollTop:element.scrollTop};
 };
 return {header:rect('header'),aside:rect('aside'),head:rect('#contentHead'),toolbar:rect('#toolbar'),table:rect('#tableWrap'),
  body:rect('body'),pageWidth:document.documentElement.scrollWidth,stats:document.querySelector('#stats').textContent};
});

(async()=>{
 const browser=await playwright.chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
 const results=[];
 if(output)fs.mkdirSync(output,{recursive:true});
 try{
  for(const viewport of [{width:1440,height:1000},{width:1440,height:900},{width:1280,height:720},{width:768,height:1024},{width:620,height:740},{width:390,height:844},{width:360,height:640},{width:320,height:740}]){
   const page=await browser.newPage({viewport}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   try{
    await page.goto(pathToFileURL(entrance).href+'#root:weid-',{waitUntil:'load'});
    await page.waitForSelector('html[data-explorer-ready="1"]',{timeout:60000});
    await page.waitForSelector('#toolbar [data-difficulty-filter="10"]',{timeout:60000});
    await page.waitForSelector('#tableWrap th.difficulty-v2-col',{timeout:60000});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const initial=await box(page),minimum=Math.min(240,viewport.height*.25);
    if(output)await page.screenshot({path:path.join(output,`after-${viewport.width}x${viewport.height}.png`)});
    assert(initial.table.height>=minimum,`${viewport.width}x${viewport.height}: table ${initial.table.height}px < ${minimum}px; ${JSON.stringify(initial)}`);
    assert(initial.table.y+initial.table.height<=viewport.height+1,'list stays inside viewport');
    assert(initial.body.scrollHeight<=viewport.height+1,'no extra vertical page scrollbar');
    assert(initial.pageWidth<=viewport.width+1,'no horizontal page overflow');
    assert(initial.toolbar.height>0&&initial.toolbar.y>=0,'filter toolbar stays visible');
    assert(await page.locator('#gs').isVisible(),'global search stays visible');
    if(viewport.width<=360){
     const toolbar=page.locator('#toolbar');
     await page.mouse.move(initial.toolbar.x+initial.toolbar.width/2,initial.toolbar.y+10);
     await page.mouse.wheel(500,0);
     await page.waitForFunction(()=>document.querySelector('#toolbar').scrollLeft>0);
     assert.equal(await page.locator('#tableWrap').evaluate(e=>e.scrollTop),0,'horizontal filters do not scroll the list');
     await toolbar.evaluate(e=>e.scrollLeft=0);
    }

    const source=await page.evaluate(()=>{
     const r=ROOTS.find(r=>r.key==='weid-');
     return {html:rootSourceSectionsHTML(r),commentary:r.d||'',original:Object.hasOwn(r,'original_definition')?r.original_definition:(!r.definition_reviewed?r.def:'')};
    });
    const opener=page.locator('#rootExplanationOpen'),dialog=page.locator('#rootExplanation');
    await opener.click();
    assert(await dialog.isVisible(),'full explanation opens');
    assert.equal(await dialog.locator('.rootTalk').textContent(),source.commentary,'unabridged commentary');
    const opened=await box(page);
    assert.deepEqual(geometry(opened.table),geometry(initial.table),'opening explanation preserves the entire list viewport');
    await dialog.locator('.rootSrc summary').click();
    if(source.original)assert.equal(await dialog.locator('.rootOriginal').textContent(),source.original,'unabridged original source');
    const sourceOpened=await box(page);
    assert.deepEqual(geometry(sourceOpened.table),geometry(initial.table),'expanding original source cannot shrink list');
    await dialog.evaluate(element=>element.scrollTop=0);
    const readerBox=await dialog.boundingBox();
    await page.mouse.move(readerBox.x+readerBox.width/2,readerBox.y+readerBox.height*.65);
    await page.mouse.wheel(0,650);
    const readerOverflows=await dialog.evaluate(e=>e.scrollHeight>e.clientHeight+1);
    if(readerOverflows)await page.waitForFunction(()=>document.querySelector('#rootExplanation').scrollTop>0);
    assert.equal(await page.locator('#tableWrap').evaluate(e=>e.scrollTop),0,'reading does not scroll the underlying list');
    const close=page.locator('#rootExplanationClose'),closeBox=await close.boundingBox();
    assert(closeBox.y>=0&&closeBox.y+closeBox.height<=viewport.height,'close control stays visible while reading');
    if(output&&viewport.width===390)await page.screenshot({path:path.join(output,'reader-390x844.png')});
    await close.click();
    assert.equal(await dialog.isVisible(),false,'close button works');
    assert.equal(await opener.evaluate(e=>document.activeElement===e),true,'focus returns to read button');
    await opener.click();await page.keyboard.press('Escape');
    assert.equal(await dialog.isVisible(),false,'Escape closes reader');
    assert.deepEqual(geometry((await box(page)).table),geometry(initial.table),'closing preserves list height');

    const wrap=page.locator('#tableWrap'),rowsBefore=await page.locator('#tblBody > tr[data-i]').count();
    await page.mouse.move(initial.table.x+70,initial.table.y+Math.min(100,initial.table.height/2));
    await page.mouse.wheel(0,700);
    await page.waitForFunction(()=>document.querySelector('#tableWrap').scrollTop>0);
    const scrolled=await box(page);
    assert.deepEqual(scrolled.toolbar,initial.toolbar,'filters stay fixed when list scrolls');
    const thBox=await page.locator('#tableWrap thead th.cW').boundingBox();
    assert(Math.abs(thBox.y-initial.table.y)<=2,'column headers stay at top of list');
    await wrap.evaluate(element=>element.scrollTop=element.scrollHeight);
    await page.waitForFunction(count=>document.querySelectorAll('#tblBody > tr[data-i]').length>count,rowsBefore);
    const rowsAfter=await page.locator('#tblBody > tr[data-i]').count();
    await page.locator('#toolbar [data-pos="名"]').click();
    assert(await page.locator('#toolbar [data-pos="名"]').evaluate(e=>e.classList.contains('on')),'filter selection works');
    assert.equal(await wrap.evaluate(e=>e.scrollTop),0,'filter rebuild resets the list');
    await page.locator('#gs').fill('vision');
    await page.waitForFunction(()=>document.querySelector('#contentHead').textContent.includes('「vision」')&&document.querySelector('#tableWrap tbody tr'));
    assert.deepEqual(errors,[],'no browser runtime errors');
    const result={viewport,minimum,...initial,sourceHash:sha(source.html),rowsBefore,rowsAfter,listScrollTop:scrolled.table.scrollTop,filterAndSearch:true,errors};
    results.push(result);console.log(JSON.stringify(result));
   }finally{await page.close();}
  }
 }finally{
  await browser.close();
  if(output)fs.writeFileSync(path.join(output,'after-measurements.json'),JSON.stringify({entrance,entranceSHA256:sha(fs.readFileSync(entrance)),results},null,2));
 }
 console.log(`PASS: ${results.length} viewport layouts; full reader, focus/close, wheel scrolling, sticky controls and incremental rows`);
})().catch(error=>{console.error(error);process.exitCode=1;});
