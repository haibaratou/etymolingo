# えいごのえ(試作)— 英単語のイラスト辞典

入口: `app/eigo-no-e.html`(`app/index.html` からはまだリンクしていない試作)

## 動かす
リポジトリ直下で `python -m http.server 8000` → `http://localhost:8000/app/eigo-no-e.html`
(file:// で直接開いても動く。PNGダウンロードだけは http のときに効く)

## カテゴリーを直す
`categories.py` を編集して `python3 app/eigo-no-e/build.py` を実行する。
- 大カテゴリー → 小カテゴリー → 英単語(空白区切り)。同じ語を複数の小カテゴリーに入れてよい
- 同じつづりで絵が複数あるときは `see@sekw2` のように絵IDで書く
- 絵が無い語は自動で外れる(実行時に一覧が出る)
- 辞書の第一義が絵と合わないときは `JA_OVERRIDE` で表示用の訳を差し替える

## 検索
- 単語でさがす: 英単語のつづり(前方一致)か、日本語の訳
- 文章でさがす(あいまい検索): 日本語は助詞で区切って訳・場面文・カテゴリー名と照合。
  英語は単語に分けて、つづり・類義語・英語の説明(`wordnet-notes.json`)と照合
- `wordnet-notes.json` は WordNet 3.0 から作った英語の説明と類義語(全9,412語ぶん)

## 出力
`data.js`(window.EIGO_NO_E)と `thumbs/*.webp`(320px)
