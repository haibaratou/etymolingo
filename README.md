# エティモリンゴ：レキシコピア / エティモペディア

印欧語根(ことばの祖先)をテーマにした、辞典とゲームの公開サイト。

**https://haibaratou.github.io/haibaratou/app/index.html**

> このリポジトリはアカウント名と同じ名前のため、この README は
> GitHub のプロフィールページにも表示される。

## 公開しているもの

| | |
|---|---|
| [**エティモペディア**](app/etymopedia.html) | 共創型の英語語源辞典。語根キャラを中心に、そこから生まれた単語を放射状に見せる |
| [**単語データベース閲覧**](app/etymon-explorer.html) | 英単語 49,170語を語根・語義・レア度で引く。辞書の記述つき |
| [**エティモン・クエスト**](app/etymon-quest.html) | 語根キャラを連れて進む遠征 |
| [**エティモン・スラッシュ**](app/etymon-slash.html) | 文字ブロックをなぞって英単語を書く |
| [**ワードブロックバトル**](app/etymon-word-block-battle.html) | 単語を組んで戦う |
| [**ワードフォージ**](app/etymon-word-forge.html) | 語根と接辞から単語を鍛える |
| [**レキシコピア箱庭**](app/lexicopia-hakoniwa_IP360.html) | 語根キャラがうろつく箱庭 |
| [**ワードドロップ**](app/word-drop.html) / [**ワードスイカ**](app/word-suika.html) | 落ちもの |

入口は `app/index.html`。

## 中身の置きかた

```
app/
  *.html                    画面。1枚で動くよう、データは埋め込みも持つ
  data/
    *.csv                   エティモペディアと箱庭が読む文言・語のデータ
    generated-etymon/       語源データベースの実行用の写し
                            (母艦 etymon-source から書き出したもの)
    ja/                     日本語辞書の索引と本文
assets/
  chara/ word/ root-concept/    語根キャラ・単語の絵・概念の絵
  enemy/ player/ ground/ game/ ui/   ゲームの素材
```

**`app/data/generated-etymon/` と `assets/` は手で直さない。**
語源データは非公開の母艦 `etymon-source` が正本で、ここにあるのはその写し。
直したいことがあったら母艦のほうを直して書き出す。

置き場の役割・作りかた・やってはいけないことは
[`app/data/README-データの地図.md`](app/data/README-データの地図.md) と
[`README-AIのための取扱説明書.md`](README-AIのための取扱説明書.md) にある。

## 名前について

「エティモリンゴ：レキシコピア」が正式名称。
`Wild Wordopia` は古い開発名で、書庫や古いファイル名に残っている。
