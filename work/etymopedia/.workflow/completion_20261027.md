# イラスト生成対象の完了記録（2026-10-27）

- prompt_rows_weblio_missing_low500_redone_20261024_v3.csv: 全500行。reviewed 446、既存画像を保持してスキップ 1（botulinum.png）、語義確認待ち53。未生成の生成可能行0。
- prompt_rows_1000_with_priority_fixes_20261026.csv: 全1013行。reviewed 904、needs_revision 109、prompt_ready 0。末尾 dogfish.png まで保存済み。
- 2本のCSVの reviewed 合計1350件について、実PNGの存在・512x512・RGBA・透明部分・画像SHA256一致・英日解説の存在を最終照合。不整合0。
- 後者109件の保留内訳: 元々68件、viola 1件、正本との語義照合競合17件、追加競合23件。理由は各行の制作メモと prompt_review_pending.csv に記録。保留画像 sauna.png は .workflow/sense_hold_images_20261027/ に未採用として保全。
- landsman.png の腕の不具合は修正済み。元画像は .workflow/anatomy_revisions_20261026/landsman.png に保全。
- 最終保存マニフェスト: next1000_batch253_20261027.json。
- 最終照合: audit_low500_20261026.json、audit_next1000_20261027.json。
- 規定の検証: test_workflow_io.py 20件成功、test_image_content_evidence.py 4件成功。
- 完了範囲は _illust への画像保存、目視確認、制作CSVの解説・ハッシュ記録。ユーザー採用、辞書原本への取り込み、公開反映は未実施。
- 生成可能行がなくなったため継続制作の定期実行 automation-2 を終了する。
