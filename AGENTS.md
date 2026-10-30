# Codex Handoff

> **まず `README-AIのための取扱説明書.md` を読むこと。**
> リポジトリの構成・push の道すじ・語源データベース(英語/日本語)の
> 作りかたと、やってはいけないことが全部そこにある。

This repository is the Wild Wordopia mobile HTML prototype.

Before making changes, read:

- `README-AIのための取扱説明書.md`
- `app/REVIEWED_PROTOTYPE_BUILD.md`（生成・更新・公開用ビルドに関係する場合）

`docs/CODEX_HANDOFF.md` は現在のチェックアウトに存在しない。旧参照に依存せず、上記の現行手順と以下のルールを使う。

Working rules:

- Do not ask the user for routine read, analysis, edit, or GitHub sync decisions.
- Prefer adding comparison HTML files under `app/` instead of replacing the main prototype.
- Keep work mobile-first.
- Commit useful handoff/prototype changes and create a PR through the Codex/GitHub integration so another PC can continue without chat history. Do not run `git push` from the sandbox when GitHub egress is blocked; direct push is expected to fail with proxy errors in cloud tasks.


## 全プロダクト共通の必須フォルダ構成

2026-10-28のユーザー指示。アプリとゲームを配置上区別しない。今後の新規作成・追加・再生成にも適用する。

- **すべての開く入口HTMLを `app/<slug>.html` に置く。`app` 直下が共通の入口フォルダ。** 辞典・制作ツール・パズル等も同じルール。`app/games/` や `app/products/` など種別ごとの入口フォルダを作らない。
- JS/CSS/JSON/CSV/画像パック/manifest/内部HTML/ビルダー/テスト/制作資料は **`app/support/<slug>/`** へ分離する。今回の実配置は `picture-words/`、`pictlingo-quest/`、`etymopedia/`、`wildwords/`、`wildwordopia-history/`。既存の共通補助manifestと内部 `puzzle.html` は `app/support/` にある。
- 共通コードは `app/shared/`、共通辞書・公開生成データは `app/data/`、共通素材は `assets/` を参照する。同じ辞書・画像・解説をプロダクトごとに無断複製しない。既存の辞典データを配置整理に混ぜて修正しない。
- 新規入口は補助ファイルを参照するHTMLにする。大容量データや裏方コードを入口へ詰め込んだpacked版を安易に作らない。既存HTMLの機能変更を配置整理に混ぜない。
- 静的ホストのService Worker制約による例外は `app/picture-words-sw.js` の薄いloader。実装は `app/support/picture-words-sw.js`。scopeは `app/pictlingo-game.html` のURLprefixに限定し、他の入口を巻き込まない。
- ランタイムだけでなく、生成・更新・export・画像処理・公開用コピー・テスト・手順書の参照と出力先を揃える。再生成で廃止した `app/games/` や中間 `app/game-support/` を復活させない。正規の生成手順は `app/REVIEWED_PROTOTYPE_BUILD.md` とsupport内のbuilder。日付付きworkパッチ・修復snapshotを再適用する際は現行構成との互換を確認する。
- **既存の動作・保存キー/記録・辞書/画像/解説/生成内容を変えない。** 配置とは別の意味修正や停止中の本番生成を行わない。既存生成物のハッシュ、fixture生成内容、ビルド、一時出力、内部遷移、manifest/SW/cacheを検証し、未検証の同一性を断言しない。
- 旧URL/PWAの互換に入口フォルダを復活させない。静的配置で旧URLを保てない場合は限界を報告し、保存データや旧cacheを削除しない。同originのHTTP(S)と `file://` の保存領域の違いも区別する。
- 移動前の対応表・ハッシュ・必要な編集前バックアップを記録する。NTFSハードリンクを直接上書きせず、一時ファイルから置換して共有先を保護する。保証できない移動は限定・停止し、他作業を上書きしない。

### 確定した入口名（2026-10-28）

- `app/vocabulary-master.html`、`app/japanese-dictionary.html`、`app/pictlingo-dictionary.html`、`app/pictlingo-game.html` が正式な入口名。リンク・更新対象・生成先・公開ビルド・PWA・モバイル生成・テストもこの名前に揃える。旧名のHTMLや転送コピー、別ランチャーを再作成しない。
- 共通ブランドはPictlingo。辞典サイトは「Pictlingo Dictionary」、ゲームは「Pictlingo Game」と表示し、両方ともapp直下に置く。補助フォルダ統合はこの改名の範囲に含めない。
- ファイル名は英字で用途が分かる名前を使い、日本語ファイル名にしない。補助フォルダのslugや既存の保存キー・cache名・辞書内容は入口改名に合わせて変更しない。URLはURL APIで扱い、同originの保存データを削除しない。

新規作成例（種別によらず同じ）:

```text
app/my-product.html
app/support/my-product/app.js
app/support/my-product/style.css
app/support/my-product/data/
```

Hard rules (also follow the current root README and the rules above):

- NEVER read or parse files under `app/data/pie/` (5-26MB JSON; doing so burns the whole token budget). Work lists live in `tools/*.csv`; regenerate with `python3 app/build_art_todo.py`.
- Do not confuse the two etymon datasets: `app/data/pie/` = 語源データベース (1,437 roots, the illustration target) vs `app/data/*.csv` = エティモペディア mock (only 8 roots). "All etymons already exist" based on the 8-root CSV is wrong.
- Image filenames: use the ファイル名 column of `tools/word-art-todo.csv` / `tools/root-art-todo.csv` verbatim. Never derive filenames from spellings yourself. Homograph senses use the `word@rootslug.png` form — never overwrite a shared `word.png` with a different sense.


## Wild Wordopia character art
For any Wild Wordopia character/art task, read work/wildwordopia/AGENTS.md and work/wildwordopia/STYLE_GUIDE.md first, and visually inspect the approved reference images listed there. Preserve the approved Nendoroid-like physical figure look across threads.
