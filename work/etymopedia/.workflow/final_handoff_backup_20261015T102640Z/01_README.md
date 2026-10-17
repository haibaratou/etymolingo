# エティモペディアのイラスト制作

## 現行の入口と唯一の生成・解説CSV（v12 / 2026-10-15）

正式生成リストと英日解説の記入先は、同じ **[ready_union_scopes_20261015.csv](../../../dot-image-review/ready_union_scopes_20261015.csv)**：

`D:\Projects\dot-image-review\ready_union_scopes_20261015.csv`

確認時2093行。これは生成対象の部分集合であり、全PNGの一覧ではない。scope別・batch別・dot-staging・old配下のCSVを並行した正式入力にしない。別結果 `works_illustration_results.csv` は使わない。

- 既存実体は英語列名の統合CSV。`workflow_io.py` と現在の候補プレビューは、日本語19列形式と英語列名の両方を読む。19列へ一括変換・差し替えはしない。
- Worksはこの同じCSVの `解説英語`・`解説日本語`・`実行プロンプト`・`制作状態`・`画像SHA256`・`画像GitBlobSHA`・`検品日時`・`検品メモ` と、`画像保存先`・`検品方法` 等へ記録する。不足する制作列だけ末尾へ追加し、全既存値・未知列・行順を保持する。入力語義は現行正本 `D:\Projects\etymon-source\app\data\pie\words.json` の `(w, 順序付きp)` を安定した語義キーとして第一語義と照合し、食い違いを勝手に直さず該当行だけ保留する。
- 正確な対応キーは `(単語, 順序付き語根ID配列, ファイル名)`。英語列では `word, roots, filename`。`roots` の順序を変えない。既存 `identity` も保持する。
- 同一CSVは行が違っても同時保存しない。dotの追記期間、Worksの生成・解説記入期間、importerの取込期間を排他的に交代する。既存Worksの保存境界・担当解除を確認するまで新しい所有権を取らない。ownerファイルが無いことだけで既存非対応プロセスが停止したと判断しない。
- `workflow_io.py inspect` は読み取り確認。書込には `begin --owner dot|works|importer --expected-sha256 <現在のSHA256>` のtokenを使う。`record --token <token> --identity <既存identityまたは行キーJSON> --values <JSONファイル>` はWorks用、`append` はdot用、完了後 `end --token <token>`。外部変更を検知したら上書きせず停止する。ownerの強制解除・既存プロセス停止はしない。

画像は [_illust](./_illust/README.md) に保存する。Worksが完成画像を見て解説を記入した後、**ユーザー検品 → ユーザー自身によるコピー → 実SHA256一致行の解説採用**の順に進める。AIによる正式PNGの自動反映は禁止。

`_illust/copy_newer_pngs.cmd` はSRC/DSTの2パスだけを現在の `D:\Projects\etymolingo` に修正済み。元CMDは `.workflow/v12_backup_*/manifest.json` から復元可能。コピー範囲・時刻判定・同名優先順は変更していない。AIは実行しない。

旧 `png_creation_dates.csv` は現行コードの入力ではない。名前だけの日付表・mtime・Git初回追加・過去catalogの値を現在PNGの生成日としない。任意の `image_content_evidence.json` に独立した根拠と現在PNGのSHA256が一致する場合のみ日付を採用し、証拠なしは不明にする。旧表自体は削除していない。

実装・fixture検証と実運用の切替は別。正式CSVの移行・制作列追記・新しい所有権取得・実画像生成・正式PNGコピー・本番解説取り込み・公開書き出しは、この整備作業では実施していない。Worksの現行作業を外部から引き継いだとみなさない。

詳しい仕様・解説品質・検品・取り込みは [WORKFLOW.md](WORKFLOW.md)。画風参照は [invidious.png](etymopedia_sample/references/invidious.png) の1枚。旧担当別資料は `old/` の履歴であり、新規生成入力ではない。
