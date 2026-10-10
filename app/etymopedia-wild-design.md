# エティモペディア：語源クリーチャー版の引継ぎ

2026-10-10。対象は比較ページ `app/etymopedia-wild.html`。かわいい図鑑の方向から、奇妙な語源キャラを大きく見せる方向を試す。元ページ `app/etymopedia.html` は元の内容を維持する。

## 変更範囲

- `etymopedia-wild.html` は元ページを基にした比較版。字体、追加CSS/JS、既存のロード・ホーム描画・語根描画への3つの呼出しを追加。
- `etymopedia.html` を上書きしない。追加CSS/JSと今回のキャラ素材は比較ページだけで利用する。
- `etymopedia-wild.css` が配色、文字、切抜きキャラ、カード、スマホ配置を担当。
- `etymopedia-wild.js` がホームを描画し、読み込まれた12語根のキャラ表示パスと表示用メタデータを差し替える。
- `../assets/chara/etymopedia-wild/characters.js` が語根IDと表示素材を対応付ける。`provenance.json` が素材の出典、レビュー時点の状態、コピー照合を記録する。

## 素材と12語根

素材は指定された `work/wildwordopia/sample/` とその `top100/` の制作候補から、表示用に複製した512×512の透過PNG。元候補、レビュー、採用状態は変更していない。全12画像は出典とコピーのSHA256が一致する。

| 画面の語根ID | 表示PNG | sampleからの相対出典 |
|---|---|---|
| kaput | root-kaput-v004.png | top100/root-kaput-v004.png |
| ane | root-ane-v002.png | root-ane-v002.png |
| bha | root-bha2-v009.png | top100/root-bha2-v009.png |
| gwei | root-gwei-v007.png | top100/root-gwei-v007.png |
| oino | root-oino-v006.png | top100/root-oino-v006.png |
| reg | root-reg-v003.png | root-reg-v003.png |
| weid | root-weid-v003.png | root-weid-v003.png |
| ye | root-ye-v001.png | root-ye-v001.png |
| mori | root-mori-v001.png | root-mori-v001.png |
| men | root-men1-v003.png | top100/root-men1-v003.png |
| do | root-do-v004.png | top100/root-do-v004.png |
| genu | root-genu1-v001.png | root-genu1-v001.png |

画面の12体は辞典モックの掲載語根であり、印欧祖語データベース全体の数ではない。候補キーと画面IDの差は `bha → bha2`、`men → men1`、`genu → root-genu1`。

表示名はこのプロジェクトの選定候補に付いている作業名。イタリアンブレインロットやサンリオなど既存作品のキャラクター名とは無関係で、公式連携や名称・キャラクターの引用を意味しない。表示素材への選定も、正式採用の確定を意味しない。

## 保全した機能

比較ページのホームは「姿は消えた。言葉は、生き残った。」を入口に、六千年前の野生、絶滅後に言葉へ残った遺伝子、ラテン語・ギリシャ語・英語へ枝分かれする血筋を伝える。実際の語源を物語の骨格にし、head と captain の祖先 *kaput- を具体例として示す。

単語ずかん・みんなの図版・お絵かき投稿・参加手順・検索窓・♥の操作は比較ページの画面から外した。既存の描画処理が参照するDOMは非表示で保持する。祖先を選んで語根・子孫の英単語へ進む導線、語派、放射状マップ、発音、例文、語源メモは維持。

`../assets/word/illustration-index.js` と既存 `topArt()` の単語主図版照合は変更していない。綴りと語根集合による絵の選択、投稿図版、共有お絵かき保存を維持。`ROOTS.concept` / `CONCEPTS.icon` の古代概念印章も元のまま。

## 開き方と確認

通常はリポジトリ全体をHTTP配信し、`/app/etymopedia-wild.html` を開く。例：リポジトリルートで `python -m http.server 8765 --bind 127.0.0.1` を起動し、`http://127.0.0.1:8765/app/etymopedia-wild.html` へアクセス。HTTP時は既存の `app/data/*.csv` が優先される。元ページとの比較は同じ配信元の `/app/etymopedia.html` で行う。

直接開く場合は `app/etymopedia-wild.html` を開き、従来の埋込CSVフォールバックを利用する。追加CSS/JSと `../assets/` は外部ファイルなので、比較HTML単独を移動せずフォルダ構成を保持する。元ページの巨大な埋込画像・CSVは変更しない。

変更後はPCと360〜390pxの幅で、ホームの世界観、物語と系譜へのページ内移動、祖先から子孫の英単語への移動、戻る操作、画像読込を確認する。投稿・参加・ゲーム開発中の案内は表示しない。元の etymopedia.html は変更しない。

## 2026-10-10 IPポータル追加
- ユーザーが生成背景を拒否したため、生成景観は採用せず追加生成も中止。提供されたキャラ画像と余白で構成。
- wildwords-world.html: 語源を奇妙な暮らしのルールにした3つの場所。首都のない首都、一人しか入れない遊園地、まだ考えている駅。各章から既存語根辞典へ移動。
- wildwords-shop.html: 3種類のアクリルキーホルダー企画。wildwords-product.html?character=kaput|oino|men が商品詳細。
- wildwords-ip.js/css は上記3ページとホームの追加導線を共用。価格880円と仕様は企画案。注文・決済は無効。商品画像は既存切抜き＋CSSによるモック、実物写真ではない。
- ホームの祖先検索は既存LEXICONの派生語、意味、キャラ名を検索して語根カードを絞り込む。新しい投稿・図版機能は追加しない。
- 制作者参考: https://www.awn.com/animationworld/time-some-adventure-pendleton-ward （背景の独立した物語、世界に通る論理）
- 検証: 1280pxと390px、ストア→商品→世界→辞書→ホーム、capital検索1体、該当なし0体、画像欠損と横幅超過なし。JS構文確認済み。
- 原本etymopedia.htmlのblobは50a9bb26bac81bbe25be3f4061264801c5f795ecのまま。
