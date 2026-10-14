'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
const syncSource = fs.readFileSync(path.join(root, 'assets/chara/brainrot/selection-sync.js'), 'utf8');
const siteSource = fs.readFileSync(path.join(root, 'assets/chara/brainrot/site-characters.js'), 'utf8');
// The first two generated lines are a release snapshot. Fixtures below deliberately
// give it an older candidate list than the library the review page actually reads.
const runtimeSource = siteSource.split(/\r?\n/).slice(2).join('\n');
const reviewHtml = fs.readFileSync(path.join(root, 'app/wildwordopia.html'), 'utf8');
const storageKey = 'wildwordopia.root-candidate-review.v1';
const backupKey = 'wildwordopia.root-candidate-review.backup.v1';
const legacyKey = 'wildwordopia.root-candidate-review.top100-backup.v1';

function family(id, candidates, defaultId = candidates[0]) {
  return {
    id,
    rootKey: id,
    meaning: id,
    defaultPreviewCandidateId: defaultId,
    rootCharacterName: {kana: 'name-' + id},
    candidates: candidates.map(candidateId => ({
      candidateId,
      file: `root-${id}-${candidateId}.png`,
      motifs: [{word: id + '-' + candidateId}],
    })),
  };
}

function environment({saved = {}, search = '', bridge = false} = {}) {
  const values = new Map(Object.entries(saved));
  const writes = [];
  const events = [];
  const messages = [];
  const intervals = [];
  const listeners = new Map();
  let documentAccesses = 0;
  const parent = {postMessage: (...args) => messages.push(args)};
  const context = {
    console,
    URL,
    URLSearchParams,
    Event,
    crypto: {randomUUID: () => '12345678-1234-1234-1234-123456789abc'},
    location: new URL((bridge ? 'file:///D:/etymolingo/app/wildwordopia.html' :
      'http://localhost:8781/app/wild-wordopia.html') + search),
    localStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => {writes.push([key, value]); values.set(key, String(value));},
      removeItem: key => {writes.push([key, null]); values.delete(key);},
    },
    document: new Proxy({}, {
      get(_target, property) {
        documentAccesses++;
        throw new Error('Review initialization accessed document.' + String(property));
      },
    }),
    setInterval: callback => {intervals.push(callback); return intervals.length;},
    addEventListener: (name, callback) => {
      const handlers = listeners.get(name) || [];
      handlers.push(callback);
      listeners.set(name, handlers);
    },
    dispatchEvent: event => {
      events.push(event.type);
      for (const callback of listeners.get(event.type) || []) callback(event);
      return true;
    },
    fetch: () => {throw new Error('Bridge mode tried to fetch review data');},
  };
  context.window = context;
  context.parent = bridge ? parent : context;
  context.name = bridge ? 'wildwordopia-selection-bridge' : '';
  vm.createContext(context);
  const run = (source, filename) => vm.runInContext(source, context, {filename});
  run(syncSource, 'selection-sync.js');
  return {context, values, writes, events, messages, intervals, parent, run,
    documentAccesses: () => documentAccesses};
}

function loadSite(env) {
  env.context.WILDWORDOPIA_SELECTED = {weid: 'v012', men1: 'v001', bha2: 'v001', genu1: 'v001'};
  env.context.WILDWORDOPIA_SITE_CATALOG = [family('weid', ['v012'])];
  env.context.WILDWORDOPIA_LIBRARY = {characters: [
    family('weid', ['v012', 'v035'], 'v012'),
    family('men1', ['v001', 'v002']),
    family('bha2', ['v001', 'v002']),
    family('genu1', ['v001', 'v002']),
  ]};
  assert.match(runtimeSource, /wwStored/, 'Site runtime must follow the two generated snapshot lines');
  env.run(runtimeSource, 'site-characters.runtime.js');
}

function character(env, id) {
  return env.context.ETYMOPEDIA_BRAINROT.characters.find(item => item.id === id);
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('saved weid v035 resolves from the current library when the site snapshot lacks it', () => {
  const env = environment({saved: {[storageKey]: JSON.stringify({previews: {weid: 'v035'}})}});
  loadSite(env);
  assert.equal(character(env, 'weid').file, 'library/root-weid-v035.png');
  assert.equal(character(env, 'weid').candidates[0].candidateId, 'v035');
  assert.equal(character(env, 'weid').motifs[0].word, 'weid-v035');
  assert.equal(env.context.WILDWORDOPIA_TOP30.characters, env.context.ETYMOPEDIA_BRAINROT.characters);
});

test('backup previews survive a corrupt primary and the current backup wins legacy ties', () => {
  const env = environment({saved: {
    [legacyKey]: JSON.stringify({previews: {weid: 'v012', genu: 'v002'}}),
    [backupKey]: JSON.stringify({previews: {weid: 'v035', men1: 'v002'}}),
    [storageKey]: '{damaged-json',
  }});
  assert.deepEqual(plain(env.context.WILDWORDOPIA_SELECTION_SYNC.read()),
    {weid: 'v035', genu: 'v002', genu1: 'v002', men1: 'v002'});
  loadSite(env);
  assert.equal(character(env, 'weid').file, 'library/root-weid-v035.png');
  assert.equal(character(env, 'genu').file, 'library/root-genu1-v002.png');
  assert.equal(env.writes.length, 0);
});

test('a corrupt selected query preserves saved previews', () => {
  const env = environment({
    saved: {[storageKey]: JSON.stringify({previews: {weid: 'v035'}})},
    search: '?selected=' + encodeURIComponent('{invalid-json'),
  });
  loadSite(env);
  assert.equal(character(env, 'weid').file, 'library/root-weid-v035.png');
  assert.deepEqual(plain(env.context.WILDWORDOPIA_SELECTION_SYNC.query()), {});
});

test('latest saved choices survive a stale query, which still supplies unsaved roots', () => {
  const env = environment({
    saved: {[storageKey]: JSON.stringify({previews: {weid: 'v035', men1: 'v002'}})},
    search: '?selected=' + encodeURIComponent(JSON.stringify({weid: 'v012', men1: '../wrong.png', bha2: 'v002'})),
  });
  loadSite(env);
  assert.equal(character(env, 'weid').file, 'library/root-weid-v035.png');
  assert.equal(character(env, 'men').file, 'library/root-men1-v002.png');
  assert.equal(character(env, 'bha').file, 'library/root-bha2-v002.png');
});

test('selection changes update all mapped aliases and emit one event per actual change', () => {
  const env = environment();
  loadSite(env);
  assert.deepEqual(env.events, []);
  env.values.set(storageKey, JSON.stringify({previews: {
    weid: 'v035', men1: 'v002', bha2: 'v002', genu1: 'v002',
  }}));
  env.context.dispatchEvent({type: 'storage', key: storageKey});
  for (const [id, rootId] of [['weid', 'weid'], ['men', 'men1'], ['bha', 'bha2'], ['genu', 'genu1']]) {
    assert.equal(character(env, id).file, `library/root-${rootId}-${id === 'weid' ? 'v035' : 'v002'}.png`);
  }
  assert.deepEqual(env.events.filter(name => name === 'wildwordopia-selection-changed'),
    ['wildwordopia-selection-changed']);
  env.context.dispatchEvent({type: 'storage', key: storageKey});
  assert.equal(env.events.filter(name => name === 'wildwordopia-selection-changed').length, 1);
  assert.equal(env.context.WILDWORDOPIA_TOP30.characters, env.context.ETYMOPEDIA_BRAINROT.characters);
});

test('bridge mode sends only previews and never initializes, renders, or writes reviews', () => {
  const savedReview = JSON.stringify({
    previews: {weid: 'v035'},
    reviews: {'weid:v035': {decision: 'reject', comment: 'preserve this note'}},
  });
  const env = environment({bridge: true, saved: {[storageKey]: savedReview}});
  assert.equal(env.context.WILDWORDOPIA_SELECTION_SYNC.isBridge, true);
  const inlineScripts = [...reviewHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/\bsrc\s*=/i.test(match[1])).map(match => match[2]);
  assert.ok(inlineScripts.length > 0, 'Exercise the actual review page inline script');
  inlineScripts.forEach((source, index) => env.run(source, `wildwordopia.inline-${index}.js`));
  const token = '12345678-1234-1234-1234-123456789abc';
  env.context.dispatchEvent({type: 'message', source: env.parent, origin: 'null',
    data: {type: 'wildwordopia-selection-request-v1', token}});
  assert.equal(env.documentAccesses(), 0);
  assert.equal(env.writes.length, 0);
  assert.equal(env.values.get(storageKey), savedReview);
  assert.equal(env.messages.length, 1);
  assert.deepEqual(plain(env.messages[0]), [
    {type: 'wildwordopia-selection-response-v1', token, previews: {weid: 'v035'}}, '*',
  ]);
  env.values.set(storageKey, JSON.stringify({previews: {weid: 'v012'}, reviews: {private: 'kept'}}));
  env.intervals.forEach(callback => callback());
  assert.equal(env.messages.length, 2);
  assert.deepEqual(plain(env.messages[1][0].previews), {weid: 'v012'});
  assert.equal(env.writes.length, 0);
});
