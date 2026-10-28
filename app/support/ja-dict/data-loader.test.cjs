const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const loader = fs.readFileSync(path.join(__dirname, 'data-loader.js'), 'utf8');
const hash = 'a'.repeat(64);
const metadata = {schema: 1, index: {file: 'index-' + hash + '.js', sha256: hash},
  shards: {あ: {file: 'det-3042-' + hash + '.js', sha256: hash},
    か: {file: 'det-304b-' + hash + '.js', sha256: hash}}};

function harness(protocol = 'file:') {
  const requests = [], timers = new Set(), replies = new Map();
  let context;
  const document = {
    currentScript: {src: protocol === 'file:' ? 'file:///fixture/app/support/ja-dict/data-loader.js'
      : 'http://127.0.0.1:8784/app/support/ja-dict/data-loader.js'},
    createElement: () => ({remove() {}}),
    head: {appendChild(element) {
      requests.push(element.src);
      queueMicrotask(() => {
        const reply = replies.get(new URL(element.src).pathname.split('/').pop());
        if (!reply) return element.onerror();
        reply(context.JaDictData);
        element.onload();
      });
    }}
  };
  context = vm.createContext({document, location: {protocol}, URL,
    setTimeout(fn, delay) {const id = setTimeout(fn, delay); timers.add(id); return id;},
    clearTimeout(id) {timers.delete(id); clearTimeout(id);},
    fetch: async url => {requests.push(url.href); return {ok: true, json: async () => [{via: 'http'}]};}
  });
  vm.runInContext(loader, context);
  replies.set('manifest.js', api => api.registerManifest(metadata));
  replies.set(metadata.index.file, api => api.register('index', hash, [['あ']]));
  replies.set(metadata.shards.あ.file, api => api.register('あ', hash, {あ: [['辞書', '', '', 'あの本文']]}));
  replies.set(metadata.shards.か.file, api => api.register('か', hash, {か: [['辞書', '', '', 'かの本文']]}));
  return {api: context.JaDictData, requests, replies, timers};
}

test('direct-mode index and lazy concurrent shards use scripts, share requests, and retain different entries', async () => {
  const h = harness();
  assert.deepEqual(await h.api.loadIndex(), [['あ']]);
  assert.equal(h.requests.length, 2);
  const [a, same, k] = await Promise.all([h.api.loadShard('あ'), h.api.loadShard('あ'), h.api.loadShard('か')]);
  assert.equal(a, same);
  assert.equal(a.あ[0][3], 'あの本文');
  assert.equal(k.か[0][3], 'かの本文');
  assert.equal(await h.api.loadShard('あ'), a);
  assert.equal(h.requests.length, 4);
  assert.equal(h.timers.size, 0);
});

test('missing detail reports an error and a subsequent attempt can recover', async () => {
  const h = harness();
  const reply = h.replies.get(metadata.shards.あ.file);
  h.replies.delete(metadata.shards.あ.file);
  await assert.rejects(h.api.loadShard('あ'), /読み込めません/);
  h.replies.set(metadata.shards.あ.file, reply);
  assert.equal((await h.api.loadShard('あ')).あ[0][3], 'あの本文');
});

test('wrong generation cannot silently display missing dictionary content', async () => {
  const h = harness();
  h.replies.set(metadata.shards.あ.file, api => api.register('あ', 'b'.repeat(64), {}));
  await assert.rejects(h.api.loadShard('あ'), /世代が一致しません/);
  assert.equal(h.timers.size, 0);
});

test('missing manifest can be retried', async () => {
  const h = harness();
  h.replies.delete('manifest.js');
  await assert.rejects(h.api.loadIndex(), /読み込めません/);
  h.replies.set('manifest.js', api => api.registerManifest(metadata));
  assert.deepEqual(await h.api.loadIndex(), [['あ']]);
});

test('HTTP retains JSON fetch paths and never requests local snapshots', async () => {
  const h = harness('http:');
  assert.deepEqual(await h.api.loadIndex(), [{via: 'http'}]);
  await h.api.loadShard('あ');
  assert.deepEqual(h.requests, ['http://127.0.0.1:8784/app/data/ja/ja_index.json',
    'http://127.0.0.1:8784/app/data/ja/ja_det/%E3%81%82.json']);
});

test('every generated public record reconstructs the original JSON exactly', () => {
  const data = path.resolve(__dirname, '../../data/ja');
  let manifest;
  const ctx = vm.createContext({JaDictData: {registerManifest(value) {manifest = value;}}});
  vm.runInContext(fs.readFileSync(path.join(data, 'file/manifest.js'), 'utf8'), ctx);
  const entries = [['index', manifest.index, 'ja_index.json'], ...Object.entries(manifest.shards)
    .map(([key, entry]) => [key, entry, 'ja_det/' + key + '.json'])];
  let indexRecords = 0, detailRecords = 0;
  for (const [key, entry, source] of entries) {
    const original = fs.readFileSync(path.join(data, source));
    assert.equal(crypto.createHash('sha256').update(original).digest('hex'), entry.sha256);
    let reconstructed;
    ctx.JaDictData.register = (receivedKey, receivedHash, value) => {
      assert.equal(receivedKey, key);
      assert.equal(receivedHash, entry.sha256);
      reconstructed = JSON.parse(JSON.stringify(value));
    };
    vm.runInContext(fs.readFileSync(path.join(data, 'file', entry.file), 'utf8'), ctx);
    assert.deepEqual(reconstructed, JSON.parse(original.toString('utf8')));
    assert.equal(key === 'index' ? reconstructed.length : Object.keys(reconstructed).length, entry.records);
    if (key === 'index') indexRecords = entry.records;
    else detailRecords += entry.records;
  }
  console.log(JSON.stringify({indexRecords, detailRecords, detailShards: entries.length - 1, identical: true}));
});
