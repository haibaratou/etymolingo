import asyncio, sys
from playwright.async_api import async_playwright
async def run(b, word, lang, answer, name):
    ctx=await b.new_context(viewport={'width':390,'height':760},device_scale_factor=2,record_video_dir='/tmp/claude-0/rec/'+name,record_video_size={'width':780,'height':1520},has_touch=False)
    pg=await ctx.new_page()
    await pg.route('**/fonts.googleapis.com/**', lambda r: r.fulfill(status=200, content_type='text/css', body=open('/tmp/claude-0/fonts.css').read()))
    await pg.goto(f'file:///tmp/claude-0/pp/app/games/picture-words.html?word={word}&lang={lang}')
    await pg.wait_for_timeout(2600)
    letters=await pg.evaluate("[...document.querySelectorAll('#wheel .letter')].map(e=>{const r=e.getBoundingClientRect();return [e.textContent.trim(),r.x+r.width/2,r.y+r.height/2]})")
    print(name, letters)
    used=set(); pts=[]
    for ch in answer:
        for i,(t,x,y) in enumerate(letters):
            if i not in used and t.lower()==ch.lower(): used.add(i); pts.append((x,y)); break
    x,y=pts[0]; await pg.mouse.move(x,y); await pg.wait_for_timeout(250); await pg.mouse.down(); await pg.wait_for_timeout(250)
    for (nx,ny) in pts[1:]:
        await pg.mouse.move(nx,ny,steps=14); await pg.wait_for_timeout(260)
    await pg.wait_for_timeout(150); await pg.mouse.up()
    await pg.wait_for_timeout(3600)
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,'cat','en','cat','en')
        await run(b,'cat','ja','ねこ','ja')
        await b.close()
asyncio.run(main())
