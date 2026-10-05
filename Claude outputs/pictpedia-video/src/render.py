import asyncio, sys, os
from playwright.async_api import async_playwright
FPS=30; DUR=24.0
async def main(mode):
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1920,'height':1080})
        await pg.goto('file:///tmp/claude-0/video/video.html')
        await pg.wait_for_function('window.ready && document.fonts.status==="loaded"')
        await pg.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))")
        await pg.wait_for_timeout(800)
        if mode=='stills':
            for t in [19.5,20.8,23.0]:
                await pg.evaluate(f'render({t})'); await pg.wait_for_timeout(50)
                await pg.screenshot(path=f'/tmp/claude-0/video/still_{t}.png')
        else:
            os.makedirs('/tmp/claude-0/video/frames',exist_ok=True)
            n=int(DUR*FPS)
            for i in range(n):
                await pg.evaluate(f'render({i/FPS})')
                await pg.screenshot(path=f'/tmp/claude-0/video/frames/f{i:04d}.jpg',type='jpeg',quality=95)
        await b.close()
asyncio.run(main(sys.argv[1]))
