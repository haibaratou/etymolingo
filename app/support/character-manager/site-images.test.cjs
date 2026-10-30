// Pure/isolated storage tests; no browser, artwork, server, or real saves are touched.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../../..');
const helperSource = fs.readFileSync(path.join(root, 'app/shared/manager-site-image-store.js'), 'utf8');
const api = require('../../shared/manager-site-image-store.js');
const appURL = 'file:///D:/Projects/etymolingo/app/character-manager.html';
const oldTime = '2026-10-28T10:00:00Z';
const savedAt = '2026-10-28T11:00:00Z';
const nextTime = '2026-10-28T12:00:00Z';
const shared = {schema:1, savedAt, selections:{
  kaput:{id:'local-root-kaput-v017-flat-anime-v006',path:'../work/image/root-kaput-v017-flat-anime-v006.png',updatedAt:oldTime},
  per1:{id:'v017',path:'../assets/chara/brainrot/library/root-per1-v017.png',updatedAt:oldTime}
}};
const plain = value => JSON.parse(JSON.stringify(value));
const snapshot = value => JSON.stringify(value);

function isolatedBrowser(storageEntries) {
  const storage = new Map(Object.entries(storageEntries));
  const before = snapshot([...storage]);
  let reads = 0, writes = 0;
  const context = {
    URL, Date, JSON, Object, Array, String, Error,
    localStorage:{
      getItem(){reads++;throw Error('Unexpected storage read');},
      setItem(){writes++;throw Error('Unexpected storage write');},
      removeItem(){writes++;throw Error('Unexpected storage removal');},
      clear(){writes++;throw Error('Unexpected storage reset');}
    }
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(helperSource, context, {filename:'manager-site-image-store.js'});
  return {api:context.WildSiteImageStore,storage,before,counts:()=>({reads,writes})};
}

test('independent browser contexts load the same common choices without reading or changing storage', () => {
  const chrome = isolatedBrowser({
    'wildwordopia.manager-published.v1':'{"kaput":{"id":"old","src":"file:///D:/Projects/etymolingo/work/image/old.png"}}',
    'wildwordopia.manager-official.v1':'{"kaput":"draft-choice"}',
    'wildwordopia.root-candidate-review.v1':'{"reviews":{"old":{"comment":"keep"}}}',
    'wildwordopia.deleted-images.v1':'["older:v001"]'
  });
  const other = isolatedBrowser({});
  const stale = {kaput:{id:'old',src:'../work/image/old.png',updatedAt:oldTime}};
  const a = plain(chrome.api.resolve(shared, stale, appURL));
  const b = plain(other.api.resolve(shared, {}, appURL));
  assert.deepEqual(a,b);
  assert.equal(a.kaput.id,shared.selections.kaput.id);
  assert.equal(a.kaput.src,'file:///D:/Projects/etymolingo/work/image/root-kaput-v017-flat-anime-v006.png');
  for (const browser of [chrome,other]) {
    assert.equal(snapshot([...browser.storage]),browser.before);
    assert.deepEqual(browser.counts(),{reads:0,writes:0});
  }
});

test('real consumer paints six common roots before the storage iframe and handles aliases and stale browser state', () => {
  const six = plain(shared);
  for (const name of ['genu1','sta','ane','weid']) six.selections[name]={id:'v006',path:'../work/image/root-'+name+'-v006.png',updatedAt:oldTime};
  const consumer=fs.readFileSync(path.join(root,'app/shared/manager-site-images.js'),'utf8');
  function client(stored) {
    const browser=isolatedBrowser(stored),c=browser.api?browser:null;
    const events={},frames=[],messages=[],channels=[];
    const context={URL,Date,JSON,Object,Array,String,Error,
      WildSiteImageStore:c.api,WILDWORDOPIA_SITE_IMAGE_SELECTIONS:plain(six),
      location:{href:'file:///D:/Projects/etymolingo/app/wild-wordopia.html'},
      crypto:{randomUUID:()=> 'test-token-1234567890'},Event:class{constructor(type){this.type=type;}},
      addEventListener(type,fn){(events[type]??=[]).push(fn);},
      dispatchEvent(event){for(const fn of events[event.type]||[])fn(event);},
      BroadcastChannel:class{constructor(name){this.name=name;channels.push(this);}},
      document:{createElement(tag){assert.equal(tag,'iframe');return {setAttribute(){},contentWindow:{postMessage(message){messages.push(message);}}};},body:{append(frame){frames.push(frame);}}},
      localStorage:{getItem(){throw Error('Consumer must not read another document storage');},setItem(){throw Error('Consumer must not overwrite storage');}}
    };
    context.window=context;vm.createContext(context);vm.runInContext(consumer,context,{filename:'manager-site-images.js'});
    return {browser,context,frames,messages,channels,emit(type,event){for(const fn of events[type]||[])fn(event);}};
  }
  const chrome=client({'wildwordopia.manager-published.v1':'kept Chrome state'}),other=client({});
  const image=(client,key)=>client.context.WILDWORDOPIA_MANAGER_IMAGE({id:key,rootKey:key});
  for(const client of [chrome,other]){
    assert.equal(client.frames.length,0,'common choices must be available before DOMContentLoaded');
    for(const key of Object.keys(six.selections))assert.equal(image(client,key),api.resolve(six,{},appURL)[key].src);
    assert.equal(client.context.WILDWORDOPIA_MANAGER_IMAGE({id:'genu',rootKey:'genu-1'}),image(client,'genu1'));
    client.emit('DOMContentLoaded');assert.equal(client.frames.length,1);
    const frame=client.frames[0];frame.onload();const token=client.messages[0].token;
    const stale={kaput:{id:'old-browser-choice',src:'../work/image/old-browser-choice.png',updatedAt:oldTime}};
    client.emit('message',{source:frame.contentWindow,data:{type:'wildwordopia-manager-images',token,selections:stale}});
    assert.equal(image(client,'kaput'),api.resolve(six,{},appURL).kaput.src);
    client.emit('message',{source:frame.contentWindow,data:{type:'wildwordopia-manager-images',token:'wrong',selections:{kaput:{id:'new',src:'../work/image/new.png',updatedAt:nextTime}}}});
    assert.equal(image(client,'kaput'),api.resolve(six,{},appURL).kaput.src);
    assert.equal(snapshot([...client.browser.storage]),client.browser.before);
  }
  chrome.channels[0].onmessage({data:{kaput:{id:'preview',src:'../work/image/new-preview.png',updatedAt:oldTime,selectionMode:'explicit',selectedAt:nextTime}}});
  assert.equal(image(chrome,'kaput'),'file:///D:/Projects/etymolingo/work/image/new-preview.png');
  assert.equal(image(other,'kaput'),api.resolve(six,{},appURL).kaput.src);
});

test('newer local preview is kept until explicitly shared; older or same-time preview cannot hide common choice', () => {
  for (const time of [undefined,'invalid',oldTime,savedAt]) {
    const result = api.resolve(shared,{kaput:{id:'old',src:'../work/image/old.png',updatedAt:time}},appURL);
    assert.equal(result.kaput.id,shared.selections.kaput.id);
  }
  const local = {kaput:{id:'new-preview',src:'../work/image/new-preview.png',updatedAt:oldTime,selectionMode:'explicit',selectedAt:nextTime}};
  const before = snapshot({shared,local});
  const result = api.resolve(shared,local,appURL);
  assert.equal(result.kaput.id,'new-preview');
  assert.equal(result.per1.id,'v017');
  assert.equal(snapshot({shared,local}),before);
});

test('explicit legacy migration exports exact published choices, retains other common roots, and stores portable paths', () => {
  const published = {kaput:{id:'chrome-exact-published',src:'file:///D:/Projects/etymolingo/work/image/chrome-exact.png?v=old#preview',updatedAt:oldTime}};
  const before = snapshot({shared,published});
  const result = api.bundle(shared,published,appURL,nextTime);
  assert.equal(result.selections.kaput.id,'chrome-exact-published');
  assert.equal(result.selections.kaput.path,'../work/image/chrome-exact.png');
  assert.equal(result.selections.per1.id,'v017');
  assert.equal(result.savedAt,nextTime);
  assert.ok(!snapshot(result).includes('file:'));
  assert.ok(!snapshot(result).includes('"src"'));
  assert.equal(snapshot({shared,published}),before);
  assert.throws(()=>api.bundle(null,{},appURL));
});

test('normalization rejects malformed, external, non-PNG, and traversal paths without losing valid entries', () => {
  const valid = {id:'v001',src:'../work/image/valid.png',updatedAt:oldTime};
  const invalid = [
    null,{},[],{id:'bad id',src:valid.src},{id:'v001'},
    {id:'v001',src:'javascript:alert(1)'},
    {id:'v001',src:'data:image/png;base64,AA=='},
    {id:'v001',src:'blob:file:///image'},
    {id:'v001',src:'https://example.com/picture.png'},
    {id:'v001',src:'file:///D:/Elsewhere/secret.png'},
    {id:'v001',src:'file:///C:/Users/user/picture.png'},
    {id:'v001',src:'../../outside.png'},
    {id:'v001',src:'../%2e%2e/outside.png'},
    {id:'v001',src:'../work/image/%2e%2e%2f%2e%2e%2f%2e%2e%2foutside.png'},
    {id:'v001',src:'../work/image/%2e%2e%5coutside.png'},
    {id:'v001',src:'../work/image/not-a-png.svg'},
    {id:'v001',src:'file://another-host/D:/Projects/etymolingo/work/image/remote.png'}
  ];
  for (const item of invalid) {
    const value = {kaput:valid,per1:item};
    assert.deepEqual(Object.keys(api.normalize(value,appURL)),['kaput'],snapshot(item));
    assert.throws(()=>api.normalize(value,appURL,true),snapshot(item));
  }
  assert.deepEqual(api.normalize({schema:2,selections:{}},appURL),{});
  assert.deepEqual(api.normalize({'../bad':valid},appURL),{});
});

test('portable shared paths resolve under another project location and HTTP origin', () => {
  const moved = api.resolve(shared,{},'file:///E:/Copy/etymolingo/app/wild-wordopia.html');
  assert.equal(moved.kaput.src,'file:///E:/Copy/etymolingo/work/image/root-kaput-v017-flat-anime-v006.png');
  const web = api.resolve(shared,{},'http://127.0.0.1:8964/app/wild-wordopia.html');
  assert.equal(web.per1.src,'http://127.0.0.1:8964/assets/chara/brainrot/library/root-per1-v017.png');
  assert.deepEqual(api.normalize({kaput:{id:'v001',src:'http://127.0.0.1:9999/image.png'}},'http://127.0.0.1:8964/app/wild-wordopia.html'),{});
});

test('serialized common selection is a standalone classic script with escaped markup', () => {
  const value = api.bundle(shared,{},appURL,nextTime);
  value.note = '</script><script>unexpected()</script>';
  const text = api.serialize(value);
  assert.ok(!text.includes('</script>'));
  const context = {window:{}};
  vm.runInNewContext(text,context,{filename:api.filename});
  assert.deepEqual(plain(context.window.WILDWORDOPIA_SITE_IMAGE_SELECTIONS),value);
});

test('picker success is reported only after write and close complete', async () => {
  const value = api.bundle(shared,{},appURL,nextTime),before = snapshot(value);
  let release,entered,closed=false,settled=false,payload='';
  const closeEntered = new Promise(resolve=>{entered=resolve;});
  const closing = new Promise(resolve=>{release=resolve;});
  const pending = api.save(value,{showSaveFilePicker:async options=>{
    assert.equal(options.suggestedName,'site-image-selections.js');
    return {createWritable:async()=>({write:async text=>{payload=text;},close:async()=>{entered();await closing;closed=true;}})};
  }}).then(result=>{settled=true;return result;});
  await closeEntered;
  assert.equal(settled,false);
  release();
  assert.deepEqual(await pending,{status:'saved'});
  assert.equal(closed,true);
  assert.equal(payload,api.serialize(value));
  assert.equal(snapshot(value),before);
});

test('picker cancellation and create/write/close failure preserve choices and never report saved', async () => {
  const value = api.bundle(shared,{},appURL,nextTime),before = snapshot(value);
  for (const step of ['picker','create','write','close']) {
    const storage = new Map([
      ['wildwordopia.manager-published.v1','exact published data'],
      ['wildwordopia.manager-official.v1','draft choices'],
      ['wildwordopia.root-candidate-review.v1','comments and reviews'],
      ['wildwordopia.deleted-images.v1','prior hidden images']
    ]),saved = snapshot([...storage]);
    let aborted=0;
    const fail=()=>{const error=Error(step);if(step==='picker')error.name='AbortError';throw error;};
    const env={localStorage:storage,showSaveFilePicker:async()=>{
      if(step==='picker')fail();
      return {createWritable:async()=>{
        if(step==='create')fail();
        return {write:async()=>{if(step==='write')fail();},close:async()=>{if(step==='close')fail();},abort:async()=>{aborted++;}};
      }};
    }};
    await assert.rejects(api.save(value,env),new RegExp(step));
    assert.equal(aborted,['write','close'].includes(step)?1:0,step);
    assert.equal(snapshot([...storage]),saved,step);
    assert.equal(snapshot(value),before,step);
  }
});

test('ordinary download fallback reports downloaded rather than successful shared save', async () => {
  const value = api.bundle(shared,{},appURL,nextTime),before = snapshot(value);
  let blob,appended,clicked=0,removed=0,revoke;
  const anchor={click(){clicked++;},remove(){removed++;}};
  const result = await api.save(value,{
    Blob,URL:{createObjectURL(value){blob=value;return 'blob:temporary';},revokeObjectURL(value){revoke=value;}},
    document:{createElement(tag){assert.equal(tag,'a');return anchor;},body:{append(value){appended=value;}}},
    setTimeout(fn,ms){assert.equal(ms,60000);fn();}
  });
  assert.deepEqual(result,{status:'downloaded'});
  assert.equal(anchor.download,api.filename);
  assert.equal(anchor.href,'blob:temporary');
  assert.equal(appended,anchor);assert.equal(clicked,1);assert.equal(removed,1);
  assert.equal(revoke,'blob:temporary');assert.equal(await blob.text(),api.serialize(value));
  assert.equal(snapshot(value),before);
});

test('current entrances and regeneration template load common selections before the client', () => {
  for (const file of ['app/wild-wordopia.html','tools/wild-wordopia-template.html']) {
    const source=fs.readFileSync(path.join(root,file),'utf8');
    const store=source.indexOf('shared/manager-site-image-store.js');
    const common=source.indexOf('support/character-manager/site-image-selections.js');
    const consumer=source.indexOf('shared/manager-site-images.js');
    assert.ok(store>=0&&common>=0&&consumer>store&&consumer>common,file);
    assert.ok(source.includes('WILDWORDOPIA_MANAGER_IMAGE'),file);
  }
  const manager=fs.readFileSync(path.join(root,'app/character-manager.html'),'utf8');
  assert.ok(manager.indexOf('shared/manager-site-image-store.js')>=0);
  assert.ok(manager.indexOf('support/character-manager/site-image-selections.js')>=0);
  assert.ok(manager.indexOf('support/character-manager/site-image-selections.js')<manager.indexOf('support/character-manager/site-selection.js'));
});
