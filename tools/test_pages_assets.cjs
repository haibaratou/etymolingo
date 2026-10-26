const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');
const assert = require('node:assert/strict');
const test = require('node:test');
const repository = path.resolve(__dirname, '..');
const extensions = ['.png','.webp','.jpg','.jpeg','.gif','.avif','.mp4','.webm','.mp3','.wav','.ogg'];
const raw = 'https://raw.githubusercontent.com/haibaratou/etymolingo/' + 'a'.repeat(40) + '/';
const site = 'https://haibaratou.github.io/etymolingo/';

function fixture() {
  class Element {
    constructor() { this.a = {}; this.nodeType = 1; }
    setAttribute(k,v) { this.a[k] = v; }
    getAttribute(k) { return this.a[k]; }
    hasAttribute(k) { return k in this.a; }
    querySelectorAll() { return []; }
  }
  class Img extends Element {
    set src(v) { this.value = v; } get src() { return this.value; }
    set srcset(v) { this.ss = v; } get srcset() { return this.ss; }
  }
  class Style { setProperty(k,v) { this[k] = v; } }
  class XHR { open(method,url) { this.openedUrl = url; } }
  let fetched;
  const win = {Element, HTMLImageElement: Img, CSSStyleDeclaration: Style,
    XMLHttpRequest: XHR,
    document: {currentScript: {src: site + 'pages-assets.js'},
      baseURI: site + 'app/games/picture-words.html', documentElement: {}},
    MutationObserver: class { observe() {} }, URL, Request,
    fetch: async input => { fetched = input; return {ok: true}; }};
  win.window = win;
  const code = fs.readFileSync(path.join(__dirname,'pages-assets.template.js'),'utf8')
    .replace('__RAW_BASE__', JSON.stringify(raw))
    .replace('__MEDIA_EXTENSIONS__', JSON.stringify(extensions));
  vm.runInNewContext(code,win);
  return {win, Img, Element, XHR, fetched: () => fetched, code};
}

test('tiny policy maps every currently tracked media path to the identical pinned URL', () => {
  const {win, code} = fixture();
  const media = childProcess.execFileSync('git',['ls-files','-z'],{cwd:repository,encoding:'utf8',maxBuffer:16*1024*1024})
    .split('\0').filter(name => name &&
      (extensions.includes(path.posix.extname(name).toLowerCase()) || name.startsWith('app/games/picture-words/scene-assets/')) &&
      !name.startsWith('assets/ui/') && !name.split('/').includes('.git'));
  assert.ok(media.length > 0, 'The whole repository media inventory must be exercised');
  for (const name of media) {
    const encoded = name.split('/').map(encodeURIComponent).join('/');
    assert.equal(win.ETYMON_ASSET_URL(site + encoded), raw + encoded, name);
  }
  assert.ok(Buffer.byteLength(code) < 8000, 'Bootstrap must not embed the media inventory');
  assert.ok(!code.includes('__MEDIA_PATHS__'));
  console.log(`Verified ${media.length} existing media URLs; bootstrap ${Buffer.byteLength(code)} bytes.`);
});

test('base URL, Unicode, queries and fragments survive routing', () => {
  const {win} = fixture();
  assert.equal(win.ETYMON_ASSET_URL('../../assets/word/caf%C3%A9.png?v=1#picture'),
    raw + 'assets/word/caf%C3%A9.png?v=1#picture');
  assert.equal(win.ETYMON_ASSET_URL('/etymolingo/assets/word/a.PNG'), raw + 'assets/word/a.PNG');
  assert.equal(win.ETYMON_ASSET_URL('../assets/word/a.png', site + 'app/index.html'), raw + 'assets/word/a.png');
  assert.equal(win.ETYMON_ASSET_URL('picture-words/scene-assets/a%40abc.js'),
    raw + 'app/games/picture-words/scene-assets/a%40abc.js');
});

test('local UI, scripts, data and outside origins remain unchanged', () => {
  const {win} = fixture();
  for (const value of ['../data/generated-etymon/words.json','../../assets/ui/icon.png',
    '../../assets/word/illustration-index.js','../../assets/word/a.svg',
    'https://example.com/a.png','https://haibaratou.github.io/another/a.png',
    '//example.com/a.png','data:image/png;base64,AA==','blob:https://example.com/id','#image',
    site + '.git/private.png']) {
    assert.equal(win.ETYMON_ASSET_URL(value),value);
  }
});

test('unknown missing media route to raw while keeping the original error fallback', () => {
  const {win, Img, Element} = fixture();
  const missing = '../../assets/word/definitely-missing-startup-fixture.png';
  assert.equal(win.ETYMON_ASSET_URL(missing), raw + 'assets/word/definitely-missing-startup-fixture.png');
  const img = new Img();
  let errors = 0;
  img.onerror = () => { errors++; };
  img.src = missing;
  img.onerror();
  assert.equal(errors,1);
  const element = new Element();
  element.setAttribute('onerror','this.remove()');
  element.setAttribute('src',missing);
  assert.equal(element.getAttribute('onerror'),'this.remove()');
});

test('dynamic properties, attributes, responsive images and canvas CORS stay supported', () => {
  const {Img, Element} = fixture();
  const img = new Img();
  img.src = '../../assets/word/café.png';
  assert.equal(img.src,raw + 'assets/word/caf%C3%A9.png');
  assert.equal(img.crossOrigin,'anonymous');
  img.srcset = '../../assets/word/a.png 1x, ../../assets/word/b.webp 2x';
  assert.equal(img.srcset,raw+'assets/word/a.png 1x, '+raw+'assets/word/b.webp 2x');
  const element = new Element();
  element.setAttribute('style','background-image:url("../../assets/word/a.png")');
  assert.equal(element.getAttribute('style'),'background-image:url("'+raw+'assets/word/a.png")');
});

test('pack fetch, URL objects and XHR use the same policy', async () => {
  const {win, XHR, fetched} = fixture();
  await win.fetch('picture-words/scene-assets/test.js');
  assert.equal(fetched(),raw+'app/games/picture-words/scene-assets/test.js');
  await win.fetch(new URL(site+'assets/word/a.png'));
  assert.equal(fetched(),raw+'assets/word/a.png');
  const request = new XHR();
  request.open('GET','../../assets/word/a.png');
  assert.equal(request.openedUrl,raw+'assets/word/a.png');
});
