"use strict";

/* A presentation layer only: dictionary records and review decisions stay intact. */
window.ETYMOPEDIA_WILD = (() => {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  const artBase = "chara/etymopedia-wild/";
  const colours = ["#eaff64", "#c5f0e8", "#ffd9e2", "#ffdbb2", "#d7d3ff", "#c9e5ff"];
  const manifest = () => window.ETYMO_WILD_CHARACTERS || [];

  function applyRoots(roots) {
    manifest().forEach(character => {
      if (!roots[character.id]) return;
      roots[character.id].art = artBase + character.file;
      roots[character.id].wildCharacter = character;
    });
  }

  function imageTag(root, imageURL, extra = "") {
    return `<img src="${esc(imageURL(root.art))}" alt="${esc(root.wildCharacter?.name || root.jp)}" ${extra}>`;
  }

  function renderHome({ UI, ROOTS, LEXICON, WORDS, SUBS, imgURL }) {
    const entries = Object.entries(ROOTS);
    const wordCount = Object.values(LEXICON).reduce((n, words) => n + words.length, 0) || WORDS.length;
    const rootLink = id => `#/root/${encodeURIComponent(id)}`;
    document.getElementById("logoSub").textContent = "ETYMOPEDIA / WORD CREATURES";
    document.getElementById("searchInput").setAttribute("aria-label", "英単語・意味・語根を検索");
    document.getElementById("nav").innerHTML = '<a href="#roots">キャラ図鑑</a><a href="#words">単語ずかん</a><a href="#join">参加する ↗</a>';

    const main = ROOTS.oino;
    const left = ROOTS.kaput;
    const right = ROOTS.men;
    const creature = (root, id, cls, label) => root ? `<a class="wild-creature ${cls}" href="${rootLink(id)}" aria-label="${esc(root.jp)}の語源クリーチャーを発見する">
      ${imageTag(root, imgURL, 'fetchpriority="high" width="512" height="512"')}
      <span class="wild-specimen-label">${esc(label)}</span></a>` : "";

    document.getElementById("heroInner").innerHTML = `
      <div class="wild-hero-copy">
        <div class="wild-eyebrow">ことばの祖先、クセがすごい。</div>
        <h1>その英単語、<br><span class="wild-title">ヘンなやつで</span><br>覚えよう。</h1>
        <p class="lead">キャベツに、筋肉。タマネギに、一輪タイヤ。<br>このヘンな姿をつないでいるのは、<b>英単語の語源。</b><br>ことばの祖先「エティモン」と、意外なつながりを発見しよう。</p>
        <div id="heroCtas">
          <a class="btn wild-primary" href="#roots">クリーチャーを発見する<span class="wild-arrow" aria-hidden="true">↗</span></a>
          <a class="btn" href="#words">単語をさがす<span class="wild-arrow" aria-hidden="true">→</span></a>
        </div>
        <div class="wild-hero-foot"><span>語源からつながる英語</span><span>${entries.length}体の祖先 / ${wordCount.toLocaleString("ja-JP")}語のつながり</span></div>
      </div>
      <div id="heroArt" class="wild-stage">
        <span class="wild-stage-word" aria-hidden="true">WILD<br>WORDS!</span>
        <span class="wild-stage-hint">キャラを押して、語源を発見 ↙</span>
        <div class="wild-stamp" aria-hidden="true"><span>見た目のナゾは</span><strong>語源!</strong></div>
        ${creature(main, "oino", "main", "ONE × ONION × UNICORN")}
        ${creature(left, "kaput", "left", "HEAD × CABBAGE")}
        ${creature(right, "men", "right", "THINK × MONSTER")}
      </div>`;

    if (!document.getElementById("wildIntro")) {
      const intro = document.createElement("section");
      intro.id = "wildIntro";
      intro.className = "wild-intro";
      document.getElementById("ticker").after(intro);
    }
    document.getElementById("wildIntro").innerHTML = `<div class="wrap">
      <div><span class="wild-section-no">WHY SO WEIRD?</span><h2>見た目はヘン。<br>つながりには、ワケがある。</h2></div>
      <div><p>英単語をたどると、何千年も前の「印欧祖語」に出会うことがあります。<br>エティモンは、そのつながりを姿にした語源クリーチャー。<b>キャラの意味から、仲間の英単語へ。</b></p>
      <p class="wild-original-lead">${UI.hero_lead || ""}</p>
      <div id="stats"><div class="st"><div class="n">${entries.length}</div><div class="l">${esc(UI.stat_roots_label)}</div></div>
      <div class="st"><div class="n">${wordCount.toLocaleString("ja-JP")}</div><div class="l">${esc(UI.stat_words_label)}</div></div>
      <div class="st"><div class="n">${Object.values(SUBS).reduce((n, illustrations) => n + illustrations.length, 0).toLocaleString("ja-JP")}</div><div class="l">${esc(UI.stat_arts_label)}</div></div></div></div></div>`;

    const rootHeading = document.getElementById("rootsHead");
    rootHeading.innerHTML = '<span class="wild-section-no">01 / MEET THE ETYMONS</span>クセものぞろいの、祖先たち。';
    document.getElementById("rootsSub").innerHTML = '気になる姿から、ことばの一族へ。<br><button class="wild-random" type="button" data-wild-random>おまかせで出会う ↗</button>';
    document.getElementById("rootStrip").innerHTML = entries.map(([id, root], index) => {
      const words = LEXICON[id] || [];
      const character = root.wildCharacter;
      const preferred = {
        kaput: ["head", "cabbage", "captain"], ane: ["animal", "animate", "animation"],
        bha: ["phone", "fame", "fate"], gwei: ["vitamin", "vital", "survive"],
        oino: ["one", "onion", "unicorn"], reg: ["rule", "royal", "correct"],
        weid: ["view", "vision", "idea"], ye: ["eject", "project", "object"],
        mori: ["marine", "mermaid", "marsh"], men: ["mind", "monster", "monitor"],
        do: ["donate", "data", "dose"], genu: ["knee", "polygon", "diagonal"]
      }[id] || [];
      const familyWords = words.map(word => word[0]);
      const tags = [...preferred.filter(word => familyWords.includes(word)), ...familyWords].filter((word, at, all) => all.indexOf(word) === at).slice(0, 3);
      return `<a class="rootCard wild-root-card" style="--rc:${esc(root.c)};--wild-card-bg:${colours[index % colours.length]}" href="${rootLink(id)}">
        <div class="wild-root-art"><span class="wild-root-index">ETYMON / ${String(index + 1).padStart(2, "0")}</span>
          ${imageTag(root, imgURL, 'loading="lazy" width="512" height="512"')}<span class="wild-root-go" aria-hidden="true">↗</span></div>
        <div class="wild-root-info"><div class="wild-root-meaning">${esc(root.jp)}<i>${esc(root.r)}</i></div>
          ${character ? `<div class="wild-root-name">${esc(character.name)}</div>` : ""}
          <div class="wild-word-tags">${tags.map(word => `<span>${esc(word)}</span>`).join("")}</div>
          <div class="wild-root-count"><span>${words.length}語の一族</span><span>つながりを見る →</span></div></div></a>`;
    }).join("");

    const wordsHeading = document.getElementById("wordsHead");
    wordsHeading.innerHTML = `<span class="wild-section-no">02 / WORD DISCOVERIES</span>${esc(UI.words_head || "単語ずかん & みんなの図版")}`;
    const joinHeading = document.getElementById("joinHead");
    joinHeading.innerHTML = `<span class="wild-section-no" style="color:var(--yellow)">03 / MAKE IT YOURS</span>${esc(UI.join_head || "辞書づくりに、参加しよう")}`;
    if (!document.querySelector(".wild-join-actions")) {
      const actions = document.createElement("div");
      actions.className = "wild-join-actions";
      actions.innerHTML = `<button class="btn yellow" type="button" data-wild-game>${esc(UI.hero_cta2 || "あそびながら集める")}</button><small>ゲームは開発中。いまは図鑑で、ことばのつながりを発見しよう。</small>`;
      document.getElementById("steps").after(actions);
    }
    document.getElementById("footer").innerHTML = `<div class="wild-footer-brand" aria-hidden="true">STAY CURIOUS.</div>${UI.footer || ""}`;

    const random = document.querySelector("[data-wild-random]");
    random.addEventListener("click", () => {
      const [id] = entries[Math.floor(Math.random() * entries.length)];
      location.hash = rootLink(id);
    });
    document.querySelector("[data-wild-game]").onclick = () => window.toast("ゲーム開発中!");
  }

  function decorateRoot(root) {
    const center = document.querySelector(".rmCenter");
    if (!center || !root.wildCharacter) return;
    const kicker = document.createElement("span");
    kicker.className = "wild-detail-kicker";
    kicker.textContent = "MEET YOUR WORD ANCESTOR";
    center.prepend(kicker);
    const caption = document.createElement("p");
    caption.className = "wild-detail-name";
    caption.textContent = root.wildCharacter.name;
    center.append(caption);
    center.querySelector(".rmChar").alt = root.wildCharacter.name;
  }

  return { applyRoots, renderHome, decorateRoot };
})();
