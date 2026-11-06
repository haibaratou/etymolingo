(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else {
    const api = factory(root);
    root.VocabularyEtymopediaSync = api;
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', api.mount, { once: true });
    else api.mount();
  }
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';
  const SERVICE_ORIGIN = 'http://127.0.0.1:8791';
  const API = '/api/etymopedia-sync/';
  const START_COMMAND = 'python "D:\\Projects\\etymon-source\\tools\\local_etymopedia_sync.py" --source "D:\\Projects\\etymon-source" --target "D:\\Projects\\etymolingo" --port 8791';
  const LABEL = 'etymopediaのテキストを更新';
  const localHost = hostname => ['127.0.0.1', 'localhost', '[::1]', '::1'].includes(hostname);
  const isLocal = location => location.protocol === 'file:' || (['http:', 'https:'].includes(location.protocol) && localHost(location.hostname));
  const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
  const validChanges = changes => changes && ['word_records', 'root_records', 'origin_records', 'changed_files'].every(key => Number.isSafeInteger(changes[key]) && changes[key] >= 0);
  const text = value => typeof value === 'string' ? value : '';
  const PUBLIC_FILES = new Set(['app/etymopedia.html', ...['current-data.js', 'origin-sticker-display.json', 'learning-levels.js', 'build-data.cjs', 'origin-sticker-display.cjs', 'root-map-examples.json', 'root-map-notes.json', 'root-map-layout.js'].map(name => 'app/support/etymopedia/' + name)]);
  const PUBLIC_FIELDS = new Set(['w', 'p', 'ja', 'en', 'pos', 'g', 'gs', 'r', 'b', 'phonetic', 'origin_languages', 'origin_sticker_languages', 'key', 'd', 'definition_reviewed']);
  function publicFile(value) {
    const normalized = text(value).replace(/\\/g, '/');
    for (const filename of PUBLIC_FILES) if (normalized === filename || normalized.endsWith('/' + filename)) return filename;
    return '';
  }
  function safeWord(value) {
    return typeof value === 'string' && value.length <= 80 && /^[A-Za-z\u00c0-\u024f0-9 .'’()/-]+$/.test(value) ? value : '';
  }
  function safeDetails(details) {
    if (!details || typeof details !== 'object' || Array.isArray(details)) return '';
    const lines = [];
    const words = (Array.isArray(details.words) ? details.words : [details.word]).map(safeWord).filter(Boolean).slice(0, 20);
    if (words.length) lines.push('対象語: ' + words.join('、'));
    const fields = (Array.isArray(details.fields) ? details.fields : [details.field]).filter(value => PUBLIC_FIELDS.has(value));
    if (fields.length) lines.push('対象項目: ' + fields.join('、'));
    const file = publicFile(details.file);
    if (file) lines.push('対象ファイル: ' + file);
    for (const [key, label] of [['stale_records', '語義との不一致'], ['ambiguous_records', '語義の対応が未確定']]) {
      if (Number.isSafeInteger(details[key]) && details[key] >= 0) lines.push(label + ': ' + details[key] + '件');
    }
    for (const [key, label] of [['restored_files', '復旧済み'], ['unrestored_files', '復旧未確認']]) {
      if (Array.isArray(details[key]) && details[key].length) {
        const files = details[key].map(publicFile).filter(Boolean);
        lines.push(label + ': ' + details[key].length + 'ファイル' + (files.length ? '\n' + files.join('\n') : '（対象名はローカル更新サービスで確認してください）'));
      }
    }
    // Raw reason/traceback/evidence fields may contain private dictionary prose.
    return lines.join('\n');
  }
  let controller;

  function mount() {
    if (controller || !root.document || !isLocal(root.location)) return controller;
    const doc = root.document;
    const header = doc.querySelector('body > header');
    const navigation = header && header.querySelector('nav');
    if (!navigation) return undefined;
    const dialog = doc.createElement('dialog');
    dialog.id = 'etymopediaSyncDialog';
    dialog.setAttribute('aria-labelledby', 'etymopediaSyncTitle');
    dialog.innerHTML = `<div class="etymoSyncHeading"><h2 id="etymopediaSyncTitle">${LABEL}</h2><button type="button" data-sync="close" aria-label="更新画面を閉じる">✕</button></div>
      <div class="etymoSyncBody">
        <p class="etymoSyncLead">PCに保存された最新の正本から、etymopediaが読むテキストファイルを更新します。 この画面の未保存の編集内容は含まれません。</p>
        <p class="etymoSyncStatus" data-sync="status" role="status" aria-live="polite"></p>
        <section data-sync="handoff" hidden>
          <p>ローカル更新サービスを起動し、下の更新画面を新しいタブで開いてください。このタブの編集内容はそのまま残ります。</p>
          <label class="etymoSyncLabel" for="etymopediaSyncCommand">PowerShellで実行する起動コマンド</label>
          <textarea id="etymopediaSyncCommand" data-sync="command" rows="3" readonly spellcheck="false"></textarea>
          <div class="etymoSyncActions"><button type="button" data-sync="copy">コマンドをコピー</button><button type="button" data-sync="health">接続を確認</button></div>
          <p class="etymoSyncHint" data-sync="healthResult" aria-live="polite"></p>
          <a class="etymoSyncPrimary" data-sync="openLocal" target="_blank" rel="noopener">ローカル更新画面を開く ↗</a>
          <p class="etymoSyncHint">起動したPowerShellは更新が終わるまで開いておきます。更新画面で差分を確認してから保存します。</p>
        </section>
        <section data-sync="connected" hidden>
          <dl class="etymoSyncPaths"><dt>正本</dt><dd data-sync="source"></dd><dt>表示先</dt><dd data-sync="target"></dd></dl>
          <div data-sync="preview" hidden>
            <h3>保存する差分</h3>
            <dl class="etymoSyncCounts"><div><dt>語源メモなど</dt><dd data-sync="wordCount">0</dd></div><div><dt>語根本文</dt><dd data-sync="rootCount">0</dd></div><div><dt>起源言語</dt><dd data-sync="originCount">0</dd></div><div><dt>更新ファイル</dt><dd data-sync="fileCount">0</dd></div></dl>
            <p class="etymoSyncHint">項目ごとの件数には重複する語を含みます。</p>
            <ul class="etymoSyncFiles" data-sync="files"></ul>
            <ul class="etymoSyncWarnings" data-sync="warnings" hidden></ul>
          </div>
          <div class="etymoSyncActions"><button type="button" data-sync="refresh">差分を再確認</button><button type="button" class="etymoSyncPrimary" data-sync="apply" disabled>保存して更新</button></div>
          <p data-sync="result" class="etymoSyncResult" aria-live="polite" hidden></p>
          <a data-sync="openEtymopedia" class="etymoSyncOpen" target="_blank" rel="noopener" hidden>更新後のetymopediaを開く ↗</a>
        </section>
      </div>`;
    doc.body.appendChild(dialog);
    const ui = Object.fromEntries(Array.from(dialog.querySelectorAll('[data-sync]')).map(el => [el.dataset.sync, el]));
    const state = { token: '', plan: null, busy: false, saving: false, mode: '', lastButton: null };
    ui.command.value = START_COMMAND;
    ui.openLocal.href = SERVICE_ORIGIN + '/app/vocabulary-master.html?etymopediaSync=1';

    function status(message, kind) {
      ui.status.textContent = message;
      ui.status.dataset.kind = kind || '';
    }
    function setBusy(busy, saving) {
      state.busy = busy;
      state.saving = !!saving;
      ui.refresh.disabled = busy;
      ui.apply.disabled = busy || !state.plan || count(state.plan.changes && state.plan.changes.changed_files) === 0;
      ui.close.disabled = state.saving;
      dialog.setAttribute('aria-busy', String(busy));
    }
    function invalidatePlan() {
      state.plan = null;
      ui.apply.disabled = true;
      ui.preview.hidden = true;
    }
    function explain(error) {
      return (error && error.message ? error.message : '応答を確認できませんでした。') + (error && error.detailsSummary ? '\n' + error.detailsSummary : '');
    }
    async function request(path, options) {
      const abort = new root.AbortController();
      // A preview can run two formal builder commands, each with a 120s limit.
      const timer = root.setTimeout(() => abort.abort(), ['preview', 'update'].includes(path) ? 600000 : 30000);
      try {
        let response;
        try {
          response = await root.fetch(API + path, { cache: 'no-store', credentials: 'same-origin', signal: abort.signal, ...options });
        } catch (cause) {
          const error = new Error(abort.signal.aborted || cause && cause.name === 'AbortError' ? 'ローカル更新サービスの応答が時間内に届きませんでした。' : 'ローカル更新サービスに接続できませんでした。');
          error.uncertain = path === 'update';
          throw error;
        }
        let body;
        try { body = await response.json(); }
        catch (_) {
          const error = new Error(abort.signal.aborted ? 'ローカル更新サービスの応答が時間内に届きませんでした。' : '更新サービスからJSON形式の応答が返りませんでした。');
          error.uncertain = path === 'update';
          throw error;
        }
        if (!response.ok || !body || body.ok !== true) {
          const detail = body && body.error;
          const error = new Error((detail && text(detail.message) || '更新サービスが処理を受け付けませんでした。') + (detail && text(detail.code) ? ' [' + detail.code + ']' : ''));
          error.detailsSummary = safeDetails(detail && detail.details);
          error.partial = !!(detail && detail.code === 'save_failed' && (!detail.details || !Array.isArray(detail.details.unrestored_files) || detail.details.unrestored_files.length));
          throw error;
        }
        return body;
      } finally {
        // Keep the deadline active while the response body is being read too.
        root.clearTimeout(timer);
      }
    }
    function post(path, body) {
      return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Etymopedia-Sync-Token': state.token }, body: JSON.stringify(body) });
    }
    function renderChanges(plan) {
      const changes = plan.changes || {};
      ui.wordCount.textContent = String(count(changes.word_records));
      ui.rootCount.textContent = String(count(changes.root_records));
      ui.originCount.textContent = String(count(changes.origin_records));
      ui.fileCount.textContent = String(count(changes.changed_files));
      ui.files.replaceChildren();
      for (const filename of Array.isArray(plan.target_files) ? plan.target_files : []) {
        const li = doc.createElement('li');
        li.textContent = text(filename);
        ui.files.appendChild(li);
      }
      ui.warnings.replaceChildren();
      for (const warning of Array.isArray(plan.warnings) ? plan.warnings : []) {
        const li = doc.createElement('li');
        li.textContent = text(warning) || (warning && text(warning.message));
        if (li.textContent) ui.warnings.appendChild(li);
      }
      ui.warnings.hidden = ui.warnings.childElementCount === 0;
      ui.preview.hidden = false;
    }
    function showSaved(result) {
      state.plan = null;
      renderChanges(result);
      ui.apply.disabled = true;
      ui.result.hidden = false;
      if (result.updated === true) {
        status('PC上の表示ファイルを更新しました。', 'success');
        ui.result.textContent = '保存完了：' + count(result.changes && result.changes.changed_files) + 'ファイル。次回の表示にも反映されます。' + (text(result.message) ? ' ' + result.message : '');
      } else {
        status('正本と表示ファイルは一致しています。', 'success');
        ui.result.textContent = '変更はありません。' + (text(result.message) ? ' ' + result.message : '');
      }
      ui.openEtymopedia.href = root.location.origin + '/app/etymopedia.html?sync=' + Date.now();
      ui.openEtymopedia.hidden = false;
    }
    async function health() {
      ui.health.disabled = true;
      ui.healthResult.textContent = '接続を確認中…';
      const abort = new root.AbortController();
      const timer = root.setTimeout(() => abort.abort(), 5000);
      try {
        const response = await root.fetch(SERVICE_ORIGIN + '/health', { mode: 'cors', cache: 'no-store', credentials: 'omit', signal: abort.signal });
        const body = await response.json();
        if (!response.ok || body.service !== 'etymopedia-local-sync' || body.protocol !== 1 || body.ready !== true) throw new Error();
        ui.healthResult.textContent = '更新サービスに接続できました。更新画面を開いてください。';
      } catch (_) {
        ui.healthResult.textContent = '接続を確認できません。起動コマンドを実行してください。ブラウザで接続確認が制限される場合も、下のリンクから更新画面を開けます。';
      } finally {
        root.clearTimeout(timer);
        ui.health.disabled = false;
      }
    }
    function handoff(reason) {
      state.mode = 'handoff';
      state.token = '';
      invalidatePlan();
      ui.handoff.hidden = false;
      ui.connected.hidden = true;
      status(reason, 'info');
      health();
    }
    async function preview() {
      if (state.busy || state.mode !== 'connected' || !state.token) return;
      invalidatePlan();
      ui.result.hidden = true;
      ui.openEtymopedia.hidden = true;
      setBusy(true, false);
      status('PCの最新正本と表示ファイルを照合しています…');
      try {
        const plan = await post('preview', {});
        if (!text(plan.plan_id) || !validChanges(plan.changes)) throw new Error('差分の応答が不完全なため保存できません。');
        state.plan = plan;
        renderChanges(plan);
        if (text(plan.source_repo)) ui.source.textContent = plan.source_repo;
        if (text(plan.target_repo)) ui.target.textContent = plan.target_repo;
        status(plan.changes.changed_files ? '差分を確認し、「保存して更新」を押してください。' : '正本と表示ファイルは一致しています。変更はありません。', plan.changes.changed_files ? '' : 'success');
      } catch (error) {
        invalidatePlan();
        status(explain(error) + ' 問題を解消して「差分を再確認」を押してください。', 'error');
      } finally { setBusy(false, false); }
    }
    async function connect() {
      if (state.busy) return;
      if (root.location.protocol === 'file:') {
        handoff('file://で開いた画面からは直接保存できません。');
        return;
      }
      invalidatePlan();
      ui.result.hidden = true;
      ui.openEtymopedia.hidden = true;
      setBusy(true, false);
      status('ローカル更新サービスを確認しています…');
      try {
        const result = await request('status');
        if (!text(result.csrf_token) || !text(result.source_repo) || !text(result.target_repo) || typeof result.can_update !== 'boolean') throw new Error('更新サービスの状態を確認できませんでした。');
        state.token = result.csrf_token;
        state.mode = 'connected';
        ui.handoff.hidden = true;
        ui.connected.hidden = false;
        ui.source.textContent = result.source_repo;
        ui.target.textContent = result.target_repo;
        if (text(result.startup_command)) ui.command.value = result.startup_command;
        if (!result.can_update) {
          status(text(result.message) || '現在の正本または表示先は更新できません。更新サービスの状態を確認してください。', 'error');
          return;
        }
      } catch (error) {
        handoff(explain(error) + ' 専用のローカル更新画面を開いてください。');
        return;
      } finally { setBusy(false, false); }
      await preview();
    }
    async function apply() {
      if (state.busy || state.mode !== 'connected' || !state.plan || !state.token || count(state.plan.changes.changed_files) === 0) return;
      const planId = state.plan.plan_id;
      setBusy(true, true);
      ui.result.hidden = true;
      ui.openEtymopedia.hidden = true;
      status('正本と保存先の変更を再確認して、表示ファイルを保存しています…');
      try {
        const result = await post('update', { plan_id: planId });
        if (typeof result.updated !== 'boolean' || !validChanges(result.changes) || (result.updated && result.changes.changed_files === 0)) {
          const error = new Error('保存結果の応答が不完全です。');
          error.uncertain = true;
          throw error;
        }
        showSaved(result);
      } catch (error) {
        invalidatePlan();
        if (error.partial) {
          status(explain(error) + '\n一部のファイルが保存前の状態に戻っていない可能性があります。保存結果は未確認です。自動で再保存はしていません。表示ファイルの確認と復旧が必要です。', 'error');
        } else if (error.uncertain) {
          let confirmed = false;
          try {
            const check = await request('status');
            if (check.last_result && check.last_result.plan_id === planId && check.last_result.ok === true && typeof check.last_result.updated === 'boolean' && validChanges(check.last_result.changes) && (!check.last_result.updated || check.last_result.changes.changed_files > 0)) {
              showSaved(check.last_result);
              confirmed = true;
            }
          } catch (_) { /* Never repeat a write after a lost response. */ }
          if (!confirmed) status(explain(error) + ' 保存結果は未確認です。自動で再保存はしていません。「差分を再確認」で現在のファイルを確認してください。', 'error');
        } else status(explain(error) + ' 保存は完了していません。差分を再確認してください。', 'error');
      } finally { setBusy(false, false); }
    }
    function open() {
      if (dialog.open) return;
      state.lastButton = doc.activeElement;
      dialog.showModal();
      connect();
    }
    function installButton() {
      if (doc.getElementById('etymopediaSyncButton')) return;
      let controls = doc.getElementById('etymopediaSyncControls');
      if (!controls) {
        controls = doc.createElement('div');
        controls.id = 'etymopediaSyncControls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', '画面切替と共通操作');
        navigation.parentNode.insertBefore(controls, navigation);
        controls.appendChild(navigation);
      }
      const button = doc.createElement('button');
      button.id = 'etymopediaSyncButton';
      button.type = 'button';
      button.textContent = 'etymopedia更新';
      button.setAttribute('aria-label', LABEL);
      button.title = LABEL;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', dialog.id);
      button.addEventListener('click', open);
      controls.appendChild(button);
    }
    ui.close.addEventListener('click', () => { if (!state.saving) dialog.close(); });
    dialog.addEventListener('cancel', event => { if (state.saving) event.preventDefault(); });
    dialog.addEventListener('close', () => { if (state.lastButton && state.lastButton.isConnected) state.lastButton.focus(); });
    ui.refresh.addEventListener('click', connect);
    ui.apply.addEventListener('click', apply);
    ui.health.addEventListener('click', health);
    ui.copy.addEventListener('click', async () => {
      try {
        await root.navigator.clipboard.writeText(ui.command.value);
        ui.healthResult.textContent = '起動コマンドをコピーしました。PowerShellに貼り付けて実行してください。';
      } catch (_) {
        ui.command.focus();
        ui.command.select();
        ui.healthResult.textContent = 'コマンドを選択しました。Ctrl+Cでコピーしてください。';
      }
    });
    installButton();
    controller = { open, connect, preview, apply, dialog, state, installButton };
    if (new root.URLSearchParams(root.location.search).get('etymopediaSync') === '1') open();
    return controller;
  }
  return { mount, isLocal };
});
