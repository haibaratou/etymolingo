# etymopedia 引継ぎ（2026-11-03）

## 状態を混同しないこと

- リポジトリ：haibaratou/etymolingo。引継ぎ直前の main は `a4713b8b333e0d0c4a809c73e0f58873f6ab061b`。
- 対象：`app/etymopedia.html`。ユーザーは `file:///D:/Projects/etymolingo/app/etymopedia.html` を開いている。
- **GitHub への保存は済んでいるが、画面デザインはユーザーの承認・受容を得ておらず未完成。** 現行版は共通の横幹から順に枝が出る方式で、時系列のように見えると指摘された。これを完成版として引き継がない。
- ユーザーPC上のファイル、未コミット差分、ブラウザ表示は直接操作・検証していない。最初にローカルの `git status` と差分を確認し、上書きや reset をしない。以前 `tests/explorer-dom/startup.test.cjs` の pull 競合が報告されたが、現在も残っているかは未確認。
- リポジトリは非公開、GitHub Pages は無効。公開・可視性設定を変更しない。最新 CI `41567416658` は failure。原因は未確定。https://github.com/haibaratou/etymolingo/actions/runs/41567416658

## ユーザーの最終要件

1. どの語根ページも最低6語・6本。表示語義、語源の同一性、対応画像を守る。別語源の同綴り語で穴埋めしない。
2. 同じ起源言語の単語は、一つの丸い起源言語アイコンを共有する。
3. **そのアイコンから各単語へ独立した自然な曲線で直接つなぐ。共通の長い幹から順番に分岐する表示は禁止。単語同士が時系列で派生したように見せない。**
4. キャラの中央固定は禁止。言語の種類・語数・画面幅から、キャラ、言語アイコン、単語、曲線を一緒に配置する汎用アルゴリズムが必要。
5. 全語がラテン語なら、キャラを左に置き、その右のラテン語アイコンから右側の6語へ自然に展開するのがユーザーの具体例。ただし、この例だけの条件分岐では足りない。
6. 無駄に高くしない。単に左右へ3語ずつ縦積みにする固定配置も不評。以前の四隅＋左右に広がる曲線配置のほうが良かったという指摘がある。
7. 線は細すぎず、曲率・線幅・色を統一する。短距離の不自然なS字、急な曲がり、ループ、画像・文字への食い込みを避ける。
8. 起源言語アイコンは読める大きさにし、意味のまとまりで明示的に改行する。特に「古代／ギリシ／ャ」のような自動折返しを発生させない。
9. 起源言語と借用経路を混同しない。condition はラテン語由来で、古フランス語を経たことを別の起源材料として並べない。television のギリシャ語＋ラテン語のような本当の混成は複数を維持する。
10. 音声ボタンをこの図へ追加しない。画像生成・課金を行わない。私用の原典・出典・監査本文を公開用データへコピーしない。

## 現在の構成

- `app/etymopedia.html`：元の renderRoot / drawRootLines と大容量埋込画像を含む。
- `app/support/etymopedia/learning-levels.js`：難易度・正本照合の既存アダプター。末尾に root-map-layout.js を束ねている。bind 時にグローバル描画関数を差し替える現在の組込み方式。
- `app/support/etymopedia/root-map-layout.js`：現在はユーザーに否定された共通横幹方式。配置・曲線・注入CSSを含む。
- `app/support/etymopedia/root-map-examples.json`：12語根×6語。w / p / ja / en / pos による同一性ガードと表示言語。
- `app/support/etymopedia/root-map-notes.json`：図に出す語の補足説明。元の解説に足りない例を補う。正本の語根解説を更新した扱いにはしていない。
- `app/support/etymopedia/build-root-map.cjs`：上記設定・レイアウトから learning-levels.js の組込み部を再生成。
- `app/support/etymopedia/current-data.js`：画面用の検証付き圧縮スナップショット。開発用DBの最新語根本文と一致していない箇所がある。画面用起源言語の補正は master 全体の修正ではない。
- `app/support/etymopedia/build-data.cjs`：入力を明示して画面用スナップショットと HTML の参照版を更新する既存ツール。

`learning-levels.js` は更新したが、巨大な HTML の script URL の `?v=` は再生成していない。ブラウザキャッシュと build-data --check の両方を確認すること。この事実を CI 失敗の確定原因とはしていない。

## 再生成と回帰確認

リポジトリルートで実行する。入力元DBが意図した検証済み版であることを先に確認する。

```sh
node app/support/etymopedia/build-root-map.cjs
node app/support/etymopedia/build-data.cjs --input-dir app/data/generated-etymon
node app/support/etymopedia/build-data.cjs --check
node --test app/support/etymopedia/learning-levels.test.cjs app/support/etymopedia/runtime.test.cjs app/support/etymopedia/root-map-layout.test.cjs app/support/etymopedia/root-map-geometry.test.cjs
```

依存は既存 `tests/explorer-dom/node_modules/linkedom` を使用。環境の既存セットアップを確認する。

保存済み版については、19テスト、実データ12語根×6幅＝72ケース、言語数1〜6と混成語を含む39幾何ケースが合格した。しかし **この合格はデザインの正しさを保証せず、ユーザーは表示を否定した。** 「線の本数」「衝突なし」だけで完成判定しない。

## 添付の実験版（自動適用しない）

引継ぎZIP内の `experimental/direct-star-layout.js` は独立曲線を試す未保存の作業途中版。main に入っていない。

- 共通幹を廃止し、単語の矩形が起源アイコンから見て重ならない角度範囲を選ぶ方式を試している。
- 単語候補位置の組合せを動的計画法で選び、各辺を緩い二次曲線相当の三次 Bézier で直接接続する。
- 線幅、アイコンの大きさ、明示改行の修正を含むが、これらの値自体がユーザー承認済みという意味ではない。
- **既知の失敗：weid- の幅320pxで枝が5本。合成の1言語・幅320pxケースでは配置を作れない。** 回帰未合格で、完成版として適用してはいけない。
- 添付の `tests` は実験版を試した検査の写し。スタンドアロン用の相対パスは実行環境に合わせて調整する。
- ブラウザ実画面での目視はできていない。これまで送った配置図は座標計算をSVGへ描画したもの。実ブラウザの撮影ではない。

## 次の担当者がまず行うこと

1. ローカル現物と main の差分を確保し、実際の etymopedia を開く。
2. 横幹方式を土台に微調整するのではなく、独立辺という意味表現を守って配置を設計する。キャラ固定を外す。
3. 1言語6語、複数言語の偏り、混成語、長い言語名、短い接続、狭い幅を実表示で確認する。
4. 曲線の共有部分や順番が時系列を暗示しないこと、円内の改行、線幅、画像・語名の読みやすさを目視する。
5. 最終的な現在画像での確認後に保存し、確認した版・未確認部分を区別して報告する。

master 全体の起源言語整理（condition 等）や、正本語源修正の保存待ちは別に残っている。この引継ぎで完了扱いにしない。
