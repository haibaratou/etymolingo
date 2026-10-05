/* Pictpedia の飾りつけ。辞書の中身と動き(eigo-no-e/app.js)には手を入れず、
   描かれた画面にキャラクターと見出しを足すだけ。 */
(() => {
'use strict';
const IMG = 'pictpedia/img/';
const ch = (name, cls = '', alt = '') => `<img class="${cls}" src="${IMG}${name}.webp" alt="${alt}" loading="lazy" decoding="async">`;
const view = document.getElementById('view');
const num = n => Number(n || 0).toLocaleString('ja-JP');

// 検索バーは1本だけ。トップではパネルの中へ移し、ほかのページではヘッダーへ戻す
// (要素ごと移すので、候補表示・単語/あいまいの切り替えはそのまま動く)
const bar = document.getElementById('barSearch');
const barHome = document.querySelector('.bar-in');
function placeSearch(slot) {
  if (!bar) return;
  if (slot) { if (bar.parentNode !== slot) slot.append(bar); }
  else if (bar.parentNode !== barHome) barHome.append(bar);
  document.body.classList.toggle('pp-search-in-panel', !!slot);
}

function decorate() {
  const page = view.firstElementChild;
  if (!page || page.dataset.pp) return;
  page.dataset.pp = '1';
  if (!page.querySelector('.pict-hero')) placeSearch(null);

  // 読み込み中
  if (page.matches('.empty[role="status"]')) {
    page.insertAdjacentHTML('afterbegin', `<div class="pp-state">${ch('pair-thinking', '', '')}</div>`);
    return;
  }

  // トップ: ヒーローの下に、ふたりと大きな検索
  const hero = page.querySelector('.pict-hero');
  if (hero) {
    const total = window.EIGO_NO_E?.total_art;
    hero.insertAdjacentHTML('afterend', `<section class="pp-panel" aria-label="さがす">
      ${ch('pair-welcome', 'pp-pair', 'Pictpedia のふたり')}
      <h2>英単語を、<span>イラスト</span>でさがそう！</h2>
      <p>${total ? `<b>${num(total)}</b> 枚のイラストから、` : ''}英語でも日本語でもさがせます。</p>
      <div class="pp-search-slot"></div>
    </section>`);
    const panel = page.querySelector('.pp-panel');
    placeSearch(panel.querySelector('.pp-search-slot'));
    const tries = page.querySelector('.tryline');
    if (tries) panel.append(tries);
    const cats = page.querySelector('#categories');
    if (cats) cats.insertAdjacentHTML('afterbegin', ch('girl-pointing', 'pp-peek', ''));
    const pick = [...page.querySelectorAll('.h2')].find(h => h.textContent.includes('ピックアップ'));
    if (pick) pick.insertAdjacentHTML('afterbegin', ch('boy-running', 'pp-peek', ''));
    return;
  }

  // 見つからない・エラー
  const empty = page.matches('.empty') ? page : page.querySelector('.empty');
  if (empty) {
    empty.insertAdjacentHTML('afterbegin', `<div class="pp-state">${ch('boy-sad', '', '')}${ch('girl-sad', '', '')}</div>`);
    return;
  }

  // 検索結果: 見つかったら女の子が喜ぶ
  const h1 = page.querySelector('.h1');
  if (h1 && page.querySelector('.hint') && page.querySelector('.grid')) h1.insertAdjacentHTML('beforeend', ch('girl-joy', 'pp-joy', ''));

  // 単語ページ: 関連イラストの見出しで男の子が指さす
  const related = [...page.querySelectorAll('.h2')].find(h => h.textContent.includes('関連する'));
  if (related) related.insertAdjacentHTML('afterbegin', ch('boy-pointing', 'pp-peek', ''));
}

new MutationObserver(decorate).observe(view, {childList: true});
decorate();

// フッター
const foot = document.querySelector('.foot');
if (foot && !foot.querySelector('.pp-foot-run')) {
  const wordCrowd = (names, side) => names.map(word => `<img class="pp-foot-word pp-foot-${side}" src="../assets/word/${word}.png" alt="" loading="lazy" decoding="async">`).join('');
  const leftWords = ['runs', 'boy', 'boyfriend', 'friendship', 'brotherhood', 'childhood', 'play', 'run'];
  const rightWords = ['girl', 'girlfriend', 'friend', 'dance', 'laughing', 'love', 'meet@mod', 'hug'];
  foot.insertAdjacentHTML('afterbegin', `<div class="pp-foot-run" aria-hidden="true"><div class="pp-foot-crowd pp-foot-left">${wordCrowd(leftWords, 'left')}</div><div class="pp-foot-meet">${ch('boy-running', 'pp-foot-mascot', '')}${ch('girl-running', 'pp-foot-mascot', '')}</div><div class="pp-foot-crowd pp-foot-right">${wordCrowd(rightWords, 'right')}</div></div>`);
  foot.querySelector('.foot-in > p')?.insertAdjacentHTML('beforebegin', `<img class="pp-foot-logo" src="${IMG}logo.webp" alt="Pictpedia">`);
}
})();
