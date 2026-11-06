const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Pronunciation, chooseVoice } = require('./pronunciation.js');

const moon = { id: 'moon', w: 'つき', ja: '月', en: 'moon' };
const ja = { name: 'Japanese', lang: 'ja-JP', localService: true };
const en = { name: 'English', lang: 'en-US', localService: true };
function setup(voices = [ja, en], options = {}) {
  const states = [], timers = new Map(), timerDelays = new Map(), calls = [];
  let nextTimer = 0, cancelled = 0, changed;
  const synth = {
    voices, getVoices() { return this.voices; },
    addEventListener(event, fn) { changed = fn; },
    cancel() { cancelled++; }, speak(utterance) { calls.push(utterance); },
  };
  class Utterance { constructor(text) { this.text = text; } }
  const speech = new Pronunciation({ synth, Utterance, onState: state => states.push(state),
    setTimer: (fn, delay) => { const id = ++nextTimer; timers.set(id, fn); timerDelays.set(id, delay); return id; },
    clearTimer: id => { timers.delete(id); timerDelays.delete(id); }, ...options });
  return { speech, synth, states, calls, timers, timerDelays, changed: () => changed(), cancelled: () => cancelled };
}

test('Japanese uses the dictionary reading and English uses the English word', () => {
  const x = setup();
  x.speech.speak(moon, 'ja');
  assert.equal(x.calls[0].text, 'つき'); assert.equal(x.calls[0].lang, 'ja-JP'); assert.equal(x.calls[0].voice, ja);
  x.calls[0].onstart(); x.calls[0].onend();
  assert.deepEqual(x.states.map(s => s.state), ['queued', 'speaking', 'finished']);
  assert.equal(x.timers.size, 0);
  x.speech.speak(moon, 'en');
  assert.equal(x.calls[1].text, 'moon'); assert.equal(x.calls[1].lang, 'en-US'); assert.equal(x.calls[1].voice, en);
});

test('replay replaces the old utterance; late callbacks cannot finish the new one', () => {
  const x = setup(); x.speech.speak(moon, 'ja'); const old = x.calls[0];
  x.speech.speak(moon, 'en');
  assert.equal(x.cancelled(), 1);
  const count = x.states.length;
  old.onstart(); old.onend(); old.onerror({ error: 'interrupted' });
  assert.equal(x.states.length, count);
  assert.equal(x.states.at(-1).language, 'en');
  x.calls[1].onstart(); assert.equal(x.states.at(-1).state, 'speaking');
});

test('slow replay lowers the rate without changing the text, language or pitch', () => {
  const x = setup(); x.speech.speak(moon, 'en'); x.speech.speak(moon, 'en', true);
  const [normal, slow] = x.calls;
  assert.ok(slow.rate < normal.rate); assert.equal(slow.text, normal.text); assert.equal(slow.lang, normal.lang); assert.equal(slow.pitch, 1);
});

test('prepared Japanese and English words restore normal speed after slow synthesis', () => {
  for (const language of ['ja', 'en']) {
    const x = setup(); x.speech.prepare(moon);
    x.speech.speak(moon, language, true);
    assert.equal(x.calls.at(-1).rate, .65);
    assert.equal(x.calls.at(-1).pitch, 1);
    x.calls.at(-1).onend();
    x.speech.speak(moon, language, false);
    assert.equal(x.calls.at(-1).rate, 1);
    assert.equal(x.calls.at(-1).text, language === 'ja' ? 'つき' : 'moon');
  }
});

test('muting cancels pending speech and prevents further speech until re-enabled', () => {
  const x = setup(); x.speech.speak(moon, 'ja'); x.speech.setEnabled(false);
  assert.equal(x.cancelled(), 1); assert.equal(x.timers.size, 0);
  assert.equal(x.speech.speak(moon, 'en'), false); assert.equal(x.calls.length, 1); assert.equal(x.states.at(-1).state, 'muted');
  x.speech.setEnabled(true); assert.equal(x.speech.speak(moon, 'en'), true); assert.equal(x.calls.length, 2);
});

test('an explicit listening request works while automatic sound stays muted', () => {
  const x=setup();x.speech.setEnabled(false);
  assert.equal(x.speech.speak(moon,'en',false,true),true);
  assert.equal(x.calls[0].text,'moon');
  assert.equal(x.speech.enabled,false);
  assert.equal(x.speech.speak(moon,'ja'),false);
});

test('stopping for a new puzzle invalidates the old callbacks and watchdog', () => {
  const x = setup(); x.speech.speak(moon, 'ja'); x.speech.stop();
  assert.equal(x.speech.current, null); assert.equal(x.timers.size, 0);
  x.calls[0].onend(); assert.equal(x.states.at(-1).state, 'idle');
});

test('a missing language never falls back to a voice of the wrong language', () => {
  const x = setup([en]); assert.equal(x.speech.speak(moon, 'ja'), false); assert.equal(x.calls.length, 0);
  assert.equal(x.states.at(-1).state, 'unavailable');
  x.synth.voices.push(ja); x.changed(); assert.equal(x.speech.speak(moon, 'ja'), true);
  assert.equal(x.calls[0].voice, ja);
  assert.equal(chooseVoice([{ lang: 'en-GB' }, en], 'en'), en);
});

test('an initially empty voice list still requests the correct locale', () => {
  const x = setup([]); assert.equal(x.speech.speak(moon, 'ja'), true);
  assert.equal(x.calls[0].lang, 'ja-JP'); assert.equal(x.calls[0].voice, undefined);
});

test('speech errors and a stalled engine leave a retryable state', () => {
  const x = setup(); x.speech.speak(moon, 'ja'); x.calls[0].onerror({ error: 'not-allowed' });
  assert.equal(x.states.at(-1).error, 'not-allowed'); assert.equal(x.timers.size, 0);
  x.speech.speak(moon, 'ja'); const timeout = [...x.timers.values()][0]; timeout();
  assert.equal(x.states.at(-1).error, 'timeout'); assert.equal(x.speech.current, null); assert.equal(x.cancelled(), 1);
  x.calls[1].onend(); assert.equal(x.states.at(-1).state, 'error');
});

test('unsupported engines are handled without breaking the reward', () => {
  const states = []; const speech = new Pronunciation({ synth: null, Utterance: null, onState: state => states.push(state) });
  assert.equal(speech.speak(moon, 'ja'), false); assert.equal(states[0].state, 'unavailable');
});

test('a local voice wins over a remote dialect match but never another language',()=>{
 const local={lang:'en-GB',localService:true},remote={lang:'en-US',localService:false,default:true};
 assert.equal(chooseVoice([remote,local,ja],'en'),local);
 assert.equal(chooseVoice([remote,ja],'en'),remote);
});
test('known voices are reused and playback is submitted synchronously without waiting for timers',()=>{
 const x=setup();let reads=0;x.synth.getVoices=()=>{reads++;return [ja,en]};
 x.speech.speak(moon,'en');assert.equal(x.calls.length,1);assert.equal(reads,0);
 x.changed();assert.equal(reads,1);x.speech.speak(moon,'ja');assert.equal(x.calls.length,2);assert.equal(reads,1);
});


test('prepared word utterances are reused on the immediate user request',()=>{
 const x=setup();x.speech.prepare(moon);
 const prepared=x.speech.prepared.get(`en:${moon.en}`);
 x.speech.setEnabled(false);x.speech.speak(moon,'en',false,true);
 assert.equal(x.calls.length,1);assert.equal(x.calls[0],prepared);
});

const scene = { status: 'reviewed', ttsAllowed: true,
  entry: { scene: { en: 'The moon shines above a quiet house.', ja: '月が静かな家の上に輝いています。' } } };

test('reviewed scene preparation is silent and preselects the exact local English voice', async () => {
  const x = setup();
  assert.equal(await x.speech.prepareScene(moon, scene, 'en'), true);
  assert.equal(x.calls.length, 0); assert.deepEqual(x.states, []);
  const prepared = x.speech.prepared.get(`en:${scene.entry.scene.en}`);
  assert.equal(prepared.text, scene.entry.scene.en); assert.equal(prepared.voice, en);
  assert.equal(x.speech.speakScene(moon, scene, 'en'), true);
  assert.equal(x.calls[0], prepared); assert.equal(x.calls[0].lang, 'en-US');
  assert.equal(x.speech.prepared.size, 0);
});

test('scene preparation waits for asynchronous voices before choosing the language', async () => {
  const x = setup([]), pending = x.speech.prepareScene(moon, scene, 'en');
  assert.equal(x.speech.prepared.size, 0); assert.equal(x.timers.size, 1);
  assert.equal(x.calls.length, 0); assert.deepEqual(x.states, []);
  x.synth.voices = [ja, en]; x.changed();
  assert.equal(await pending, true); assert.equal(x.timers.size, 0);
  assert.equal(x.speech.prepared.get(`en:${scene.entry.scene.en}`).voice, en);
  assert.equal(x.speech.voiceWaiters.size, 0);
});

test('voice discovery has a bounded fallback to an exact locale when no list is exposed', async () => {
  const x = setup([]), pending = x.speech.prepareScene(moon, scene, 'en');
  assert.equal(x.timers.size, 1); [...x.timers.values()][0]();
  assert.equal(await pending, true); assert.equal(x.timers.size, 0); assert.equal(x.speech.voiceWaiters.size, 0);
  assert.equal(x.speech.speakScene(moon, scene, 'en'), true);
  assert.equal(x.calls[0].text, scene.entry.scene.en); assert.equal(x.calls[0].lang, 'en-US');
  assert.equal(x.calls[0].voice, undefined);
});

test('scene preparation never adds a headword, draft, warmup prefix or wrong-language fallback', async () => {
  for (const invalid of [{ ...scene, status: 'draft' }, { ...scene, ttsAllowed: false },
    { ...scene, entry: { scene: { ja: '日本語だけ' } } }]) {
    const x = setup(); assert.equal(await x.speech.prepareScene(moon, invalid, 'en'), false);
    assert.equal(x.speech.prepared.size, 0); assert.equal(x.calls.length, 0); assert.deepEqual(x.states, []);
  }
  const x = setup([ja]); assert.equal(await x.speech.prepareScene(moon, scene, 'en'), false);
  assert.equal(x.speech.prepared.size, 0); assert.equal(x.calls.length, 0);
});

test('stop or a newer preparation prevents a late voice event from installing stale scene speech', async () => {
  const x = setup([]), stale = x.speech.prepareScene(moon, scene, 'en');
  x.speech.stop(); x.synth.voices = [en]; x.changed();
  assert.equal(await stale, false); assert.equal(x.speech.prepared.size, 0);
  const y = setup([]), old = y.speech.prepareScene(moon, scene, 'en');
  const newer = { ...scene, entry: { scene: { en: 'The moon is behind the clouds.' } } };
  const latest = y.speech.prepareScene(moon, newer, 'en');
  y.synth.voices = [en]; y.changed();
  assert.equal(await old, false); assert.equal(await latest, true);
  assert.deepEqual([...y.speech.prepared.keys()], [`en:${newer.entry.scene.en}`]);
  assert.equal(y.timers.size, 0);
});

test('a prepared utterance is used once so canceled callbacks cannot finish its replay', () => {
  const x = setup(); x.speech.prepare(moon); x.speech.speak(moon, 'en'); const old = x.calls[0];
  x.speech.speak(moon, 'en'); const replay = x.calls[1];
  assert.notEqual(replay, old); const count = x.states.length;
  old.onstart(); old.onerror({ error: 'interrupted' }); old.onend();
  assert.equal(x.states.length, count); assert.equal(x.speech.current.utterance, replay);
  replay.onstart(); assert.equal(x.states.at(-1).state, 'speaking');
});

test('autoplay denial remains explicit and a later gesture resubmits the full exact scene', async () => {
  const x = setup(); await x.speech.prepareScene(moon, scene, 'en');
  x.speech.speakScene(moon, scene, 'en'); const automatic = x.calls[0];
  automatic.onerror({ error: 'not-allowed' });
  assert.equal(x.states.at(-1).error, 'not-allowed'); assert.equal(x.speech.current, null);
  assert.equal(x.timers.size, 0); assert.equal(x.states.some(state => state.state === 'speaking'), false);
  assert.equal(x.speech.speakScene(moon, scene, 'en'), true);
  assert.notEqual(x.calls[1], automatic); assert.equal(x.calls[1].text, scene.entry.scene.en);
  x.calls[1].onstart(); assert.equal(x.states.at(-1).state, 'speaking');
});

test('synchronous browser autoplay rejection preserves not-allowed for the replay fallback', () => {
  const x = setup(); x.synth.speak = () => { const error = new Error('User activation required'); error.name = 'NotAllowedError'; throw error; };
  assert.equal(x.speech.speakScene(moon, scene, 'en'), false);
  assert.equal(x.states.at(-1).error, 'not-allowed'); assert.equal(x.timers.size, 0);
  assert.equal(x.speech.current, null);
});

test('opt-in scene initialization completes the same exact caption silently before audible playback', async () => {
  const x = setup([ja, en], { primeScenes: true });
  await x.speech.prepareScene(moon, scene, 'en');
  assert.equal(x.speech.speakScene(moon, scene, 'en'), true);
  const primer = x.calls[0];
  assert.equal(primer.text, scene.entry.scene.en); assert.equal(primer.voice, en);
  assert.equal(primer.volume, 0); assert.equal(primer.rate, 10);
  assert.equal(x.states.at(-1).kind, 'preparing-scene'); assert.equal(x.states.at(-1).state, 'queued');
  assert.deepEqual([...x.timerDelays.values()], [5000]);
  primer.onstart();
  assert.equal(x.states.at(-1).state, 'preparing'); assert.equal(x.calls.length, 1);
  assert.equal(x.states.some(s => s.kind === 'scene' && s.state === 'speaking'), false);
  primer.onend();
  const audible = x.calls[1];
  assert.notEqual(audible, primer); assert.equal(audible.text, primer.text); assert.equal(audible.voice, primer.voice);
  assert.equal(audible.volume, 1); assert.equal(audible.rate, 1);
  assert.deepEqual(x.states.map(s => `${s.kind}:${s.state}`),
    ['preparing-scene:queued', 'preparing-scene:preparing', 'preparing-scene:prepared', 'scene:queued']);
  audible.onstart(); assert.equal(x.states.at(-1).state, 'speaking'); assert.equal(x.states.at(-1).kind, 'scene');
  audible.onend(); assert.equal(x.timers.size, 0);
});

test('a successfully initialized voice is reused in this document but a new voice needs its own initialization', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speakScene(moon, scene, 'en'); x.calls[0].onstart(); x.calls[0].onend();
  x.calls[1].onstart(); x.calls[1].onend();
  x.speech.speakScene(moon, scene, 'en');
  assert.equal(x.calls.length, 3); assert.equal(x.calls[2].volume, 1);
  x.calls[2].onend();
  x.synth.voices = [{ ...en, name: 'Different English Voice', voiceURI: 'different-voice' }]; x.changed();
  x.speech.speakScene(moon, scene, 'en');
  assert.equal(x.calls.length, 4); assert.equal(x.calls[3].volume, 0);
});

test('denied initialization is not cached and a gesture retries initialization before any audible speech', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speakScene(moon, scene, 'en'); const denied = x.calls[0]; denied.onerror({ error: 'not-allowed' });
  assert.equal(x.calls.length, 1); assert.equal(x.speech.primedVoices.size, 0);
  assert.equal(x.states.at(-1).kind, 'preparing-scene'); assert.equal(x.states.at(-1).error, 'not-allowed');
  assert.equal(x.speech.current, null); assert.equal(x.timers.size, 0);
  assert.equal(x.speech.speakScene(moon, scene, 'en'), true);
  const retry = x.calls[1]; assert.notEqual(retry, denied); assert.equal(retry.volume, 0);
  retry.onstart(); retry.onend(); assert.equal(x.calls[2].volume, 1);
  assert.equal(x.calls[2].text, scene.entry.scene.en);
});

test('synchronous rejection during silent initialization remains a retryable accepted-boolean failure', () => {
  const x = setup([en], { primeScenes: true });
  x.synth.speak = () => { const error = new Error('Activation needed'); error.name = 'NotAllowedError'; throw error; };
  assert.equal(x.speech.speakScene(moon, scene, 'en'), false);
  assert.equal(x.states.at(-1).kind, 'preparing-scene'); assert.equal(x.states.at(-1).error, 'not-allowed');
  assert.equal(x.speech.primedVoices.size, 0); assert.equal(x.timers.size, 0);
});

test('initialization times out within its budget and late completion cannot start audible speech', () => {
  const x = setup([en], { primeScenes: true, primeTimeoutMs: 3000 });
  x.speech.speakScene(moon, scene, 'en'); const primer = x.calls[0]; primer.onstart();
  assert.deepEqual([...x.timerDelays.values()], [3000]); [...x.timers.values()][0]();
  assert.equal(x.states.at(-1).error, 'preparation-timeout'); assert.equal(x.cancelled(), 1);
  assert.equal(x.speech.current, null); assert.equal(x.speech.primedVoices.size, 0); assert.equal(x.timers.size, 0);
  primer.onend(); assert.equal(x.calls.length, 1);
  x.speech.speakScene(moon, scene, 'en'); assert.equal(x.calls[1].volume, 0);
});

test('stop and mute invalidate initialization so its late events cannot queue a hidden round', () => {
  for (const stop of [speech => speech.stop(), speech => speech.setEnabled(false)]) {
    const x = setup([en], { primeScenes: true });
    x.speech.speakScene(moon, scene, 'en'); const primer = x.calls[0]; primer.onstart(); stop(x.speech);
    const count = x.states.length;
    primer.onend(); primer.onerror({ error: 'interrupted' }); primer.onstart();
    assert.equal(x.states.length, count); assert.equal(x.calls.length, 1); assert.equal(x.timers.size, 0);
    assert.equal(x.speech.primedVoices.size, 0); assert.equal(x.cancelled(), 1);
  }
});

test('replay while initialization is pending replaces its utterance and ignores the old completion', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speakScene(moon, scene, 'en'); const old = x.calls[0]; old.onstart();
  x.speech.speakScene(moon, scene, 'en'); const replacement = x.calls[1];
  old.onend(); old.onerror({ error: 'interrupted' });
  assert.equal(x.calls.length, 2); assert.equal(x.speech.current.utterance, replacement);
  replacement.onstart(); replacement.onend(); assert.equal(x.calls.length, 3); assert.equal(x.calls[2].volume, 1);
});

test('a primer end without a native start does not claim initialized speech or begin audio', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speakScene(moon, scene, 'en'); x.calls[0].onend();
  assert.equal(x.calls.length, 1); assert.equal(x.speech.primedVoices.size, 0);
  assert.equal(x.states.at(-1).error, 'preparation-incomplete'); assert.equal(x.timers.size, 0);
});

test('scene initialization does not affect headword requests or bypass automatic mute', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speak(moon, 'en'); assert.equal(x.calls.length, 1); assert.equal(x.calls[0].volume, 1);
  x.speech.setEnabled(false);
  assert.equal(x.speech.speakScene(moon, scene, 'en'), false); assert.equal(x.calls.length, 1);
  assert.equal(x.states.at(-1).state, 'muted');
  assert.equal(x.speech.speak(moon, 'en', false, true), true); assert.equal(x.calls[1].volume, 1);
});

test('audible slow replay preserves reviewed content and requested rate after fast silent initialization', () => {
  const x = setup([en], { primeScenes: true });
  x.speech.speakScene(moon, scene, 'en', true); const primer = x.calls[0]; primer.onstart(); primer.onend();
  assert.equal(primer.rate, 10); assert.equal(x.calls[1].rate, .65); assert.equal(x.calls[1].pitch, 1);
  assert.equal(x.calls[1].text, scene.entry.scene.en); assert.equal(x.calls[1].volume, 1);
});

test('stopping from the prepared event prevents the subsequent audible continuation', () => {
  const x = setup([en], { primeScenes: true });
  const original = x.speech.onState;
  x.speech.onState = state => { original(state); if (state.state === 'prepared') x.speech.stop(); };
  x.speech.speakScene(moon, scene, 'en'); x.calls[0].onstart(); x.calls[0].onend();
  assert.equal(x.calls.length, 1); assert.equal(x.speech.current, null); assert.equal(x.timers.size, 0);
});
