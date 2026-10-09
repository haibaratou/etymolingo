# エティモペディア：語源クリーチャー版の引継ぎ

2026-10-10。対象は `app/etymopedia.html`。かわいい図鑑の方向から、奇妙な語源キャラを大きく見せる方向へ更新した。

## 変更範囲

- `etymopedia.html` は字体、追加CSS/JS、既存のロード・ホーム描画・語根描画への3つの呼出しのみ変更。
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

検索、単語・語根・未登録概念・語派のハッシュ遷移、語根から単語への放射状マップ、発音、例文、語源メモ、レア度、参加手順、♥の保存を維持。

`../assets/word/illustration-index.js` と既存 `topArt()` の単語主図版照合は変更していない。綴りと語根集合による絵の選択、投稿図版、共有お絵かき保存を維持。`ROOTS.concept` / `CONCEPTS.icon` の古代概念印章も元のまま。

## 開き方と確認

通常はリポジトリ全体をHTTP配信し、`/app/etymopedia.html` を開く。例：リポジトリルートで `python -m http.server 8765 --bind 127.0.0.1` を起動し、`http://127.0.0.1:8765/app/etymopedia.html` へアクセス。HTTP時は既存の `app/data/*.csv` が優先される。

ファイルを直接開く場合は従来の埋込CSVフォールバックを利用する。追加CSS/JSと `../assets/` は外部ファイルなので、HTML単独を移動せずフォルダ構成を保持する。既存の巨大な埋込画像・CSVは今回変更していない。

変更後はPCと360〜390pxの幅で、ホーム、検索から単語詳細、祖先詳細、語派、未登録概念、戻る操作、♥保存、画像読込を確認する。ゲームボタンは引き続き「開発中」の通知であり、ゲームへの入口が完成した状態ではない。
