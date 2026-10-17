# Worksへの最終引渡し（2026-10-15）

**生成リストと英日解説の記入先は同じ1本です。**

`D:\Projects\dot-image-review\ready_union_scopes_20261015.csv`

2552行。開始時の生成対象2439件、保留113件。**`generation_eligible=True` かつ `制作状態=prompt_ready` の行だけ**生成します。`False` の行、generated/reviewed/applied/needs_revision/errorの行は生成しません。保留理由は同じ行の `generation_hold_reason`。別のscope・batch・staging・oldのCSVを生成入力に併用しません。別結果CSVは作りません。

1. `python workflow_io.py inspect` で正式CSVと所有権を確認します。`candidates --limit 25` は未処理の生成対象を読み取り表示します。
2. 正式CSVに隣接する `ready_union_scopes_20261015.csv.owner.json` はWorksへ割当済みです。**同時に動かすWorksは1つだけ**。同ファイルのWorks tokenを `record --token ...` に使い、別ownerを取得・強制解除しません。dotは引渡し後この正式CSVを編集しません。
3. 出力は **`D:\Projects\etymolingo\work\etymopedia\_illust\<filename>`**。CSVのfilenameをそのまま使い、既存PNGは上書き・再生成の前に対応を確認します。1語1構図、512×512 RGBA・実透過、画風参照は `etymopedia_sample/references/invidious.png` の1枚です。
4. **Worksは完成PNGを実際に開いて**短い `解説英語`・`解説日本語` を同じCSV行へ記入します。英語は正確な見出し語を含み18語以内。実行プロンプト、画像保存先、実PNGのSHA256/Git blob SHA、検品日時・方法も同じ行へ保存します。未生成の行に解説・画像hash・検品済みを捏造しません。
5. ユーザーが `_illust` で検品し、**ユーザー自身が `copy_newer_pngs.cmd` を手動実行**して正式assetsへコピーします。CMDは現在の `D:\Projects\etymolingo` を参照します。**AIはCMDを実行せず、別の手段でも正式PNGへ自動反映しません。**
6. コピー前に新解説を現行正式画像の解説へ上書きしません。コピー後、正式PNGと検品PNGの実hashが一致する解説だけが取り込み候補です。本番取り込みと公開は今回未実施です。

入力の英語列は維持し、制作情報は日本語の追加列へ保存します。一括で19列へ変換しません。現行正本wordsの `(w, 順序付きp)` と第一義を照合し、古いtodo表や旧日付表を根拠に修正しません。未知列・他行・既存制作記録を保護します。

既存制作記録16件は保留として参照先を保持。第一日本語義空欄52件の補足案はstagingの `final_pending126_resolution_20261015.json` にのみ保存し、正本は未変更です。日付未確認3037件は追加していません。

生成・検品の詳細は [WORKFLOW.md](WORKFLOW.md)。今回の検証記録は `.workflow/final_handoff_manifest_20261015.json`、変更前の控えは `.workflow/final_handoff_backup_path.txt` が示す場所です。
