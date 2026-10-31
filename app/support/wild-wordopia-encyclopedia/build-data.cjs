#!/usr/bin/env node
/* Wild Wordopia 図鑑の公開用データを作る。
 *
 * 読むのは公開チェックアウトにある既存の生成物だけ(語彙マスターと同じ読み先):
 *   app/data/generated-etymon/  words.json roots.json word-parts.json …
 *   app/eigo-no-e/data.js       Pictlingo Dictionary の画像カタログ
 *   assets/word/illustration-index.js
 *   assets/chara/brainrot/      ワイルド(語根キャラ)の候補ライブラリ
 *   app/support/character-manager/latest-site-images.js
 *
 * 新しい語義・語源・解説は作らない。マスターに無い値は空のまま出す。
 * 母艦の det/ eo/(買った辞書・etymonline の本文)は読まない。
 *
 *   node app/support/wild-wordopia-encyclopedia/build-data.cjs [--root <checkout>] [--check]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const ROOT = path.resolve(opt('--root') || path.join(__dirname, '..', '..', '..'));
const CHECK = args.includes('--check');
const APP = path.join(ROOT, 'app');
const OUT = path.join(APP, 'support', 'wild-wordopia-encyclopedia', 'data');
const GEN = path.join(APP, 'data', 'generated-etymon');

global.window = global;
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const loadScript = p => { delete require.cache[require.resolve(p)]; return require(p); };
const sha256 = buf => crypto.createHash('sha256').update(buf).digest('hex');
const nfc = s => String(s || '').normalize('NFC');

async function main() {
  /* ---------- 語彙マスター(語彙マスターデータベースと同じ結び付け) ---------- */
  const words = readJSON(path.join(GEN, 'words.json'));
  const roots = readJSON(path.join(GEN, 'roots.json'));
  const parts = readJSON(path.join(GEN, 'word-parts.json'));
  const manifest = readJSON(path.join(GEN, 'manifest.json'));
  const Origins = loadScript(path.join(APP, 'shared', 'etymology-origins.js'));
  const Identity = loadScript(path.join(APP, 'shared', 'lexical-identity.js'));
  const Components = loadScript(path.join(APP, 'shared', 'etymological-components.js'));
  loadScript(path.join(GEN, 'etymology-origins.js'));
  loadScript(path.join(GEN, 'word-parts-supplement.js'));
  const componentPayload = require('../../shared/component-payload-node.cjs').readPayload(GEN, {roots});
  loadScript(path.join(ROOT, 'assets', 'word', 'illustration-index.js'));
  const report = {};
  report.wordParts = Origins.bindWordParts(words, parts, global.ETYMON_WORD_PARTS_SUPPLEMENT);
  report.origins = Origins.bind(words, Origins.prepare(global.ETYMON_ETYMOLOGY_ORIGINS));
  Identity.applyArtwork(words, global.ETYMON_WORD_ART || {});
  let components = null;
  try { components = Components.bind(words, Components.prepare(componentPayload, roots)); }
  catch (e) { report.componentsError = String(e.message || e); }

  /* ---------- Pictlingo Dictionary の現行カタログ(http 経路と同じ組み立て) ---------- */
  loadScript(path.join(APP, 'eigo-no-e', 'data.js'));
  const Catalog = loadScript(path.join(APP, 'eigo-no-e', 'catalog-validation.js'));
  const Semantic = loadScript(path.join(APP, 'shared', 'semantic-classifications.js'));
  const generated = global.EIGO_NO_E;
  const scenes = readJSON(path.join(GEN, 'illustration-scenes.json'));
  const indexText = fs.readFileSync(path.join(ROOT, 'assets', 'word', 'illustration-index.js'), 'utf8');
  const artIndex = JSON.parse(indexText.slice(indexText.indexOf('{'), indexText.lastIndexOf('}') + 1));
  const sameWords = manifest.files?.words?.sha256 === generated.sources?.words_sha256;
  const catalogWords = sameWords
    ? generated.words.map(w => ({ ...w, ...(w.semanticCanonical || {}), ja_readings: w.k ? [{ gloss: w.ja, kana: w.k }] : [] }))
    : words;
  let D = Catalog.buildCurrentCatalog(generated, scenes, catalogWords, artIndex);
  try {
    const semBytes = fs.readFileSync(path.join(GEN, 'semantic-classifications.json'));
    if (sha256(semBytes) !== manifest.files?.semantic_classifications?.sha256) throw Error('semantic hash mismatch');
    D = await Semantic.applyToCatalog(D, JSON.parse(semBytes.toString('utf8')), catalogWords);
  } catch (e) {
    // Pictlingo Dictionary と同じ退避: 確認できない意味分類は「いろいろなことば」へ戻す。
    report.semanticError = String(e.message || e);
    D = semanticFallback(D, generated);
  }

  /* ---------- 付帯データ(Pictlingo が単語ページで使うもの) ---------- */
  const Lex = loadScript(path.join(APP, 'eigo-no-e', 'lexical-utils.js'));
  const Verb = loadScript(path.join(APP, 'shared', 'verb-inflections.js'));
  const Levels = loadScript(path.join(APP, 'shared', 'custom-learning-levels.js'));
  loadScript(path.join(GEN, 'custom-learning-levels.js'));
  loadScript(path.join(GEN, 'us-pronunciations.js'));
  loadScript(path.join(GEN, 'lexical-profiles.js'));
  loadScript(path.join(GEN, 'dictionary-basics.js'));
  let levels = null;
  try { levels = await Levels.decode(global.ETYMON_CUSTOM_LEARNING_LEVELS); } catch (e) { report.levelsError = String(e.message || e); }
  const usPron = await Lex.decodeBasics(global.ETYMON_US_PRONUNCIATIONS_GZIP).catch(() => ({ entries: [] }));
  const usByWord = new Map(usPron.entries.map(e => [e.w, e]));
  const basics = await Lex.decodeBasics(global.ETYMON_DICTIONARY_BASICS_GZIP).catch(() => ({ entries: [] }));
  const basicById = new Map(basics.entries.map(e => [e.dictionaryIndex, e]));
  const basicByKey = new Map();
  for (const e of basics.entries) { const k = Lex.key(e.w, e.p); if (!basicByKey.has(k)) basicByKey.set(k, []); basicByKey.get(k).push(e); }
  const profiles = global.ETYMON_LEXICAL_PROFILES || { entries: [] };
  const basicRecord = w => {
    const match = e => e && Lex.key(e.w, e.p) === Lex.key(w.w, w.p) && String(e.ja || '').split('、')[0] === String(w.ja || '').split('、')[0];
    const direct = basicById.get(w.dictionaryIndex); if (match(direct)) return direct;
    const hits = (basicByKey.get(Lex.key(w.w, w.p)) || []).filter(match); return hits.length === 1 ? hits[0] : null;
  };

  /* ---------- ワイルド(語根キャラ) ---------- */
  global.location = { href: 'file:///checkout/app/wild-wordopia-encyclopedia.html', search: '', protocol: 'file:' };
  global.localStorage = { getItem() { return null; }, setItem() {} };
  global.WILDWORDOPIA_SELECTION_SYNC = { query() { return {}; }, read() { return {}; }, connect() {} };
  loadScript(path.join(ROOT, 'assets', 'chara', 'brainrot', 'library', 'library.js'));
  loadScript(path.join(ROOT, 'assets', 'chara', 'brainrot', 'site-characters.js'));
  const chars = (global.ETYMOPEDIA_BRAINROT?.characters) || [];
  let latest = {};
  try {
    loadScript(path.join(APP, 'support', 'character-manager', 'latest-site-images.js'));
    const L = global.WILDWORDOPIA_LATEST_CHARACTER_IMAGES;
    if (L?.schema === 1) for (const [k, v] of Object.entries(L.selections || {}))
      if (typeof v?.path === 'string' && /^\.\.\/[A-Za-z0-9_./-]+\.png$/.test(v.path) && !v.path.includes('..', 3)) latest[k] = v.path;
  } catch (e) { report.latestImagesError = String(e.message || e); }
  const rootByKey = new Map(roots.map(r => [r.key, r]));
  const charByRoot = new Map();
  for (const c of chars) {
    const key = rootByKey.has(c.rootKey) ? c.rootKey : null;
    if (!key) { (report.unmatchedCharacters ||= []).push(c.id); continue; }
    if (charByRoot.has(key)) continue;
    const libId = (c.candidates?.[0]?.rootId) || c.stem?.replace(/^root-/, '') || c.id;
    const art = latest[c.id] || latest[libId] || latest[String(c.rootKey).replace(/-/g, '')] || '';
    charByRoot.set(key, {
      name: c.kana || '',
      nameEn: c.rootCharacterName?.name || '',
      file: '../assets/chara/brainrot/' + c.file,
      latest: art,
      color: c.color || rootByKey.get(key).color || '',
      rep: c.rootCharacterName?.representativeWord || '',
    });
  }

  /* ---------- 公開する語(イラストがあり、語彙マスターと一致するものだけ) ---------- */
  const wordKey = w => JSON.stringify([w.w, w.p || [], w.etymology_id || '']);
  const masterByKey = new Map();
  for (const [i, w] of words.entries()) { w._i = i; const k = wordKey(w); if (!masterByKey.has(k)) masterByKey.set(k, []); masterByKey.get(k).push(w); }
  const SUBS = [], subIndex = new Map();
  for (const c of D.categories) for (const s of c.subs) { subIndex.set(c.id + '/' + s.id, SUBS.length); SUBS.push(c.id + '/' + s.id); }

  const ROOT_KEYS = [], rootIdx = new Map();
  const rootRef = key => { if (!rootIdx.has(key)) { rootIdx.set(key, ROOT_KEYS.length); ROOT_KEYS.push(key); } return rootIdx.get(key); };
  for (const key of charByRoot.keys()) rootRef(key);
  const FAMS = [], famIdx = new Map();
  const famRef = f => { if (!famIdx.has(f)) { famIdx.set(f, FAMS.length); FAMS.push(f); } return famIdx.get(f); };
  const LANGS = [], langIdx = new Map();
  const langRef = f => { if (!langIdx.has(f)) { langIdx.set(f, LANGS.length); LANGS.push(f); } return langIdx.get(f); };

  const index = [], details = {}, searchText = [];
  const skipped = { notBound: 0, noMaster: 0, ambiguousMaster: 0 };
  const ids = new Set();
  for (const row of D.words) {
    if (row.bindingStatus !== 'bound' || !row.w || row.unavailable) { skipped.notBound++; continue; }
    const hits = masterByKey.get(wordKey(row)) || [];
    let m = hits.find(w => w._i === row.dictionaryIndex) || (hits.length === 1 ? hits[0] : null);
    if (!m) { skipped[hits.length ? 'ambiguousMaster' : 'noMaster']++; continue; }
    if (ids.has(row.id)) continue; ids.add(row.id);

    const level = levels?.lookup(row)?.level ?? null;
    const reviewedCaption = row.description?.status === 'reviewed' && row.scene?.en && row.scene?.ja;
    const capState = reviewedCaption ? 1 : row.description?.reason === 'illustration_needs_review' ? 2 : row.description?.status === 'mismatch' ? 3 : 0;
    const thumb = String(row.thumb?.path || '');
    const fams = Origins.families(m);
    index.push([
      row.id,                                   // 0 id(Pictlingo と同じ)
      row.w,                                    // 1 英単語
      String(row.ja || ''),                     // 2 第一語義
      String(row.k || ''),                      // 3 語義のよみ(ひらがな)
      thumb.startsWith('eigo-no-e/thumbs/') ? thumb.slice(17) : '', // 4 サムネイル
      row.art,                                  // 5 画像名
      row.image.sha256.slice(0, 12),            // 6 画像の版
      (row.c || []).map(k => subIndex.get(k)).filter(x => x !== undefined), // 7 カテゴリー
      (m.p || []).map(rootRef),                 // 8 祖先(語根)
      level,                                    // 9 独自学習レベル 1-10
      Number.isFinite(m.r) ? m.r : null,        // 10 レア度 r
      fams.map(famRef),                         // 11 語源系統
      capState,                                 // 12 イラスト解説の状態
      row.availability?.en?.playable ? 1 : 0,   // 13 英語パズルで遊べるか
      String(m.k || ''),                        // 14 カナ発音
    ]);

    /* 詳細(開いた語のぶんだけ読む) */
    const prof = Lex.profile(row, profiles);
    const record = basicRecord(row);
    const meanings = Lex.meanings(record ? { ...row, ja: record.ja, pos: record.pos } : row, prof);
    const groups = [];
    for (const s of meanings) {
      let g = groups.find(x => x[0] === (s.pos || ''));
      if (!g) { g = [s.pos || '', []]; groups.push(g); }
      g[1].push(s.usage ? [s.glossJa, s.usage] : [s.glossJa]);
    }
    const imported = usByWord.get(row.w);
    let ipa = [];
    if (imported?.status === 'imported' && imported.ipa.length === 1) ipa = ['/' + imported.ipa[0] + '/'];
    else ipa = [...new Set((prof?.pronunciations || []).filter(x => /米|US|American/i.test(x.label || '')).map(x => '/' + x.ipa + '/'))];
    const verb = Verb.lookup(row.w, record?.pos || row.pos);
    const ann = components?.annotations?.(m);
    const uncertain = (ann?.legacy_relations || []).filter(r => r.status === 'uncertain').map(r => r.key);
    const partsKey = JSON.stringify([m.w, (m.p || []).join('+')]);
    const d = {
      ja: m.ja || '', en: m.en || '', pos: m.pos || '',
      b: m.b || '',                                       // 語源ひとことメモ
      parts: parts[partsKey] || '',                       // 語源組み立て
      lang: Origins.languages(m).map(langRef),            // 起源言語
      pre: m.pre || '', suf: m.suf || '',
      mean: groups,
      forms: (prof?.forms || []).map(f => [f.label, f.value]),
      verb: verb ? verb.map(f => [f.label, f.value]) : [],
      ipa,
      sem: row.semanticDistinction?.ja || '',
      tags: Array.isArray(row.semanticTags) ? row.semanticTags : [],
      unc: uncertain,
      src: prof ? prof.sources.map(s => [s.title, s.url]) : [],
    };
    if (reviewedCaption) { d.sen = row.scene.en; d.sja = row.scene.ja; d.sha = row.image.sha256; }
    else if (capState >= 2 && row.description?.detail) d.capNote = String(row.description.detail);
    for (const k of Object.keys(d)) if (d[k] === '' || (Array.isArray(d[k]) && !d[k].length)) delete d[k];
    const shard = shardOf(row.w);
    (details[shard] ||= {})[row.id] = d;

    searchText.push([
      [...(row.tags ? [].concat(row.tags) : []), ...(d.tags || [])].join(' '),
      reviewedCaption ? row.scene.en + ' ' + row.scene.ja : '',
    ].join('\t'));
  }

  /* ---------- 祖先(語根)とワイルド ---------- */
  const descendantCount = new Map();
  for (const w of words) for (const p of w.p || []) descendantCount.set(p, (descendantCount.get(p) || 0) + 1);
  const rootLabelKind = { latin_lemma: 'ラテン語', greek_lemma: 'ギリシャ語', germanic_lemma: 'ゲルマン語', germanic_sound_symbolism: 'ゲルマン語の擬音', legacy_alias: '旧参照', pie_formative: '語形成の部品', unverified_reconstruction: '由来未確定' };
  const ROOTS = ROOT_KEYS.map(key => {
    const r = rootByKey.get(key) || { key, pie: key, ja: '', en: '' };
    const c = charByRoot.get(key) || null;
    const out = {
      key, pie: nfc(r.display_form || r.pie || key), ja: r.ja || '', en: r.en || '',
      d: r.d || r.def || '', kind: r.kind || '', kindJa: rootLabelKind[r.kind] || '',
      lang: r.origin_language || '', alias: r.alias_target || '', rank: r.rank || null,
      all: descendantCount.get(key) || 0, color: (c && c.color) || r.color || '',
      src: r.definition_reviewed ? (r.definition_source || '') : '',
    };
    if (c) out.c = { name: c.name, nameEn: c.nameEn, file: c.file, latest: c.latest, rep: c.rep };
    for (const k of Object.keys(out)) if (out[k] === '' || out[k] === null) delete out[k];
    return out;
  });

  /* ---------- 書き出し ---------- */
  // 公開する語が1つも無い分類(画像確認用など)は出さない
  const used = new Set(index.flatMap(r => r[7]));
  const categories = D.categories.map(c => ({ id: c.id, ja: c.ja, en: c.en, icon: c.icon,
    subs: c.subs.filter(s => used.has(subIndex.get(c.id + '/' + s.id))).map(s => ({ id: s.id, ja: s.ja, en: s.en })) })).filter(c => c.subs.length);
  for (const c of categories) if (!index.some(r => r[0] === c.icon && r[7].some(i => SUBS[i].startsWith(c.id + '/')))) c.icon = (index.find(r => r[7].some(i => SUBS[i].startsWith(c.id + '/'))) || [])[0];
  const meta = {
    schema: 1, builtFrom: {
      words_sha256: manifest.files?.words?.sha256 || sha256(fs.readFileSync(path.join(GEN, 'words.json'))),
      pictlingo_words_sha256: generated.sources?.words_sha256 || '',
    },
    counts: { words: index.length, characters: charByRoot.size, roots: ROOTS.length, master: words.length },
  };
  const files = {};
  files['index.js'] = envelope('WILD_ENCY_INDEX', { ...meta, subs: SUBS, categories, fams: FAMS, langs: LANGS, roots: ROOTS, words: index });
  files['search.js'] = envelope('WILD_ENCY_SEARCH', { schema: 1, rows: searchText });
  for (const [s, obj] of Object.entries(details)) files['detail-' + s + '.js'] = envelope('WILD_ENCY_DETAIL_' + s, { schema: 1, words: obj });

  report.counts = meta.counts; report.skipped = skipped;
  report.withCharacter = index.filter(r => r[8].some(i => ROOTS[i].c)).length;
  report.noRoot = index.filter(r => !r[8].length).length;
  report.levels = index.filter(r => r[9]).length;
  report.captions = index.filter(r => r[12] === 1).length;
  if (CHECK) { console.log(JSON.stringify(report, null, 1)); return; }
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/^(index|search|detail-[a-z_]+)\.js$/.test(f) && !files[f]) fs.unlinkSync(path.join(OUT, f));
  const sizes = {};
  for (const [name, text] of Object.entries(files)) { fs.writeFileSync(path.join(OUT, name), text); sizes[name] = text.length; }
  report.bytes = Object.values(sizes).reduce((a, b) => a + b, 0);
  report.indexBytes = sizes['index.js'];
  fs.writeFileSync(path.join(OUT, 'build-report.json'), JSON.stringify(report, null, 1) + '\n');
  console.log(JSON.stringify(report, null, 1));
}

/* app/eigo-no-e/app.js の semanticFallback と同じ規則 */
function semanticFallback(data, generated) {
  const protectedKeys = new Set((generated.semanticClassifications?.entries || []).map(e => JSON.stringify([e.w, e.p, e.art])));
  const words = data.words.map(row => {
    if (!protectedKeys.has(JSON.stringify([row.w, row.p, row.art]))) return row;
    const next = { ...row, c: ['more/words'], semanticUnavailable: true };
    for (const k of ['semanticTags', 'semanticDistinction', 'semanticCanonical', 'baseCategories']) delete next[k];
    return next;
  });
  const categories = data.categories.map(c => {
    const subs = c.subs.map(s => ({ ...s, n: words.filter(w => w.c.includes(c.id + '/' + s.id)).length })).filter(s => s.n);
    const members = words.filter(w => w.c.some(k => k.startsWith(c.id + '/')));
    return { ...c, subs, icon: members.some(w => w.id === c.icon) ? c.icon : members[0]?.id };
  }).filter(c => c.subs.length);
  return { ...data, words, categories };
}

function shardOf(w) { const c = String(w).normalize('NFD')[0].toLowerCase(); return /[a-z]/.test(c) ? c : '_'; }
function envelope(name, data) {
  const json = Buffer.from(JSON.stringify(data), 'utf8');
  const gz = zlib.gzipSync(json, { level: 9 });
  return '/* Generated by app/support/wild-wordopia-encyclopedia/build-data.cjs. Do not edit. */\n'
    + 'window.' + name + '=' + JSON.stringify({ schema: 1, encoding: 'gzip-base64', sha256: sha256(json), data: gz.toString('base64') }) + ';\n';
}

main().catch(e => { console.error(e); process.exit(1); });
