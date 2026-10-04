// Run with Playwright available in NODE_PATH. Covers file and served navigation.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'../..');
const previewDir=process.env.PICTPEDIA_PREVIEW_DIR || require('node:os').tmpdir();
(async()=>{
 const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.webp':'image/webp'})[path.extname(file)]||'application/octet-stream');res.end(data);});
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  for(const base of ['file:///'+root.replaceAll('\\','/')+'/app/eigo-no-e.html',`http://127.0.0.1:${server.address().port}/app/eigo-no-e.html`]){
   const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'#/',{waitUntil:'domcontentloaded'});await page.locator('.cat-main').first().waitFor();
   assert.equal(await page.title(),'Pictpedia — 英単語のイラスト辞典');
   const cards=await page.locator('.cat-main').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),label:e.textContent})));
   for(const card of cards){
    await page.goto(base+'#/',{waitUntil:'domcontentloaded'});await page.locator('.cat').filter({has:page.locator('.cat-main').filter({hasText:card.label})}).scrollIntoViewIfNeeded();const box=await page.locator('.cat').filter({has:page.locator(`.cat-main[href="${card.href}"]`)}).boundingBox();
    await page.mouse.click(box.x+box.width-8,box.y+box.height-8);
    await page.waitForURL('**'+card.href);await page.locator('h1').filter({hasText:card.label}).waitFor();
   }
   await page.goto(base+'#/',{waitUntil:'domcontentloaded'});const sub=page.locator('.cat ul a').first(),subHref=await sub.getAttribute('href');await sub.click();await page.waitForURL('**'+subHref);
   await page.goto(base+'#/w/book');await page.locator('.word-puzzle').waitFor();
   const pending=page.waitForEvent('popup');await page.locator('.word-puzzle').click();const popup=await pending;
   await popup.locator('#puzzleLetters button').first().waitFor();assert(popup.url().endsWith('#/p/book'));assert(page.url().endsWith('#/w/book'));
   for(const letter of 'book')await popup.locator('#puzzleLetters button:enabled').filter({hasText:new RegExp('^'+letter+'$')}).first().click();
   await popup.locator('#puzzleFeedback').filter({hasText:'正解！ book'}).waitFor();
   await popup.locator('#puzzleReset').click();assert.equal(await popup.locator('#puzzleLetters button:enabled').count(),4);
   await popup.locator('#puzzleLetters button').first().click();await popup.locator('#puzzleUndo').click();assert.equal(await popup.locator('#puzzleLetters button:enabled').count(),4);
   await popup.close();
   for(const width of [390,320]){
    await page.setViewportSize({width,height:844});await page.goto(base+'#/',{waitUntil:'domcontentloaded'});await page.locator('.hero-art').waitFor();
    await page.waitForFunction(()=>document.querySelector('.hero-art').naturalWidth>0);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no mobile overflow');
    if(width===390 && base.startsWith('file:'))await page.screenshot({path:path.join(previewDir,'pictpedia-mobile.png'),fullPage:false,animations:'disabled'});
   }
   if(base.startsWith('file:')){await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(previewDir,'pictpedia-desktop.png')});}
   assert.deepEqual(errors,[]);await page.close();console.log('PASS',base.split(':')[0],cards.length,'category cards, subcategory, exact-word popup, solve/reset/undo, mobile widths');
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
