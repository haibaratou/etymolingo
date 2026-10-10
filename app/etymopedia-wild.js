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
    document.querySelector("#logo b").innerHTML = "ワイルド<span>ワード</span>";
    document.getElementById("logoSub").textContent = "WILD WORDS / LOST ANCESTORS";
    document.getElementById("searchInput").setAttribute("aria-label", "英単語・意味・語根を検索");
    document.getElementById("nav").innerHTML = '<a href="#wildIntro">世界の記憶</a><a href="#roots">祖先たち</a><a href="#wildLineage">言葉の系譜</a>';
    document.getElementById("words").hidden = true;
    document.getElementById("join").hidden = true;

    const main = ROOTS.oino;
    const left = ROOTS.kaput;
    const right = ROOTS.men;
    const creature = (root, id, cls, label) => root ? `<a class="wild-creature ${cls}" href="${rootLink(id)}" aria-label="${esc(root.jp)}の語源クリーチャーを発見する">
      ${imageTag(root, imgURL, 'fetchpriority="high" width="512" height="512"')}
      <span class="wild-specimen-label">${esc(label)}</span></a>` : "";

    document.getElementById("heroInner").innerHTML = `
      <div class="wild-hero-copy">
        <div class="wild-eyebrow">六千年前の野生が、あなたの言葉に息づいている。</div>
        <h1>姿は消えた。<br><span class="wild-title">言葉は、</span><br>生き残った。</h1>
        <p class="lead">六千年前、世界には<b>言葉の祖先となる動物たち</b>がいた。<br>彼らの名は、ワイルドワード。<br>今は絶滅したその遺伝子は、ラテン語、ギリシャ語、<br>そして、私たちが使う英語に受け継がれている。</p>
        <div id="heroCtas">
          <a class="btn wild-primary" href="#roots">言葉の祖先に会う<span class="wild-arrow" aria-hidden="true">↗</span></a>
          <a class="btn" href="#wildIntro">世界の記憶をたどる<span class="wild-arrow" aria-hidden="true">↓</span></a>
        </div>
        <div class="wild-hero-foot"><span>姿を失っても、血筋は途絶えない。</span><span>${entries.length}体の祖先 / ${wordCount.toLocaleString("ja-JP")}語に残る遺伝子</span></div>
      </div>
      <div id="heroArt" class="wild-stage">
        <span class="wild-stage-word" aria-hidden="true">WILD<br>WORDS!</span>
        <span class="wild-stage-hint">祖先を選び、その血筋をたどる ↙</span>
        <div class="wild-stamp" aria-hidden="true"><span>生きていた証は</span><strong>言葉。</strong></div>
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
      <div><span class="wild-section-no">01 / THE LOST WILD</span><h2>六千年前、<br>言葉はまだ、<br>野生だった。</h2></div>
      <div class="wild-story-copy"><p>まだ文字のない時代。森にも、草原にも、人の暮らしのすぐそばにも、ワイルドワードたちは生きていた。「頭」を持つもの。「息」を吹きこむもの。「ひとつ」を貫くもの。その姿には、生きるための力が刻まれていた。人々は彼らの名で、世界を呼んだ。</p>
      <p>やがて彼らは絶滅し、世界から姿を消した。けれど、人が呼び交わした声のなかには、彼らの遺伝子が残った。声は土地を越え、世代を越え、姿も音も変えながら、新しい言葉へと枝分かれしていった。</p>
      <p class="wild-story-punch">私たちは今も、彼らの子孫を口にしている。</p>
      <div id="stats"><div class="st"><div class="n">6,000</div><div class="l">年前の野生</div></div>
      <div class="st"><div class="n">${entries.length}</div><div class="l">姿を取り戻した祖先</div></div>
      <div class="st"><div class="n">${wordCount.toLocaleString("ja-JP")}</div><div class="l">血筋を受け継ぐ言葉</div></div></div></div></div>`;

    if (!document.getElementById("wildLineage")) {
      const lineage = document.createElement("section");
      lineage.id = "wildLineage";
      document.getElementById("roots").after(lineage);
    }
    document.getElementById("wildLineage").innerHTML = `<div class="wrap">
      <span class="wild-section-no">03 / THE LIVING GENES</span>
      <h2>言葉は、祖先の生存証明。</h2>
      <p class="wild-lineage-lead">同じ祖先から生まれても、旅した土地が違えば、音も意味も変わる。<br>ラテン語へ。ギリシャ語へ。そして英語へ。別々の道を歩んだ言葉にも、同じ血筋の痕跡がある。</p>
      <div class="wild-lineage-grid">
        <article><span>LATIN</span><h3>ラテン語に残る血筋</h3><p>人の暮らしに根を下ろし、やがて海を渡った言葉たち。</p><b>capital · captain</b></article>
        <article><span>GREEK</span><h3>ギリシャ語に残る血筋</h3><p>声から音楽へ、知恵から学問へ。新しい意味をまとった言葉たち。</p><b>phone · symphony</b></article>
        <article><span>ENGLISH</span><h3>英語に残る血筋</h3><p>遠い祖先を忘れても、毎日の会話で生き続ける言葉たち。</p><b>head · one</b></article>
      </div>
      <div class="wild-evidence"><div><span class="wild-section-no">ONE ANCESTOR / MANY DESCENDANTS</span><h3>head と captain。<br>遠い親戚の、同じ「頭」。</h3><p>体のいちばん上にある頭。人の集まりの先頭に立つ長。姿も音も違うこの二つの言葉をたどると、同じ祖先「*kaput-」に行き着く。</p><p>これが、言葉に残された遺伝子。英単語を覚えることは、失われた野生の血筋をひとつずつ見つけることだ。</p><a class="btn" href="#/root/kaput">「頭」の一族をたどる ↗</a></div><a class="wild-evidence-art" href="#/root/kaput" aria-label="頭の祖先とその子孫をたどる">${imageTag(ROOTS.kaput, imgURL, 'loading="lazy" width="512" height="512"')}<b>*kaput- → head / captain</b></a></div>
      <p class="wild-world-note">語源という本物のつながりから、この物語は生まれた。ワイルドワードは、言葉の祖先を野生の動物として描くファンタジーです。</p>
    </div>`;

    const rootHeading = document.getElementById("rootsHead");
    rootHeading.innerHTML = '<span class="wild-section-no">02 / MEET YOUR ANCESTORS</span>言葉の祖先たち。';
    document.getElementById("rootsSub").innerHTML = 'この姿から、いくつもの言葉が生まれた。<br><button class="wild-random" type="button" data-wild-random>まだ見ぬ祖先に出会う ↗</button>';
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
          <div class="wild-root-count"><span>${words.length}語の子孫</span><span>血筋をたどる →</span></div></div></a>`;
    }).join("");

    document.getElementById("footer").innerHTML = '<div class="wild-footer-brand" aria-hidden="true">STILL WILD.</div><p>言葉のなかに、野生は残る。</p><small>WILD WORDS / THE LOST ANCESTORS</small>';

    const random = document.querySelector("[data-wild-random]");
    random.addEventListener("click", () => {
      const [id] = entries[Math.floor(Math.random() * entries.length)];
      location.hash = rootLink(id);
    });
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
