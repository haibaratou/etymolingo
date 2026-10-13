# AGENTS.md — 漢字SURVIVOR（Godot 4.7.2）

作業の前に必ず `HANDOFF_CODEX.md` を読むこと。仕様・禁止事項・コードの地図・検証方法がまとまっている。
README.md と食い違う所は HANDOFF_CODEX.md が正しい。

守ること（要約）:
- 主人公は進化しない。仲間は作字台（Tab）でだけ作る。レベルアップの三択は復活させない。
- 合体レシピは字典（data/kanji_db.json）にある組み立てだけ。捏造しない。
- 敵の HP は格（game.json の RANK）で決める。英単語の長さ・画数は使わない。HP 0 で部品が一つ剥がれる。
- 仲間の技は Lv1 で敵を追尾しない。バリア系は押し返さない。画面の中で急に消さない。
- 仲間の音は ksfx() を使う。鳴り続ける音は入れない。
- 水墨画は画像生成モデルで描く（コードで絵を描かない）。原画は art/incoming/、取り込みは tools/ink_import.py。
- 甲骨文字の線（scripts/oracle.gd, data/jgw.json）は勝手に描き直さない。
- 変更後は `godot --path . -- --kl --klch=<字> --kllv=1` と `--kllv=3` で見て確かめる。
