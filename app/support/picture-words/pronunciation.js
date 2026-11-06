/* Reviewed scene narration and explicit dictionary pronunciation. Browser/OS voices only. */
((root) => {
  'use strict';
  const normalize = tag => String(tag || '').replaceAll('_', '-').toLowerCase();
  function chooseVoice(voices, language) {
    const target = language === 'ja' ? 'ja-jp' : 'en-us';
    return voices.filter(voice => normalize(voice.lang).split('-')[0] === language)
      .sort((a, b) => {
        const score = voice => (normalize(voice.lang) === target ? 4 : 0) + (voice.localService ? 8 : 0) + (voice.default ? 1 : 0);
        return score(b) - score(a);
      })[0] || null;
  }
  class OutputPreparation {
    constructor({ Context = root.AudioContext || root.webkitAudioContext,
      setTimer = (fn, ms) => setTimeout(fn, ms), clearTimer = id => clearTimeout(id),
      timeoutMs = 3000 } = {}) {
      this.Context = Context; this.setTimer = setTimer; this.clearTimer = clearTimer;
      this.timeoutMs = timeoutMs; this.context = null; this.source = null;
      this.pending = null; this.serial = 0; this.timer = null; this.reject = null;
    }
    ensure() {
      if (!this.Context) return Promise.resolve({ supported: false });
      if (this.pending) return this.pending;
      try {
        if (!this.context || this.context.state === 'closed') {
          this.context = new this.Context({ latencyHint: 'playback' });
          const buffer = this.context.createBuffer(1, 256, this.context.sampleRate);
          this.source = this.context.createBufferSource();
          this.source.buffer = buffer; this.source.loop = true;
          this.source.connect(this.context.destination); this.source.start();
        }
      } catch (error) { return Promise.reject(error); }
      const context = this.context, serial = ++this.serial;
      let baseline;
      try { baseline = context.getOutputTimestamp?.(); } catch {}
      const baselineTime = baseline ? baseline.contextTime : context.currentTime;
      // Call resume now, including on the explicit replay's input stack.
      let resumed;
      try { resumed = context.resume(); } catch (error) { return Promise.reject(error); }
      this.pending = new Promise((resolve, reject) => {
        this.reject = reject;
        let elapsed = 0, done = false;
        const finish = (error, result) => {
          if (serial !== this.serial || done) return;
          done = true;
          this.clearTimer(this.timer); this.timer = null;
          this.pending = null; this.reject = null;
          if (error) reject(error); else resolve(result);
        };
        const sample = () => {
          if (serial !== this.serial || done) return;
          let timestamp;
          try { timestamp = context.getOutputTimestamp?.(); } catch {}
          if (context.state === 'running' && (timestamp ? timestamp.contextTime > baselineTime : context.currentTime > baselineTime)) {
            finish(null, { supported: true, state: context.state,
              outputTimestamp: timestamp || null, baseLatency: context.baseLatency,
              outputLatency: context.outputLatency });
            return;
          }
          elapsed += 20;
          if (elapsed >= this.timeoutMs) {
            const error = new Error('Audio output is not ready');
            error.name = context.state === 'suspended' ? 'NotAllowedError' : 'TimeoutError';
            finish(error); return;
          }
          this.timer = this.setTimer(sample, 20);
        };
        // A suspended resume promise may remain pending until a user gesture.
        // Poll its bounded state as well, instead of hanging the question.
        Promise.resolve(resumed).catch(error => finish(error));
        Promise.resolve().then(sample);
      });
      return this.pending;
    }
    cancel() {
      this.serial++; this.clearTimer(this.timer); this.timer = null;
      const reject = this.reject; this.reject = null; this.pending = null;
      if (reject) { const error = new Error('Audio preparation was canceled'); error.name = 'AbortError'; reject(error); }
    }
    suspend() {
      this.cancel();
      try { return Promise.resolve(this.context?.suspend()).catch(() => {}); } catch { return Promise.resolve(); }
    }
    close() {
      this.suspend();
      try { this.source?.stop(); this.source?.disconnect(); } catch {}
      const context = this.context; this.context = null; this.source = null;
      try { return Promise.resolve(context?.close()).catch(() => {}); } catch { return Promise.resolve(); }
    }
  }
  class Pronunciation {
    constructor({ synth = root.speechSynthesis, Utterance = root.SpeechSynthesisUtterance, onState = () => {}, onVoices = () => {}, setTimer = (fn, delay) => setTimeout(fn, delay), clearTimer = id => clearTimeout(id), voiceWaitMs = 750, primeScenes = false, primeTimeoutMs = 5000, outputScenes = false, outputPreparation = null } = {}) {
      this.synth = synth; this.Utterance = Utterance; this.onState = onState; this.onVoices = onVoices;
      this.setTimer = setTimer; this.clearTimer = clearTimer; this.timer = null; this.current = null; this.serial = 0;
      this.enabled = true; this.voices = []; this.prepared = new Map(); this.preparation = 0;
      this.voiceWaitMs = voiceWaitMs; this.voiceWaiters = new Set();
      this.output = outputScenes ? outputPreparation || new OutputPreparation({ setTimer, clearTimer }) : null;
      this.primeScenes = primeScenes; this.primeTimeoutMs = primeTimeoutMs; this.primedVoices = new Set();
      this.refreshVoices = () => {
        try { this.voices = Array.from(this.synth?.getVoices?.() || []); } catch { this.voices = []; }
        for (const notify of [...this.voiceWaiters]) notify();
        this.onVoices();
      };
      this.synth?.addEventListener?.('voiceschanged', this.refreshVoices);
      this.refreshVoices();
    }
    availability(language) {
      if (!this.synth?.speak || !this.Utterance) return 'unsupported';
      if (this.voices.length && !chooseVoice(this.voices, language)) return 'missing-voice';
      return 'ready'; // Empty lists may mean asynchronous voice initialization.
    }
    setEnabled(value) { this.enabled = !!value; if (!this.enabled) this.suspendOutput(); }
    prepareOutputRoute() { return this.output ? this.output.ensure() : Promise.resolve({ supported: false }); }
    suspendOutput() { this.stop(); if (this.output) this.primedVoices.clear(); return this.output?.suspend(); }
    closeOutput() { this.stop(); if (this.output) this.primedVoices.clear(); return this.output?.close(); }
    stop() {
      this.serial++; this.preparation++; this.clearTimer(this.timer); this.timer = null;
      this.output?.cancel();
      const previous = this.current; this.current = null;
      if (previous) {
        try { this.synth.cancel(); } catch { /* Keep puzzle controls usable. */ }
        this.onState({ ...previous.info, state: 'idle' });
      }
    }
    prepare(word) {
      this.preparation++; this.prepared.clear();
      if (!this.Utterance) return;
      for (const language of ['ja','en']) {
        const text = language === 'ja' ? word.w : word.en;
        if (typeof text !== 'string' || !text.trim()) continue;
        try { this.prepared.set(`${language}:${text}`, new this.Utterance(text)); } catch {}
      }
    }
    async prepareScene(word, result, language) {
      const text = result?.status === 'reviewed' && result.ttsAllowed === true ? result.entry?.scene?.[language] : '';
      const preparation = ++this.preparation;
      this.prepared.clear();
      if (!this.synth?.speak || !this.Utterance || typeof text !== 'string' || !text.trim()) return false;
      // Discover the explicit language voice while the four pictures are loading.
      // This does not speak, unlock autoplay, or insert any extra spoken content.
      if (!this.voices.length) {
        this.refreshVoices();
        if (!this.voices.length) await new Promise(resolve => {
          let timer;
          const finish = () => { this.voiceWaiters.delete(notify); this.clearTimer(timer); resolve(); };
          const notify = () => { if (this.voices.length) finish(); };
          this.voiceWaiters.add(notify);
          timer = this.setTimer(finish, this.voiceWaitMs);
        });
      }
      if (preparation !== this.preparation || this.availability(language) !== 'ready') return false;
      try {
        const utterance = new this.Utterance(text);
        utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
        const voice = chooseVoice(this.voices, language); if (voice) utterance.voice = voice;
        this.prepared.set(`${language}:${text}`, utterance);
        return true;
      } catch { return false; }
    }
    speak(word, language, slow = false, requested = false) {
      return this.speakText({ wordId: word.id, text: language === 'ja' ? word.w : word.en, language, slow }, requested);
    }
    speakScene(word, result, language, slow = false) {
      const text = result?.status === 'reviewed' && result.ttsAllowed === true ? result.entry?.scene?.[language] : '';
      if (typeof text !== 'string' || !text.trim()) {
        this.stop(); this.onState({ wordId: word?.id, text: '', language, slow, kind: 'scene', state: 'unavailable' });
        return false; // No fallback to a headword or an unreviewed draft.
      }
      return this.speakText({ wordId: word.id, text, language, slow, kind: 'scene' }, false);
    }
    primeScene(info, voice, voiceKey, requested) {
      const serial = this.serial, primeInfo = { ...info, kind: 'preparing-scene' };
      let utterance;
      try { utterance = new this.Utterance(info.text); }
      catch { this.onState({ ...primeInfo, state: 'error', error: 'synthesis-failed' }); return false; }
      utterance.lang = info.language === 'ja' ? 'ja-JP' : 'en-US';
      if (voice) utterance.voice = voice;
      // Drive the same TTS engine with this reviewed caption, not a WebAudio
      // stream or a spoken prefix. Only its completed end event warms the voice.
      utterance.volume = 0; utterance.rate = 10; utterance.pitch = 1;
      let started = false;
      const current = () => serial === this.serial && this.current?.utterance === utterance;
      const finish = (state, error = '', cancel = false) => {
        if (!current()) return false;
        this.clearTimer(this.timer); this.timer = null; this.current = null;
        if (cancel) { this.serial++; try { this.synth.cancel(); } catch {} }
        this.onState({ ...primeInfo, state, error });
        return true;
      };
      utterance.onstart = () => {
        if (!current()) return;
        started = true; this.onState({ ...primeInfo, state: 'preparing' });
      };
      utterance.onend = () => {
        if (!current()) return;
        if (!started) { finish('error', 'preparation-incomplete'); return; }
        this.primedVoices.add(voiceKey);
        if (finish('prepared') && serial === this.serial) this.speakText(info, requested, true);
      };
      utterance.onerror = event => finish('error', event.error);
      this.current = { utterance, info: primeInfo };
      this.onState({ ...primeInfo, state: 'queued' });
      this.timer = this.setTimer(() => finish('error', 'preparation-timeout', true), this.primeTimeoutMs);
      try {
        if (this.synth.paused) this.synth.resume();
        this.synth.speak(utterance);
      } catch (error) { finish('error', error?.name === 'NotAllowedError' ? 'not-allowed' : 'synthesis-failed'); return false; }
      return true;
    }
    prepareOutput(info, requested) {
      const serial = this.serial, token = {}, primeInfo = { ...info, kind: 'preparing-scene' };
      this.current = { utterance: token, info: primeInfo };
      const current = () => serial === this.serial && this.current?.utterance === token;
      this.onState({ ...primeInfo, state: 'queued' });
      if (!current()) return false;
      let pending;
      try { pending = this.output.ensure(); }
      catch (error) { pending = Promise.reject(error); }
      Promise.resolve(pending).then(() => {
        if (!current()) return;
        this.current = null;
        this.onState({ ...primeInfo, state: 'prepared' });
        if (serial === this.serial) this.speakText(info, requested, true);
      }, error => {
        if (!current()) return;
        this.current = null;
        this.onState({ ...primeInfo, state: 'error', error: error?.name === 'NotAllowedError' ? 'not-allowed' : 'output-unavailable' });
      });
      return true;
    }
    speakText(info, requested = false, outputPrepared = false) {
      const {language, slow} = info;
      this.stop();
      if (typeof info.text !== 'string' || !info.text.trim()) { this.onState({ ...info, state: 'unavailable' }); return false; }
      if (!this.voices.length) this.refreshVoices();
      if (!this.enabled && !requested) { this.onState({ ...info, state: 'muted' }); return false; }
      if (this.availability(language) !== 'ready') { this.onState({ ...info, state: 'unavailable' }); return false; }
      if (this.output && info.kind === 'scene' && !outputPrepared) return this.prepareOutput(info, requested);
      const voice = chooseVoice(this.voices, language);
      const voiceKey = `${language}:${voice ? `${voice.voiceURI || voice.name || voice.lang}:${normalize(voice.lang)}:${!!voice.localService}` : 'default'}`;
      if (this.primeScenes && info.kind === 'scene' && !this.primedVoices.has(voiceKey)) {
        return this.primeScene(info, voice, voiceKey, requested);
      }
      const serial = this.serial;
      let utterance;
      const key = `${language}:${info.text}`;
      try { utterance = this.prepared.get(key) || new this.Utterance(info.text); }
      catch { this.onState({ ...info, state: 'unavailable' }); return false; }
      // A submitted utterance is single-use. Replacing callbacks on a reused
      // object could route a late canceled event into its next playback.
      this.prepared.delete(key);
      utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
      if (voice) utterance.voice = voice;
      utterance.rate = slow ? .65 : 1; utterance.pitch = 1; utterance.volume = 1;
      const finish = (state, error = '') => {
        if (serial !== this.serial || this.current?.utterance !== utterance) return;
        this.clearTimer(this.timer); this.timer = null; this.current = null;
        this.onState({ ...info, state, error });
      };
      const watch = milliseconds => {
        this.clearTimer(this.timer);
        this.timer = this.setTimer(() => {
          if (serial !== this.serial || this.current?.utterance !== utterance) return;
          finish('error', 'timeout'); this.serial++;
          try { this.synth.cancel(); } catch {}
        }, milliseconds);
      };
      utterance.onstart = () => {
        if (serial !== this.serial || this.current?.utterance !== utterance) return;
        this.onState({ ...info, state: 'speaking' });
        watch(info.kind === 'scene' ? Math.min(60000, Math.max(15000, info.text.length * (slow ? 230 : 160))) : 15000);
      };
      utterance.onend = () => finish('finished');
      utterance.onerror = event => finish('error', event.error);
      this.current = { utterance, info }; // Retain the utterance through its end event.
      this.onState({ ...info, state: 'queued' }); watch(8000);
      try {
        if (this.synth.paused) this.synth.resume();
        // Explicit replay stays in the gesture; automatic starts may be denied
        // by browser policy and report an error for an explicit retry.
        this.synth.speak(utterance);
      } catch (error) { finish('error', error?.name === 'NotAllowedError' ? 'not-allowed' : 'synthesis-failed'); return false; }
      return true;
    }
  }
  const api = { Pronunciation, chooseVoice, OutputPreparation };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WordBloomSpeech = api;
})(typeof window === 'undefined' ? globalThis : window);
