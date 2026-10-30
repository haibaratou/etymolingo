# Wild Wordopia 図鑑(統合公開サイト)

入口: `app/wild-wordopia-encyclopedia.html`

英単語のイラスト辞典(Pictlingo Dictionary)と、語彙マスターデータベースの語源・祖先を
一つにした公開用サイト。祖先(語根)＝ワイルド(キャラクター)として、すべての単語を祖先にひも付ける。

## 何をどこから表示しているか

| 表示 | 出どころ |
|---|---|
| イラスト・サムネイル・英日のイラスト解説・カテゴリー・パズル可否 | `app/eigo-no-e/data.js` を Pictlingo Dictionary と同じ手順(`catalog-validation.js`)で現行データと照合したもの |
| 語義・品詞・カナ発音・レア度 r・語源ひとことメモ(b)・語源組み立て・語源系統・起源言語・接頭辞/接尾辞・祖先(p) | 語彙マスター(`app/data/generated-etymon/words.json` ほか。語彙マスターデータベースと同じ結び付け) |
| 品詞別の語義・語形・動詞の活用・米音IPA・難易度(独自学習レベル) | Pictlingo Dictionary と同じ付帯データ(`dictionary-basics` `lexical-profiles` `verb-inflections` `us-pronunciations` `custom-learning-levels`) |
| 祖先の意味・祖先メモ | `roots.json` の `ja` `en` `d` |
| ワイルドの名前と絵 | `assets/chara/brainrot/library/` の採用画像。キャラクター管理の最新画像(`latest-site-images.js`)があればそちらを先に使い、読めなければ採用画像に戻る |

- 載せるのは、画像の対応が確認済み(`bound`)で、語彙マスターに同じ語(綴り・祖先・語源ID)がある語だけ。
- 語義・語源を新しく作る処理はない。マスターに無い値は出さない。
- 母艦の `det/` `eo/`(買った辞書・etymonline の本文)は読まない。etymonline へはリンクだけ。
- イラスト解説は、http で開いたとき画像の SHA-256 を確かめてから出す(Pictlingo Dictionary と同じ)。
- 難易度は独自学習レベル 1〜10 を ★5つ・半分刻みで表示(レベル7 → ★3.5)。レア度 r は別の指標として名前だけ出す。
- 祖先のキャラがまだ無い語根は「未発見のワイルド」として黒い影で出す。祖先が未登録の語も影で出す。

## データを作り直す

公開データ(語彙マスターの生成物・Pictlingo のカタログ・キャラ画像)を更新したら:

```sh
node app/support/wild-wordopia-encyclopedia/build-data.cjs          # 書き出し
node app/support/wild-wordopia-encyclopedia/build-data.cjs --check  # 件数の確認だけ
```

出力は `data/` (生成物。手で直さない):

- `index.js` 全語の一覧・祖先・カテゴリー(起動時に読む。約1.4MB)
- `detail-<頭文字>.js` 単語ページの詳細(開いた語の頭文字ぶんだけ読む)
- `search.js` あいまい検索用のタグと解説文(あいまい検索のときだけ読む)
- `build-report.json` 件数と、結び付けで外れたもの

どれも gzip+base64 の script なので、`file://` で開いても動く。

## ゲームへの導線

`app.js` の `GAME`(現在 `pictlingo-game.html`)が入口。単語ページの「この単語でパズル」は
Pictlingo Dictionary と同じ `pictlingo-game.html?word=<id>&lang=en`。ストアのURLができたら `GAME` を差し替える。
