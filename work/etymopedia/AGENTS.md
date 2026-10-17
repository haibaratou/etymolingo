# このフォルダーを渡されたWorksへの入口

最初に [README.md](README.md)、次に [WORKFLOW.md](WORKFLOW.md) を読む。
正式生成CSV・英日解説保存先は `D:\Projects\dot-image-review\ready_union_scopes_20261015.csv` の1本。
`generation_eligible=True` かつ `制作状態=prompt_ready` の行だけを生成する。Falseは理由付き保留であり生成しない。
同じCSVの別結果ファイル作成・並行保存・owner強制解除は禁止。担当はWorksへ割当済み、dotは引渡し後編集しない。
完成PNGは `_illust` にCSV指定名で保存し、実画像を開いて英日解説と実PNGhashを同じCSV行へ記録する。
ユーザー検品後、ユーザー自身が `_illust/copy_newer_pngs.cmd` を実行する。AIはCMDを実行せず正式PNGへ自動反映しない。
コピー前に正式画像の解説を上書きしない。コピー後の正式PNGと検品PNGのhashが一致した解説だけ取り込み候補とする。
原本語義・原本解説・既存制作記録・ユーザー生成PNGを勝手に変更しない。commit/pushをしない。
