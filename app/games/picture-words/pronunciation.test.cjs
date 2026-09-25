const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Pronunciation, chooseVoice } = require('./pronunciation.js');

const moon = { id: 'moon', w: 'つき', ja: '月', en: 'moon' };
const ja = { name: 'Japanese', lang: 'ja-JP', localService: true };
const en = { name: 'English', lang: 'en-US', localService: true };
function setup(voices = [ja, en]) {
  const states = [], timers = new Map(), calls = [];
  let nextTimer = 0, cancelled = 0, changed;
  const synth = {
    voices, getVoices() { return this.voices; },
    addEventListener(event, fn) { changed = fn; },
    cancel() { cancelled++; }, speak(utterance) { calls.push(utterance); },
  };
  class Utterance { constructor(text) { this.text = text; } }
  const speech = new Pronunciation({ synth, Utterance, onState: state => states.push(state),
    setTimer: fn => { const id = ++nextTimer; timers.set(id, fn); return id; }, clearTimer: id => timers.delete(id) });
  return { speech, synth, states, calls, timers, changed: () => changed(), cancelled: () => cancelled };
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

test('muting cancels pending speech and prevents further speech until re-enabled', () => {
  const x = setup(); x.speech.speak(moon, 'ja'); x.speech.setEnabled(false);
  assert.equal(x.cancelled(), 1); assert.equal(x.timers.size, 0);
  assert.equal(x.speech.speak(moon, 'en'), false); assert.equal(x.calls.length, 1); assert.equal(x.states.at(-1).state, 'muted');
  x.speech.setEnabled(true); assert.equal(x.speech.speak(moon, 'en'), true); assert.equal(x.calls.length, 2);
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
