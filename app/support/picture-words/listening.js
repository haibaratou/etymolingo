/* Reviewed English scene audio, four existing illustrations, one explicit tap. */
((root) => {
  'use strict';
  const requested = () => new URLSearchParams(root.location.search).get('mode') === 'listening';
  async function mount() {
    const doc = root.document, $ = id => doc.getElementById(id);
    doc.documentElement.dataset.playMode = 'listening';
    doc.documentElement.dataset.layout = 'listening';
    doc.querySelector('.page-shell').hidden = true;
    doc.querySelector('.page-shell').inert = true;
    const app = doc.createElement('main');
    app.id = 'listeningApp'; app.className = 'listening-app';
    app.innerHTML = `
      <header class="listening-header">
        <a id="listeningBack" class="listening-back" target="_top" href="pictlingo-game.html"><span aria-hidden="true">←</span> パズル</a>
        <h1><small>Pictlingo</small>リスニング</h1>
        <div class="listening-header-tools"><span id="listeningCount" class="listening-count"></span>
          <button id="listeningLayout" class="listening-layout-toggle" type="button" aria-pressed="false" aria-controls="listeningApp" aria-label="モバイル縦表示に切り替える">モバイル縦表示</button>
        </div>
      </header>
      <section id="listeningStage" class="listening-stage" aria-label="英文に合うイラストを選ぶ" aria-busy="true">
        <div id="listeningChoices" class="listening-choices"></div>
        <button id="listeningSpeaker" class="listening-speaker" type="button" aria-label="英文を聞く" disabled>
          <svg aria-hidden="true"><use href="#i-sound"/></svg><span>英文を聞く</span>
        </button>
      </section>
      <footer class="listening-footer">
        <p id="listeningStatus" class="listening-status" role="status" aria-live="polite">確認済みのイラストを読み込み中…</p>
        <section id="listeningAnswer" class="listening-answer" aria-labelledby="listeningVerdict" hidden>
          <div class="listening-answer-heading"><strong id="listeningVerdict"></strong><span><b id="listeningWord" lang="en"></b><span id="listeningMeaning"></span></span></div>
          <p id="listeningSentence" lang="en"></p><p id="listeningTranslation"></p>
          <button id="listeningNext" class="listening-next" type="button">次の問題 <span aria-hidden="true">→</span></button>
        </section>
        <button id="listeningRetry" class="listening-next" type="button" hidden>もう一度読み込む</button>
      </footer>`;
    doc.body.append(app);
    // Existing boot observer also reveals this mode's loading/error UI.
    $('game').dataset.state = 'playing';
    const back = new URL(root.location.href); back.searchParams.delete('mode');
    $('listeningBack').href = back.href;
    $('listeningLayout').addEventListener('click', () => {
      const portrait = app.classList.toggle('is-portrait');
      $('listeningLayout').setAttribute('aria-pressed', String(portrait));
      $('listeningLayout').setAttribute('aria-label', portrait ? '通常表示に戻す' : 'モバイル縦表示に切り替える');
      $('listeningLayout').textContent = portrait ? '通常表示' : 'モバイル縦表示';
    });
    let session, speech, viewSerial = 0, pendingAutoplay = false, imagesReady = false;
    const status = text => { $('listeningStatus').textContent = text; };
    const syncChoices = () => app.querySelectorAll('.listening-choice').forEach(button => {
      button.disabled = !imagesReady || !session || session.state !== 'playing' || !session.heard;
    });
    const voiceMessage = () => '英語の読み上げ音声を利用できません。端末の音声設定を確認してください。';
    function audioState(event) {
      if (event.kind === 'preparing-scene') {
        app.dataset.audioState = ['error', 'unavailable'].includes(event.state) ? 'retry'
          : event.state === 'prepared' ? 'ready' : event.state === 'idle' ? 'idle' : 'preparing';
        $('listeningSpeaker').classList.remove('is-speaking');
        $('listeningSpeaker').setAttribute('aria-label', ['queued', 'preparing'].includes(event.state) ? '音声の準備をやり直す' : '英文をもう一度聞く');
        if (event.state === 'prepared') status('音声の準備ができました。英文を再生します。');
        else if (['error', 'unavailable'].includes(event.state)) status('音声を準備できませんでした。再生ボタンでもう一度試してください。');
        else if (['queued', 'preparing'].includes(event.state)) status('英文音声を準備中…');
        syncChoices();
        return; // Silent engine preparation is never an audible clue.
      }
      app.dataset.audioState = event.state;
      session?.playbackState(event);
      syncChoices();
      const speaking = ['queued', 'speaking'].includes(event.state);
      $('listeningSpeaker').classList.toggle('is-speaking', speaking);
      $('listeningSpeaker').setAttribute('aria-label', speaking ? '英文を最初から聞く' : '英文をもう一度聞く');
      if (['error', 'unavailable'].includes(event.state)) status(speech?.availability('en') === 'ready'
        ? '音声を開始できませんでした。再生ボタンを押すと、もう一度聞けます。' : voiceMessage());
      else if (event.state === 'queued' && session?.state === 'playing') status('英文の音声を準備中…');
      else if (event.state === 'speaking' && session?.state === 'playing') status('英文に合うイラストを、1つタップ。');
      else if (event.state === 'finished' && session?.state === 'playing') status('どのイラスト？ 中央のボタンで何度でも聞けます。');
    }
    function render() {
      const ready = ['playing', 'answered'].includes(session.state);
      app.dataset.state = session.state;
      app.dataset.reveal = 'grid';
      $('listeningStage').setAttribute('aria-busy', String(session.state === 'loading'));
      $('listeningSpeaker').disabled = !imagesReady || !ready || speech.availability('en') !== 'ready';
      $('listeningAnswer').hidden = session.state !== 'answered';
      $('listeningRetry').hidden = session.state !== 'error';
      $('listeningCount').textContent = session.number ? `${session.number}問目` : '';
      if (!ready) {
        $('listeningChoices').replaceChildren();
        status(session.state === 'error' ? '4枚の確認済みイラストを読み込めませんでした。通信と最新版のデータを確認してください。' : '確認済みのイラストを読み込み中…');
        return;
      }
      $('listeningChoices').replaceChildren(...session.round.choices.map((word, index) => {
        const button = doc.createElement('button');
        button.type = 'button'; button.className = 'listening-choice'; button.dataset.choice = String(index);
        button.setAttribute('aria-label', `イラスト${index + 1}`);
        const img = doc.createElement('img'); img.alt = ''; img.draggable = false;
        img.src = session.round.prepared[index].imageURL;
        const number = doc.createElement('span'); number.className = 'listening-choice-number'; number.textContent = String(index + 1);
        button.append(img, number); button.addEventListener('click', () => select(index));
        return button;
      }));
      syncChoices();
      status(speech.availability('en') === 'ready' ? '英文を再生します。聞こえた英文に合うイラストを選ぼう。' : voiceMessage());
    }
    function autoplay() {
      if (!pendingAutoplay || !imagesReady || doc.hidden || session?.state !== 'playing') return;
      pendingAutoplay = false;
      if (!session.replay()) status(speech.availability('en') === 'ready'
        ? '自動再生を開始できませんでした。中央のボタンで英文を聞いてください。' : voiceMessage());
      syncChoices();
    }
    async function next() {
      const serial = ++viewSerial;
      pendingAutoplay = false; imagesReady = false;
      const focusSpeaker = doc.activeElement === $('listeningNext');
      const loading = session.next(); render();
      const ready = await loading;
      if (serial !== viewSerial) return;
      render();
      if (!ready) return;
      $('listeningStage').setAttribute('aria-busy', 'true');
      status('イラストと英文音声を準備中…');
      try {
        await Promise.all(Array.from($('listeningChoices').querySelectorAll('img'), image =>
          typeof image.decode === 'function' ? image.decode() : new Promise((resolve, reject) => {
            if (image.complete) { image.naturalWidth ? resolve() : reject(new Error('image-unavailable')); return; }
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', reject, { once: true });
          })));
      } catch {
        if (serial !== viewSerial) return;
        session.state = 'error'; app.dataset.state = 'error';
        $('listeningStage').setAttribute('aria-busy', 'false'); $('listeningRetry').hidden = false;
        status('イラストを表示できませんでした。もう一度読み込んでください。');
        return;
      }
      if (serial !== viewSerial) return;
      imagesReady = true;
      $('listeningStage').setAttribute('aria-busy', 'false');
      $('listeningSpeaker').disabled = speech.availability('en') !== 'ready';
      pendingAutoplay = ready;
      autoplay();
      if (ready && focusSpeaker && session.state === 'playing') $('listeningSpeaker').focus({ preventScroll: true });
    }
    function select(index) {
      const answer = session.choose(index);
      if (!answer) return;
      const { target, answerIndex, prepared } = session.round;
      app.dataset.state = 'answered'; syncChoices();
      app.dataset.reveal = answer.correct ? 'single' : 'grid';
      app.querySelectorAll('.listening-choice').forEach((button, i) => {
        button.hidden = answer.correct && i !== answerIndex;
        button.classList.toggle('is-featured', answer.correct && i === answerIndex);
        button.classList.toggle('is-correct', i === answerIndex);
        button.classList.toggle('is-wrong', i === index && !answer.correct);
        button.setAttribute('aria-label', answer.correct && i === answerIndex ? `${target.en}、正解のイラスト`
          : `イラスト${i + 1}${i === answerIndex ? '、正解' : i === index ? '、選んだ答え' : ''}`);
        if (answer.correct && i === answerIndex) button.querySelector('img').alt = target.en;
      });
      $('listeningVerdict').textContent = answer.correct ? '正解！' : '正解はこちら';
      $('listeningAnswer').dataset.correct = String(answer.correct);
      $('listeningWord').textContent = target.en;
      $('listeningMeaning').textContent = target.sense?.ja || target.reviewedScene?.sense?.ja || '';
      $('listeningSentence').textContent = prepared[answerIndex].entry.scene.en;
      $('listeningTranslation').textContent = prepared[answerIndex].entry.scene.ja;
      $('listeningAnswer').hidden = false;
      status(answer.correct ? '正解です。答えを確認して次の問題へ。' : `おしい！ 正解はイラスト${answerIndex + 1}です。`);
      $('listeningNext').focus({ preventScroll: true });
    }
    $('listeningSpeaker').addEventListener('click', () => {
      if (!imagesReady) return;
      pendingAutoplay = false;
      if (!session?.replay()) status(voiceMessage());
      syncChoices();
    });
    $('listeningNext').addEventListener('click', next);
    $('listeningRetry').addEventListener('click', () => root.location.reload());
    doc.addEventListener('visibilitychange', () => {
      if (doc.hidden) {
        if (session?.state === 'playing' && !session.heard) pendingAutoplay = true;
        speech?.stop();
      } else autoplay();
    });
    root.addEventListener('pagehide', () => { viewSerial++; session?.stop(); });
    root.addEventListener('pageshow', event => {
      if (!event.persisted || !session) return;
      if (session.state === 'loading' || (session.state === 'playing' && !imagesReady)) next();
      else if (session.state === 'playing' && !session.heard) { pendingAutoplay = true; autoplay(); }
    });
    try {
      const reviewed = root.WordBloomReviewedScenes;
      if (!root.PictlingoListeningCore || !root.WordBloomSpeech || !reviewed || !root.WordBloomLearningGate) throw new Error('missing-runtime');
      speech = new root.WordBloomSpeech.Pronunciation({ primeScenes: root.matchMedia('(min-width:861px)').matches,
        onState: audioState, onVoices: () => {
        if (session && ['playing', 'answered'].includes(session.state)) {
          $('listeningSpeaker').disabled = !imagesReady || speech.availability('en') !== 'ready';
          if (imagesReady && app.dataset.audioState !== 'preparing' && session.state === 'playing' && !session.heard) status(speech.availability('en') === 'ready'
            ? '英文を再生します。聞こえないときは中央のボタンを押してください。' : voiceMessage());
        }
      } });
      const offline = await root.NicolingoOffline.ready();
      const learning = await root.WordBloomLearningGate.load(root.PICTURE_WORDS_CATALOG || [], root.PICTURE_WORDS_CATALOG_META,
        root.PICTURE_WORDS_SELECTION, root.EtymonLearningLevels, reviewed);
      root.PICTURE_WORDS_SELECTION_REPORT = learning.report;
      const runtime = new reviewed.Runtime({ meta: learning.meta, offline });
      if (!(await runtime.checkDataset()).ok) throw new Error('dataset-unavailable');
      const words = root.PictlingoListeningCore.eligibleCatalog(learning.words, reviewed, offline);
      session = new root.PictlingoListeningCore.Session({ words, speech, prepare: word => runtime.prepare(word) });
      await next();
    } catch {
      app.dataset.state = 'error'; $('listeningStage').setAttribute('aria-busy', 'false');
      $('listeningRetry').hidden = false;
      status('確認済みデータを読み込めません。最新版に再読み込みしてください。');
    }
  }
  root.PictlingoListening = { requested, mount };
})(window);
