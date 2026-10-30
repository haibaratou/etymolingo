# Etymopedia data and difficulty display

入口は `app/etymopedia.html`。既存の12語根・掲載語・画像選択を保ち、語義・英語言い換え・品詞・語源メモ・語派・発音を公開正本と照合する。語根説明は同じ語根キーの `definition_reviewed: true` の `d` 全文を使う。正本の空欄を生成文で埋めない。

- HTTP(S): `app/data/generated-etymon/words.json` と `roots.json` を直接読む。発音は開いた語の現在の辞書インデックスと綴りを確認して `det/*.json` から読む。
- `file://`: `current-data.js` の圧縮された掲載語投影を読む。画像や画像選択データは含めない。元の埋め込みCSVは掲載順・構造の互換用で、照合できたテキストは公開正本の値を使う。
- 識別子は綴りと完全な語根配列。第一語義が異なる場合は保留する。ただし、同じページの別掲載行で同じ識別子・正本の第一語義が独立に確認できる場合は、表記差を揃える。未一致・重複・意味不一致は最低レベル扱いせず未分類にする。
- 語源構成が変わった語を綴りだけで接続しない。`kappa`（旧雨合羽／現在ギリシャ文字）と `merlin`（旧魔法使い／現在鳥）は自動更新保留。保留は画面と難易度説明に表示する。

難易度は `shared/explorer-difficulty-v2.js` の既存 `makeIndex/evaluate` を利用する。Weblio 1〜30を独自1〜10へ対応させ、CEFR-J、加工rの順に補う。語義データ・数値・算出方法・並び順を変更しない。表示だけ `level / 2` とし、レベル1＝半星、レベル10＝5つ星。タップすると根拠を開き、発音や親要素への移動は起こさない。色は共有の既存パレットを使う。

共有スクリプトの `data-api-only="true"` はAPIだけを公開し、vocabulary-master向けUIを起動しない。通常の読み込み動作は変わらない。

辞書取り込み後の直接ファイル用データ更新:

```sh
node app/support/etymopedia/build-data.cjs
node app/support/etymopedia/build-data.cjs --check
```

この限定ビルドは公開JSON・現在の掲載用CSV・既存埋め込みCSVを読み、`current-data.js` と入口の依存ファイルのハッシュ付きURLだけを更新する。入力が途中で変わると中止する。`--check` は書き込まない。画像、保存状態、公開正本、`app/data/pie/`、共有の生成処理には触れない。HTTP側の正本更新だけでは、直接ファイル用の投影は更新されないため、取り込み後に必ず上記を実行する。

検証:

```sh
node --test app/support/etymopedia/learning-levels.test.cjs app/support/etymopedia/runtime.test.cjs app/support/vocabulary-master/test-rarity-ui.cjs
```

`runtime.test.cjs` は既存 `tests/explorer-dom/node_modules/linkedom` を使うブラウザーなしのDOM検証。実画面のレイアウト・フォント・半星の実ピクセル確認とは区別する。今回 `file://` のブラウザー観察はURLポリシーで拒否され、回避経路は使用していない。保存領域は `file://` とHTTP(S)で異なる。既存の保存キーや選択を移行・削除しない。
