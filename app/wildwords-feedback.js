/* Browser-local, reversible feedback for each character. */
(() => {
  const key = 'wildwords-character-feedback-v1';
  let votes = {};
  try { votes = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
  const paint = () => document.querySelectorAll('[data-character-vote]').forEach(group => {
    const vote = votes[group.dataset.characterVote];
    group.querySelectorAll('button').forEach(button => {
      const active = vote === button.dataset.vote;
      button.setAttribute('aria-pressed', String(active));
      button.title = active ? 'もう一度押すと取り消します' : button.textContent;
    });
  });
  const controls = id => {
    const group = document.createElement('div');
    group.className = 'wild-feedback';
    group.dataset.characterVote = id;
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'このキャラクターへの評価');
    group.innerHTML = '<button type="button" data-vote="good" aria-pressed="false">いいね</button><button type="button" data-vote="bad" aria-pressed="false">良くないね</button>';
    group.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (votes[id] === button.dataset.vote) delete votes[id];
      else votes[id] = button.dataset.vote;
      try { localStorage.setItem(key, JSON.stringify(votes)); } catch {}
      paint();
    });
    return group;
  };
  const mount = () => {
    document.querySelectorAll('.wild-root-card:not([data-feedback-ready])').forEach(card => {
      const id = decodeURIComponent(card.getAttribute('href').split('/').pop());
      card.dataset.feedbackReady = 'true';
      const item = document.createElement('div');
      item.className = 'wild-character-item';
      card.before(item);
      item.append(card, controls(id));
    });
    const center = document.querySelector('.rmCenter');
    if (center && !center.querySelector('.wild-feedback') && location.hash.startsWith('#/root/')) {
      center.append(controls(decodeURIComponent(location.hash.split('/').pop())));
    }
    paint();
  };
  new MutationObserver(records => {
    if (records.some(r => r.addedNodes.length)) mount();
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    try { votes = JSON.parse(event.newValue || '{}') || {}; } catch { votes = {}; }
    paint();
  });
  mount();
})();
