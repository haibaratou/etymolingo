# キャラクター管理

入口は [app/character-manager.html](../../character-manager.html) の1つ。正式画像・参考デザイン・制作メモと、過去の全バージョンの履歴をタブで切り替える。各候補から同じ一族の反対側のタブへ移動できる。検索・絞込・比較チェック・入力中のメモ・表示位置はタブ切替で保持する。

旧 app/compare.html と app/wildwordopia-history.html は不要。管理画面はそれらを読み込まず、iframeや別の独立HTMLにも依存しない。必要な画面断片・スクリプト・CSSをsupportから同じ文書へ初期化する。新しいcmd/bat/ps1ランチャーは追加しない。

保存キーと採用判定、メモの復元・書き出しの処理は維持する。保存データの消去・自動結合は行わない。ただし file:// の保存領域はブラウザーによってファイルURLごとに分かれ得るため、新しいファイル名から旧ファイルURLの状態を読める保証はない。HTTPでは同じブラウザー・originの保存キーを使用する。file://、別ポート、別ホスト名への切替でも保存領域は異なり得る。旧URLの保存領域そのものは変更・削除していない。

## APIを使う機能

HTMLを直接開くと、比較と全履歴の索引・画像を閲覧できる。プロンプト・造形設定などの詳細取得、履歴の再取得、エクスプローラーで保存場所を選択する機能には既存の8964番ローカル履歴APIが必要。APIがなくても索引の全メタデータを詳細欄で確認できる。APIのための新しい起動ファイルは作らない。

既存サーバーのHTTP入口は http://127.0.0.1:8964/character-manager.html 。旧HTTPパスはサーバー側の転送として受けるが、旧HTMLファイルは作らない。既存プロセスは停止・再起動していない。

## 更新

既存の制作側比較HTMLを取り込む限定処理：

~~~powershell
python app/support/character-manager/build.py --comparison work/wildwordopia/sample/exploration-20261014/compare.html
~~~

画像・辞書・履歴を生成する処理ではない。元HTMLから文書タグを除いて画面断片を取り出し、CSSとJSを同じ文書用モジュールに分離する。候補の本文や元の画像を変更しない。元HTMLの構造が想定外なら停止する。旧2HTMLは再作成しない。

production/publish_review_ui.py の比較出力も install_comparison() を呼ぶ。ユーザーが移動した app/wildwordopia.html が存在しない現状では、広範囲な公開用生成処理は最初に停止する。この統合のために公開用生成処理を実行しない。履歴の元データの出力先 app/support/wildwordopia-history/wildwordopia-history-data.js は変更しない。

履歴の表示断片は history-template.html、CSSは history.css。断片を変更した場合は引数なしで build.py を実行する。独立したHTML入口は出力しない。

## 検証

~~~powershell
node app/support/character-manager/test_manager.cjs
~~~

メモリー上のDOMモデルで、単一文書のモジュール初期化、タブ・一族の移動、履歴の検索・絞込・比較チェック・ページ送り・詳細のオフライン表示、スコープ付きDOM参照、旧HTMLと追加ランチャーの不在、全ローカル依存の存在を確認する。ブラウザー描画・画像読込・file:// の保存実装・稼働APIを確認するテストではない。利用者の実データで採用・メモ・削除の操作を試験しない。

統合時の一致確認：比較669候補・214語根、参考リンク3,844件（697種類）。全履歴2,304件・216語根（候補1,388件、途中版916件）。履歴の日付あり記録は2026-10-09〜2026-10-21、日付なし17件。genu1 と未登録試作も保持する。比較の全article本文と画像・リンク参照、履歴データのバイトハッシュは統合前と一致。

編集前記録は work/character-manager-20261028/。この実行環境ではブラウザーのfile URLがURLポリシーで拒否され、8964番APIの読み取りもソケット権限で拒否された。迂回・再試行を行っておらず、実ブラウザーと稼働APIの確認は残る。
