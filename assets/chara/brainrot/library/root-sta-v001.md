# root-sta-v001 コンセプト

- 候補キー：stā-/v001
- 親候補：なし（同語根の独立した構造案）
- PNG：root-sta-v001.png
- status：candidate（人間未採用）
- キャラクター名：Tatsu Sta Stablestone
- 日本語読み：タツ・スター・ステイブルストーン
- 名前の構成：Tatsu（立つ） / Sta / stable + statue-like stone texture
- PIE：*stā- / *sta- / 立つ / to stand
- root key：stā-
- 既定stem：root-sta（top30/roots-plan.json の htmlStem）
- 作成日時：10/09/2026 17:59:28

## コンセプト
白い石像の巨大な頭と赤い馬小屋の胴。背もたれのない丸い木製スツールが四脚の下半身、駅のホームと屋根が左右の翼になる建物生物。

## 英単語と部品
| English word | Meaning | Visible anatomy | Shared component / lineage | Source |
|---|---|---|---|---|
| statue | 像・石像 | Giant marble statue-bust head / 大きな白い石像の頭 | French statue ← Latin statua, related to statuere/status/stare ← PIE *sta-. Stone sculpted figure is the vocabulary object; stone and marble names are not additional same-root claims. | [Etymonline](https://www.etymonline.com/word/statue) |
| stool | 背もたれのない丸椅子 | Round wooden stool seat/lower torso and four legs / 丸いスツールの下半身と四脚 | Old English stol ← Proto-Germanic *stōla- ← PIE *sta-lo-, from *sta-. Use the furniture sense of stool. | [Etymonline](https://www.etymonline.com/word/stool) |
| stable | 馬小屋 | Red horse-barn torso / 赤い馬小屋の胴 | Old French stable/estable ← Latin stabulum ← PIE *ste-dhlo-, derived from *sta-. Use the animal-building noun. A horse peeking from the barn is meaning context; horse is not taught as sta-derived. | [Etymonline](https://www.etymonline.com/word/stable) |
| station | 駅 | Blue-roofed station-platform wings / 青い駅のホームの翼 | French stacion ← Latin statio/stationem, related to stare ← PIE *sta-. Roof, platform, clock and track detail identify the railway station sense; those individual object names are not same-root vocabulary. | [Etymonline](https://www.etymonline.com/word/station) |

現代の語義を示す象徴を身体に融合する。象徴の物体名そのものを同根として教えるものではない。partial=true の語は共有部分のみが対象語根に由来する。

## 顔と素材
大きな石像の頬に自然に彫り込んだ左右の目。片目が大きく開き、もう一方は眠い半閉じ、唇は小さく斜めに笑う。石の削り跡と彫刻の目蓋を見せ、点の印刷顔を貼らない。
スタイル：Photoreal carved marble, red timber barn and varnished stool; quirky youthful sculpted stone face.

## 維持する要素・避ける変更
同根の英単語を主要部品として維持。衣装と手持ち小物だけに置き換えない。各候補は構造から異なり、顔差分ではない。全員点目という旧方針は現行ルールではない。

## 出典・生成経緯
- ローカル対応表：top30/roots-plan.json / tools/word-art-todo.csv（限定したCSVのみ参照）
- 使用ツール：built-in ImageGen（1候補につき1回の新規生成）
- 編集元・参考画像：なし
- 生成原本：C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-78b3c2b0-0ea5-4573-b9c9-33795e6eeae3.png
- 保存原本：D:\etymolingo\work\wildwordopia\sample\_sources\root-sta-v001.png
- 仕上げ：PowerShell System.Drawing による縦横比維持の512×512リサイズと透明余白のみ。主要部品の描き直し・除去なし。

## 完全な生成プロンプト
```text
Create exactly ONE original Wild Wordopia full-body brainrot chimera, a transparent game PNG, final 512x512 intent. Major anatomical objects teach the four English words STATUE, STOOL (backless seat), STABLE (horse barn), STATION (railway station), all historically connected to PIE *sta- 'stand'. Fuse them into anatomy, not held props or a human in a costume. Vivid tactile 3D materials, surprising impossible structure, youthful friendly personality, no elderly face. Architectural details such as a clock, rails or a horse in a barn only clarify the building meanings, not extra same-root vocabulary. Keep all appendages, feet, roofs and tips fully visible, with generous truly transparent empty padding on ALL sides. No text, letters, numbers, logo, floor, cast shadow, scenery, backdrop or checkerboard. No existing character copying.

An enormous white MARBLE STATUE bust of a charming youthful child, with recognizable sculpted curls, a very round cheek and physically carved asymmetrical eyes, IS the head. One eye open wide and the other half-lidded, tiny crooked sculpted smile. No skin or ordinary human body. A bright red wooden horse STABLE with pitched roof and white X-pattern barn doors IS the torso; one tiny horse peeks through an open door solely to identify the stable. A huge round backless wooden STOOL grows beneath the barn and IS the lower body, its round seat visible under the barn, four short thick splayed stool legs its actual limbs. Two recognizably railway STATION platform sections with blue canopy roofs and small stone station door arches grow directly from the barn sides as broad architectural wings. Squat four-legged stable organism, giant marble statue head much larger than the barn torso, clear scale madness.
```

## 仕上げ確認
- PNG / 512×512 / RGBA：確認済み
- 四隅alpha：0, 0, 0, 0
- 透明ピクセル：158299 / 前景ピクセル：103845
- 全身・主要モチーフ・外周：生成結果と最終512プレビューを目視確認。人間による採用判断は未実施。

## 評価履歴
| 日時(JST) | 範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 10/09/2026 17:59:28 | 全体 | 未評価 | 比較候補を保存。自動採用しない。 | candidate |

## 背景透過の修正履歴

修正前原本：C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-07a46130-05aa-4c56-8575-40bdcb1dee5d.png

背景だけをImageGenで透過。身体は維持。

```text
Edit this exact whimsical living marble statue / stable barn / wooden stool / railway station creature. Preserve absolutely all its anatomy, youthful expressive marble face with one raised eyebrow and half-smile, oversized curly stone head, red horse stable torso and horse inside, twin blue station-platform wings, wooden backless stool seat and four legs, all materials, colors, pose and view. This is ONLY an alpha cutout and framing repair: remove the isolated white background fragment over the hair and any detached white or colored background scraps or fringe outside or between body parts. Preserve pale stone connected to the head and body. Reframe the complete creature with generous empty transparent margins on every side, restore any top hair curves or stool feet clipped by the source image frame. Keep every major motif and the existing face. Actual transparent alpha background; no white matte, checkerboard, floor, shadow, words or extra objects.
```

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：タツ・スター・ステイブルストーン
- 英語表示名：To Stand · Sta · Stablestone
- 元のローマ字名：Tatsu Sta Stablestone
- 英語名の三要素：To Stand / Sta / Stablestone
- 翻訳する先頭部分：Tatsu → To Stand
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：タツ・スター・ステイブルストーン
- 訂正前の英語名：To Stand · Sta · Stablestone
- 現在の混成ローマ字名：Tatsu Sta Stablestone
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「立つ」から「立つ」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でTatsu/To Standを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：立つ / to stand
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：立つ / To Stand
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.010](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
