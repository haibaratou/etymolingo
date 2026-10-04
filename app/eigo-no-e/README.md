# えいごのえ — 英単語のイラスト辞典

正式な編集先は `app/eigo-no-e.html` と、この `app/eigo-no-e/` フォルダーです。
Claude 版のレイアウト、配色、書体、カテゴリー型ナビゲーションを維持しています。
`app/illustration-dictionary.html` は比較用の旧サンプルです。

## 起動と検査

公開用 `haibaratou/etymolingo` リポジトリのルートで実行します。

```sh
python3 -m pip install -r app/eigo-no-e/requirements.txt
python3 app/eigo-no-e/build.py
python3 app/eigo-no-e/build.py --check
python3 app/eigo-no-e/test_build.py
node --test app/eigo-no-e/catalog-validation.test.cjs app/eigo-no-e/search.test.cjs
node --check app/eigo-no-e/app.js
python3 -m http.server 8000
```

ブラウザー: `http://localhost:8000/app/eigo-no-e.html`
モバイル CSS 確認用: `http://localhost:8000/app/eigo-no-e.html?preview=mobile`
確認用 URL は同じページを390×844の iframeに表示します。通常の画面には追加のボタンや装飾は出ません。実機テストの代わりではありません。
現在の正本データを再照合するため、`file://` ではなく HTTP/HTTPSで開きます。

## 再生成の入力と出力

入力は公開リポジトリ内だけで完結します。私用リポジトリやクラウド作業フォルダーは不要です。

- `app/data/generated-etymon/words.json`: 正本の語義・品詞・読み・順位
- `app/data/generated-etymon/illustration-scenes.json`: 確認済みの短い日英イラスト説明
- `assets/word/illustration-index.js`: 同形異義語などの画像対応表
- 説明レコードが明示する `assets/word/*.png`: 対応する原寸画像
- `categories.py`: 従来のカテゴリーと所属語

出力:

- `data.js`: 説明のある項目だけの公開カタログ
- `thumbs/<art>.<PNG SHA256先頭12文字>.webp`: 元画像と結びついた320pxサムネイル
- `build-manifest.json`: 入力ハッシュ、採用・除外件数と理由、各原画像とサムネイルのハッシュ
- `../eigo-no-e.html`: `data.js` の読み込みクエリだけを内容ハッシュで更新

PNG、正本の語義、語根、タグ、旧サムネイルは書き換えません。
生成物を更新するときは `data.js`、`build-manifest.json`、入口HTML、新しいサムネイルを同じコミットで公開してください。サムネイルのない中間状態を公開しないでください。
`--check` は書き込まず、最新入力から同じ生成物が再現されるかを検査します。

## 採用条件

母集団は古いカテゴリー一覧ではなく、最新のイラスト説明台帳です。
次のすべてを満たす項目だけを掲載します。

1. 公開状態と編集レビュー状態がともに `reviewed`
2. 見出し語そのものを含む短い英語の説明がある。最大18語、最低語数なし。短い句も可
3. 日本語の説明もあり、見出し語だけ・`This is X`だけの文ではない
4. `(見出し語, 語根配列, 絵ID)` が一致し、正本の第一義と説明の語義が一致
5. 正本のPNG実体が説明レコードのSHA256とGit blob SHAの両方に一致
6. 例外的な画像対応表がある場合、その画像名も一致

WordNet の定義や類義語は説明文の代わりに使いません。
従来の `wordnet-notes.json`、`JA_OVERRIDE`、`JA_KANA` は今回の生成処理から参照しません。正本と絵が合わないときは表示用の和訳を作って救済せず、除外して正本側の確認に戻します。
語源は読み込んだ正本から公開カタログへ移さず、画面にも表示しません。

従来のカテゴリーに属さない有効な項目も捨てません。「いろいろなことば」に残し、検索と一覧から開けるようにしています。空になったカテゴリーだけを画面から省きます。`categories.py` に所属語を追加して再生成すれば分類を育てられます。

## 表示時の検査

`catalog-validation.js` は公開中の場面文と画像対応表でカタログを再照合します。
公開マニフェストの正本ハッシュが生成時と同じなら検査済みの抜粋を使い、異なれば最新の `words.json` を取得して第一義を再照合します。大きい辞書を毎回取得する必要はありません。
画像や第一義が変わった項目、未確認になった項目は除外します。
詳細を開くと、共有の `app/shared/illustration-scenes.js` が実際に配信されたPNGをSHA256照合し、一致してから説明を出します。
新しく説明が追加された項目を取り込むには、上のビルドを再実行します。

## 検索

- 単語: 見出し語・正本の第一義・対応する読み
- 文章: 確認済みの日英イラスト説明、見出し語、カテゴリー名によるキーワード照合

機械学習による意味検索ではありません。元の軽い検索UIを保ちながら、定義文だけの項目は結果から除きます。

## Codexで続けるとき

まずこのREADMEと `build-manifest.json` を確認してください。見た目の調整は主に `style.css` と `app.js`、分類の追加は `categories.py`、データの採用条件は `build.py` と `catalog-validation.js` に分かれています。
文や絵の意味を変更する作業は、このサイトの表示用データを手書きするのではなく正本の編集・レビュー経路で行います。
