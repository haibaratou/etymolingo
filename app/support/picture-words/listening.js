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
        <div id="listeningRoundTools" class="listening-round-tools" hidden>
          <span id="listeningChosenLevel"></span>
          <button id="listeningChooseLevel" class="listening-change-level" type="button">難易度を選び直す</button>
        </div>
      </header>
      <section id="listeningSetup" class="listening-setup" aria-labelledby="listeningSetupTitle">
        <div class="listening-setup-intro"><h2 id="listeningSetupTitle" tabindex="-1">難易度を選択</h2>
          <p>母艦と同じ難易度です。選んだ星の語から4択で出題します。</p></div>
        <div id="listeningLevels" class="listening-level-grid" role="group" aria-label="リスニングの難易度"></div>
        <button id="listeningStart" class="listening-start" type="button" disabled>難易度を選んでください</button>
        <p id="listeningSetupStatus" class="listening-setup-status" role="status" aria-live="polite">出題できる難易度を読み込み中…</p>
      </section>
      <section id="listeningStage" hidden class="listening-stage" aria-label="英文に合うイラストを選ぶ" aria-busy="true">
        <div id="listeningChoices" class="listening-choices"></div>
        <button id="listeningSpeaker" class="listening-speaker" type="button" aria-label="英文を聞く" disabled>
          <svg aria-hidden="true"><use href="#i-sound"/></svg><span>英文を聞く</span>
        </button>
      </section>
      <footer id="listeningFooter" class="listening-footer" hidden>
        <p id="listeningStatus" class="listening-status" role="status" aria-live="polite">確認済みのイラストを読み込み中…</p>
        <section id="listeningAnswer" class="listening-answer" aria-labelledby="listeningVerdict" hidden>
          <div class="listening-answer-heading"><strong id="listeningVerdict"></strong><span><b id="listeningWord" lang="en"></b><span id="listeningMeaning"></span></span></div>
          <p id="listeningSentence" lang="en"></p><p id="listeningTranslation"></p>
          <button id="listeningNext" class="listening-next" type="button">次の問題 <span aria-hidden="true">→</span></button>
        </section>
        <button id="listeningRetry" class="listening-next" type="button" hidden>もう一度読み込む</button>
      </footer>`;
    doc.body.append(app); app.dataset.screen = 'setup'; app.dataset.state = 'setup';
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
    let session, speech, viewSerial = 0, pendingAutoplay = false, imagesReady = false, isSetup = true, selectedOption;
    const status = text => { $('listeningStatus').textContent = text; };
    const syncChoices = () => app.querySelectorAll('.listening-choice').forEach(button => {
      button.disabled = !imagesReady || !session || session.state !== 'playing' || !session.heard;
    });
    const voiceMessage = () => '英語の読み上げ音声を利用できません。端末の音声設定を確認してください。';
    function audioState(event) {
      if (isSetup) return;
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
      if (isSetup) return;
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
        status(session.state === 'error' ? session.errorReason === 'insufficient-choices' ? 'この難易度では異なる4枚のイラストがそろいません。ほかの難易度を選んでください。' : '4枚の確認済みイラストを読み込めませんでした。通信と最新版のデータを確認してください。' : '確認済みのイラストを読み込み中…');
        return;
      }
      for (const id of ['listeningVerdict', 'listeningWord', 'listeningMeaning', 'listeningSentence', 'listeningTranslation']) $(id).textContent = '';
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
      if (isSetup || !pendingAutoplay || !imagesReady || doc.hidden || session?.state !== 'playing') return;
      pendingAutoplay = false;
      if (!session.replay()) status(speech.availability('en') === 'ready'
        ? '自動再生を開始できませんでした。中央のボタンで英文を聞いてください。' : voiceMessage());
      syncChoices();
    }
    async function next(unlockOutput = false) {
      if (isSetup || !session) return;
      const serial = ++viewSerial;
      pendingAutoplay = false; imagesReady = false;
      const focusSpeaker = doc.activeElement === $('listeningNext');
      const loading = session.next();
      // This call is still on START's input stack, before image preparation's
      // first microtask. Session.next has already stopped the previous route.
      let routeReady;
      if (unlockOutput) {
        try { routeReady = Promise.resolve(speech.prepareOutputRoute()).then(() => true, () => false); }
        catch { routeReady = Promise.resolve(false); }
      }
      render();
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
      const outputReady = routeReady ? await routeReady : true;
      if (serial !== viewSerial || isSetup) return;
      imagesReady = true;
      $('listeningStage').setAttribute('aria-busy', 'false');
      $('listeningSpeaker').disabled = speech.availability('en') !== 'ready';
      pendingAutoplay = ready && outputReady;
      if (outputReady) autoplay();
      else status('音声を準備できませんでした。中央の再生ボタンでもう一度試してください。');
      if (ready && focusSpeaker && session.state === 'playing') $('listeningSpeaker').focus({ preventScroll: true });
    }
    function select(index) {
      const answer = session.choose(index);
      if (!answer) return;
      if (!answer.correct) {
        app.dataset.state = session.state;
        app.dataset.reveal = 'grid';
        $('listeningAnswer').hidden = true;
        app.querySelectorAll('.listening-choice').forEach((button, i) => {
          button.classList.toggle('is-wrong', i === index);
          button.classList.remove('is-correct', 'is-featured');
          button.setAttribute('aria-label', `イラスト${i + 1}${i === index ? '、不正解' : ''}`);
        });
        syncChoices();
        status('もう一度。ほかのイラストを選んでください。中央のボタンで英文を聞き直せます。');
        return;
      }
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
    function showSetup() {
      isSetup = true; viewSerial++; pendingAutoplay = false; imagesReady = false;
      session?.pauseForSetup(); speech?.suspendOutput();
      app.dataset.screen = 'setup'; app.dataset.state = 'setup'; app.dataset.reveal = 'grid';
      $('listeningStage').hidden = true; $('listeningFooter').hidden = true;
      $('listeningRoundTools').hidden = true; $('listeningSetup').hidden = false;
      $('listeningChoices').replaceChildren(); $('listeningAnswer').hidden = true;
      $('listeningCount').textContent = '';
      $('listeningSetupStatus').textContent = selectedOption ? '難易度を選び直して「始める」を押してください。' : '難易度を選んでから「始める」を押してください。';
    }
    $('listeningStart').addEventListener('click', () => {
      if (!session || !selectedOption?.playable || !session.setLevel(selectedOption.level)) return;
      isSetup = false; app.dataset.screen = 'playing';
      $('listeningSetup').hidden = true; $('listeningStage').hidden = false;
      $('listeningFooter').hidden = false; $('listeningRoundTools').hidden = false;
      $('listeningChosenLevel').textContent = selectedOption.level === null ? 'おまかせ' : `難易度 ★ ${selectedOption.level / 2} / 5`;
      next(true);
    });
    $('listeningChooseLevel').addEventListener('click', () => {
      showSetup(); $('listeningSetupTitle').focus({ preventScroll: true });
    });
    $('listeningNext').addEventListener('click', () => next());
    $('listeningRetry').addEventListener('click', () => root.location.reload());
    doc.addEventListener('visibilitychange', () => {
      if (isSetup) return;
      if (doc.hidden) {
        if (session?.state === 'playing' && !session.heard) pendingAutoplay = true;
        speech?.suspendOutput();
      } else autoplay();
    });
    root.addEventListener('pagehide', () => { viewSerial++; session?.stop(); speech?.closeOutput(); });
    root.addEventListener('pageshow', event => {
      if (!event.persisted || !session || isSetup) return;
      if (session.state === 'loading' || (session.state === 'playing' && !imagesReady)) next();
      else if (session.state === 'playing' && !session.heard) { pendingAutoplay = true; autoplay(); }
    });
    try {
      const reviewed = root.WordBloomReviewedScenes;
      if (!root.PictlingoListeningCore || !root.WordBloomSpeech || !reviewed || !root.WordBloomLearningGate) throw new Error('missing-runtime');
      speech = new root.WordBloomSpeech.Pronunciation({ primeScenes: root.matchMedia('(min-width:861px)').matches, outputScenes: true,
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
      $('listeningLevels').replaceChildren(...root.PictlingoListeningCore.levelOptions(words).map(option => {
        const { level, count, playable } = option;
        const button = doc.createElement('button'); button.type = 'button'; button.className = 'listening-level-choice';
        button.dataset.level = level === null ? 'all' : String(level);
        if (level === null) button.classList.add('is-all');
        button.setAttribute('aria-pressed', 'false'); button.disabled = !playable;
        const label = doc.createElement('strong'); label.textContent = level === null ? 'おまかせ' : `★ ${level / 2} / 5`;
        const detail = doc.createElement('small'); detail.textContent = `${count}問${playable ? '' : '・4択に必要なイラストが不足'}`;
        button.append(label, detail);
        button.addEventListener('click', () => {
          if (!isSetup || !playable) return;
          selectedOption = option;
          $('listeningLevels').querySelectorAll('button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
          $('listeningStart').disabled = false;
          $('listeningStart').textContent = level === null ? 'おまかせで始める' : `★ ${level / 2} で始める`;
          $('listeningSetupStatus').textContent = '「始める」を押すと英文と4枚のイラストが出ます。';
        });
        return button;
      }));
      showSetup();
    } catch {
      app.dataset.state = 'error'; $('listeningSetupStatus').textContent = '確認済みデータを読み込めません。最新版に再読み込みしてください。';
    }
  }
  root.PictlingoListening = { requested, mount };
})(window);
