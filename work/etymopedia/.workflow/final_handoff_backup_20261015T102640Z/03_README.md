# 生成画像の確認入口

Worksの出力とユーザー検品の場所です。生成リストと英日解説の記入先は **`D:\Projects\dot-image-review\ready_union_scopes_20261015.csv` の同じ行**です（確認時2093行）。別結果CSVは作りません。

完成PNGを実際に見て、解説英語・解説日本語とこの実PNGのSHA256を記録します。ユーザーがここで検品し、ユーザー自身が [copy_newer_pngs.cmd](copy_newer_pngs.cmd) で正式assetsへ複製します。**AIはCMDを実行せず正式PNGへ自動反映しません。** コピー前に正式画像の解説を上書きせず、コピー後に正式PNGと検品PNGの実SHA256が一致する解説だけ採用します。

CMDのSRC/DSTは現在の `D:\Projects\etymolingo` に修正済み。サブフォルダーも対象、開始時のコピー先より新しい更新時刻を選び、後のフォルダーの同名ファイルが優先される判定は従来通りです。AIは未実行。

保存列・排他所有権・採用手順は [上位README](../README.md) と [WORKFLOW](../WORKFLOW.md) を先に読んでください。
