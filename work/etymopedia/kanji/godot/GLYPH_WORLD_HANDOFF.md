# 生きている文字の世界 — 攻撃表現の修正

更新: 2026-10-13

最新のユーザー指定は、攻撃を文字の配置・動きで構成すること。前回の「イラストを飛ばす」表現は却下された。`HANDOFF_CODEX.md` の古い画像主体のエフェクト方針と矛盾する箇所は、この指定が優先する。

## 判断基準

- 攻撃の形は漢字そのもので作る。火なら朱色の「火」が揺らめき、木なら「木」の集まりが林を作り、水なら「水」が流れの形になる。
- 木は主人公が歩いた道に生える。ランダム配置・停止中の定期生成はしない。木の道で輪を閉じると、その中の敵を木の字で囲み、見える木が触れて倒すゲーム性を持たせる。
- 見える文字が敵へ触れると、その地点で HP が減る。文字の配置と無関係な大きい透明円を当たり判定にしない。
- 火が触れた敵には、小さい赤い「火」がまとわりつく。敵の座標・部品剥離後の字に追従し、燃焼の寿命とともに消える。
- 水の継承による連鎖も、濡れた字の間を見える「水」が渡ってから当たる。元の敵を削った瞬間に隣の HP を減らす透明な連鎖攻撃にしない。
- 強化では字の数・列・編隊・配置が育つ。Lv1 は敵を追尾しない。
- 部首と材料の属性を継承する。レアな合成による意味の転換は、単なる数値上昇より戦い方が変わることを重視する。
- 画像は背景・薄い墨の補助として扱う。イラストと字を重ねて主攻撃が読めなくなる形へ戻さない。
- 承認済み甲骨文字の `scripts/oracle.gd` と `data/jgw.json` は描き直さない。

## 実装と検証の境界

`scripts/glyph_fx.gd` が、描く字・座標・大きさ・角度・色と、その字の接触形状を共通データとして出す。`scripts/semantic_combat.gd` は同じデータを使って接触を調べ、`main.k_hit` を通して HP を削る。低フレームレート時も、同じ字の前フレームから現在までの移動を追う。

`status_forms` と敵に束縛した `cling` は状態表示。火のまとわりつき自体の大きい当たり判定は持たず、継続ダメージは既存の HP 経路を使う。

`tools/test_glyph_attacks.gd` は接触・追従・寿命・属性・歩いた木の道と閉路・見える水の連鎖・負荷上限・画面端と試験場操作・字庫にない字のフォント補完の契約を調べる。画面の美しさや読みやすさの合否は、実際の Godot 画面を Lv1 と Lv3 で見て判断する。前回の基準画像と元文字のハッシュは `art/review/glyph-world-baseline.json` に記録した。

## 実行

```powershell
& 'D:\apl\Godot_v4.7.2-stable_win64.exe\Godot_v4.7.2-stable_win64_console.exe' --headless --path . --script res://tools/test_glyph_attacks.gd
& 'D:\apl\Godot_v4.7.2-stable_win64.exe\Godot_v4.7.2-stable_win64_console.exe' --headless --path . --script res://tools/test_semantics.gd
& 'D:\apl\Godot_v4.7.2-stable_win64.exe\Godot_v4.7.2-stable_win64_console.exe' --headless --path . --script res://tools/test_forest_budget.gd
```

ゲームの入口は `ゲームを開始.cmd`、字の比較は `新しい技を観る.cmd`。試験場の矢印キーは移動、＋／− は敵を作り直さずに Lv を変更、1〜5 は場面を変える。旧資料の「←→で Lv」は、この操作変更より前の記述。

## 保存した証拠

- 新しい文字攻撃の検査: `art/review/glyph-world-tests.log` と `art/review/glyph-world-tests-engine.log`。100 件成功、0 件失敗。これは接触と状態変化の検査結果。
- 囲いの検査では、歩いた正方形の内側の敵 HP が 1000 → 998、外側は 1000 のまま。木の配置から離れた不可視の範囲攻撃を確認する試験も含む。
- 防護の字がある縁では HP が減り、同じ形の中の文字がない空間では減らないことも、実際の更新経路で検査する。以前の大きい透明円なら当たってしまう場所を、接触なしとして確かめている。
- 濡れた元の敵に当たった瞬間は、次の敵の HP が変わらない。その後に「水」が進み、次の字に触れたときに削る。近くても移動経路から外れた敵は削らない。連鎖から新たな連鎖を無制限に出さない。
- 字庫にない「獣」はフォント補完の対象になる。既存の字を二重に描かず、隠れた敵や画面外の敵の表示ルールを守る。接触と状態表示は字の動きを含む見える中心に合わせる。
- 元文字の描画ソースと字形データは修正前と同じ内容。描画ソースは CRLF を LF に揃えた SHA-256 で検査し、Git の書き出しによる改行だけの差を許す。字形データはバイト単位の SHA-256 が一致する。
- 基本の作字・HP・属性・門の検査: `art/review/glyph-world-core-tests.log` と `art/review/glyph-world-core-tests-engine.log`。170 件成功、0 件失敗。旧「止まっても木が出る」前提の検査は、歩いた道の生成を調べる内容に更新済み。
- 多数の木がある場面の検査: `art/review/forest-budget-final.log`。12 件成功、0 件失敗。Lv6 でも一つの仲間が無制限に木を増やさず、囲いの攻撃用に余地を残す。生えなかった位置は道に記録せず、実在している木の字だけで輪を判定する。60 個のエフェクトがある場面でも既存の木を突然消さずに囲いを完成でき、内側へ見える「木」が進んで HP を削る。
- 前回の画像主体の攻撃を示す比較元: `art/review/final-炎-lv3/shot_02_play.png`。この画像は新しい実装の合格例として扱わない。

実画面でも確認済み。`tools/capture_glyph_world.gd` は実際のゲームを動かし、矢印の入力イベントで歩いて記録する。移動で仲間の ID が変わらないことも記録中に確認する。検査件数を、文字の見た目が完成した根拠として扱わない。

- `art/review/living-wood-input/`: 57 コマ。歩いた線に木が育ち、囲いを閉じると内側の「獣」に木が接触し、HP 2 → 1 → 撃破。外側の草は HP 14 のまま。`art/review/living-wood.gif` に録画をまとめた。
- `art/review/living-fire-final/`: 61 コマ。火が草へ接触して HP が減り、赤い小さな火が燃焼中の字に追従する。草を移動したあとも追従し、燃焼終了で消える。`art/review/living-fire.gif` に録画をまとめた。
- `art/review/living-forest-final/`: 57 コマ。森は Lv1 から三つの木で道を作る。林の二つの木との違いを目視確認した。
- `art/review/living-metsu/`: 60 コマ。水を並べた奔流、火・刃の継承、溜めと解放を確認した。火と海の Lv3 も実画面で確認し、海の重なりを修正した。
- `art/review/glyph-four-minute-stdout.log`: 通常ゲームの自動操作を 240 秒実行。作字・戦闘・ボス・再開まで進み、スクリプトエラーなし。終了時の Godot リソース解放警告は残る。録画時のキャッシュ保存警告は、この環境の保存権限による。

録画はローカルの確認資料。別 PC では以下で再作成できる（画像・録画の保存には画面が必要）。

```powershell
godot --path . --fixed-fps 30 --rendering-driver opengl3 --script res://tools/capture_glyph_world.gd -- --case=wood --out=res://art/review/living-wood --nosave
```

保護対象の SHA-256（ソースを変更する許可にはしない）:

```text
scripts/oracle.gd  LF canonical  07c2537c3a58d5634469356db95382c125810a30ab372d6fd544b7a0df4065cb
scripts/oracle.gd  CRLF variant  1df1dc2d9d36d753602543be2e7622595d7f3d6723528cabb9d970d00b035642
data/jgw.json     exact bytes   42b02c5e96c149faf3a40c5c56d38fbba4e91b252e706f0ca00ba5016a9462c9
```

今回の作業フォルダは LF・3,594 バイト、Git archive の書き出しは CRLF・3,703 バイトだった。両方を LF に揃えると上の canonical 値になる。
