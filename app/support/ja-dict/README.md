# 日本語辞典をローカルで開く

開く入口は `app/japanese-dictionary.html`。エクスプローラーから直接開ける。
ブラウザーのセキュリティ設定の変更やサーバー起動は不要。

- HTTP(S): 従来どおり `app/data/ja/ja_index.json` と `ja_det/*.json` を読む。
- `file://`: `app/data/ja/file/manifest.js` と必要な classic script だけを読む。
  本文は五十音行ごとに遅延読み込みする。
- 画像は英語辞典と共通の `../assets/word/` を参照する。ローカルでは同じPNGを使い、公開ビルドでは既存のPages画像ルーターが配信先へ変換する。画像の複製は不要。Webフォントは従来の外部URLのため、ネット未接続では代替フォントになる場合がある。

## JSONを更新したとき

正本は既存の `ja_index.json` と `ja_det/*.json`。この閲覧対応では辞書内容・取得・監査を変更しない。
この配信先チェックアウトには、母艦用 `app/build_ja_dict.py` は存在しない。
母艦から閲覧用JSONを受け取った後、リポジトリのルートで実行する。

```powershell
python app/support/ja-dict/build_local_data.py
python app/support/ja-dict/build_local_data.py --check
```

Python標準ライブラリーだけを使う。コマンドは別ディレクトリからも実行できる。
別の入力・出力で試す場合は `--data <jaディレクトリ> --output <出力先>` を指定する。
`--check` は入力と生成結果の一致を検査するだけで、書き込まない。

生成先は共通データ配下の `app/data/ja/file/`。原文JSONをJSON文字列として保持し、
`JSON.parse()` で復元するため、語義・出典・配列順・空欄を変えない。
ファイル名に原文のSHA256を含め、最後にmanifestを一時ファイルから置換する。
既存のハードリンクは直接上書きしない。古いmanifestを持つタブのため、旧世代ファイルは自動削除しない。

JSONを手動で更新した場合は上記の再生成が必要。`file://` ではJSON自体を読めないため、
閲覧中に元JSONの更新を検知することはできない。再生成後にHTMLを開き直す。
公開用 `tools/build_pages.py` はステージング先のJSONから自動生成するので、公開ビルドは更新に追随する。
HTML・`data-loader.js`・JSON・生成された `file/` を一緒に保持する。

## 検証

```powershell
python app/support/ja-dict/test_local_data.py
node --test app/support/ja-dict/data-loader.test.cjs app/support/ja-dict/image-references.test.cjs
python app/support/ja-dict/build_local_data.py --check
```

JS単体テストは、隔離したDOMモデルで直接起動時の読み込み、HTTP、欠落と再試行、
複数項目・同時読み込みを検証する。実ブラウザーの `file://` 確認とは区別する。
生成ファイル全件の原文との同一性もJS側で検証する。
