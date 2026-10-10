# root-oino-v002 コンセプト

- 候補キー：oino/v002
- 親候補：なし。同じ語根の既存v001とは構造の異なる新規案。
- PNG：root-oino-v002.png
- status：candidate
- キャラクター名：Hitotsu Oino Wheelion
- 日本語読み：ヒトツ・オイノ・ウィーリオン
- 名前の構成：Hitotsu＝日本語「ひとつ」／Oino＝PIEの音／Wheelion＝wheelとonionを混ぜた創作の響き。名前自体は英単語や語源の実例ではない。
- PIE：*oi-no-「ひとつ」
- root key：oino（既存characters-new-roots.jsonのid）
- 既定stem：root-oino（今回指定された候補stem）
- 作成日時：2026-10-09 JST

## コンセプト

一輪車の巨大ホイール自体が円盤状の主胴体。輪の中心の玉ねぎハブが一つ眼の顔になり、制服の両袖が腕として左右に生える。玉ねぎの上には一本のユニコーン角。

v001の「巨大な玉ねぎ胴体＋下に一輪車」構造に拘らず、円盤の車輪胴体へ主役を入れ替える。もう一つの新候補とは主胴体・合体方法・全身の輪郭・眼の数が異なる。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| onion | タマネギ | ホイール中心に融合した大きな層状の玉ねぎハブ | 語全体。ラテン語の『一つ』に関係する語を経る既存モチーフ。玉ねぎの由来は既存oi-no-コンセプトの出典を踏襲。 | [onion](https://www.etymonline.com/word/onion) |
| unicorn | ユニコーン | 玉ねぎハブから生え、ホイールの上に突き出す一本の螺旋角 | uni-。共有するのは『一つ』を表すuni-。corn/角の部分は別の語源。 | [unicorn](https://www.etymonline.com/word/unicorn) |
| unicycle | 一輪車 | 胴体そのものを作る一つの巨大ホイール、金属スポーク、クランクとペダル | uni-。共有するのはuni-。cycleの部分は別の語源。 | [unicycle](https://www.etymonline.com/word/unicycle) |
| uniform | 制服 | ホイール左右から伸びる紺の制服袖、白い袖口、ハブ下部の制服襟 | uni-。共有するのはuni-。formの部分は別の語源。 | [uniform](https://www.etymonline.com/word/uniform) |
| one | ひとつ、1 | 一つの眼、一輪の車輪、一本の角 | 語全体。数の意味を個数で示す。数字や文字は画像に描かない。 | [one](https://www.etymonline.com/word/one) |

unicorn・unicycle・uniformは単語全体を一つのPIEだけに由来すると説明しない。共有するのはuni-。車輪のスポークやペダル、制服の袖口、接合のための普通の解剖構造はモチーフを描くための構造であり、それらの名称まで同根と教えない。

## 顔と素材

玉ねぎハブに大きな一つ目。青緑の虹彩、透明感のある角膜、厚みのあるまぶた、少し上を見るいたずらっぽい視線。細い線の笑顔や点目にはしない。短い非対称の口で気の抜けた愛嬌。

車輪のゴム・金属スポークと、玉ねぎの皮・みずみずしい層、布の袖、滑らかな角の物質感を対比させる。顔は玉ねぎの材質に埋まった一つ眼。全員を点目に揃える旧方針は使わない。

## 維持する要素・避ける変更

- 学習モチーフはonion / unicorn / unicycle / uniform / oneのみ。
- 一つの車輪、一本の角を維持。文字や数字でoneを描かない。
- 巨大ホイール自体を主胴体にする。巨大玉ねぎの下に小さな一輪車を置くv001型へ戻さない。
- 全身、角、袖、車輪、ペダルを切らない。透明背景、余白を維持。
- ユーザーの「onion点目が合っていない」評価は過去の顔への評価であり、新案全体の採用とは扱わない。

## 出典・生成経緯

- 語源・語義の対応：既存sample/characters-new-roots.jsonのid=oino、generation-prompts-new-roots.jsonの既存oi-no-案を踏襲。
- 語源項目：[onion](https://www.etymonline.com/word/onion) / [unicorn](https://www.etymonline.com/word/unicorn) / [unicycle](https://www.etymonline.com/word/unicycle) / [uniform](https://www.etymonline.com/word/uniform) / [one](https://www.etymonline.com/word/one)
- 使用ツール：built-in ImageGen。画像編集もbuilt-in ImageGen。
- 初回生成の参考画像：なし。新規生成。
- 最終候補に使った生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-f5d22bee-a260-466b-b9e4-9742a302f138.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-oino-v002.png
- 外周清掃試行の生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-aedb803c-d695-4e56-a96f-c36ecea22aca.png
- 外周清掃試行のコピー：D:/etymolingo/work/wildwordopia/sample/_sources/root-oino-v002-cleanup-attempt.png
- 派生関係：新規構造案v002 → 透過外周の清掃試行（最終PNGには未使用）。
- 仕上げ処理：PowerShell System.Drawingで画像の縮小のみ。448×448へ縮小して512×512の透明キャンバス中央に配置。描き直し、モチーフ除去、Python画像編集なし。
- galleryおよびmanifestは変更していない。

## 完全な生成プロンプト

### 1. generate

- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-f5d22bee-a260-466b-b9e4-9742a302f138.png

```text
Use case: stylized-concept.
Asset type: one original English-etymology game character candidate, standalone transparent PNG cutout, designed to read clearly at 512x512.
Primary request: Create a radically absurd physically fused onion-unicorn-unicycle-uniform creature. This is a NEW structural candidate, not an onion mascot sitting on a small wheel.
Main body and silhouette: ONE ENORMOUS upright black rubber UNICYCLE WHEEL is the entire circular torso, taking up most of the creature. See the wheel in a near-front three-quarter view so its circular silhouette and rubber sidewall, metal spokes, and axle remain unmistakable. The visible rim surrounds a large real layered golden ONION HUB, which is anatomically fused into the axle as the living face and core, not a separate onion riding above the wheel. There is no separate onion head above this wheel body. Two short sleeved arms protrude directly from the left and right edges of the wheel at the upper sides. The uniform sleeves are fitted navy SCHOOL UNIFORM cloth with white cuffs, attached to the wheel body; the short hands at their ends are onion-layer connecting anatomy. A small navy blazer collar and small white shirt patch are fused around the onion hub, but the big tyre and spokes stay plainly exposed. ONE thick ivory spiral UNICORN HORN grows directly from the top of the onion hub and extends above the upper wheel rim, so one horn is clear. A pair of functional unicycle pedal cranks protrude at the wheel axle sides. No second wheel, no conventional legs, no tiny vehicle below a giant onion.
Face: ONE oversized charismatic cyclops eye embedded in the front of the onion hub. A richly detailed teal iris, glassy cornea, soft three-dimensional eyelids, and an upward slightly off-center mischievous gaze. One small asymmetrical softly parted mouth below the eye; an endearing bewildered expression. NOT dot eyes, NOT two eyes, NOT a thin drawn smile, NOT old or wrinkled, NOT a horror eye. The face belongs to the onion material.
Materials and rendering: surreal polished 3D creature with convincingly photographed rubber tread, glossy metal spokes, thin papery onion skin and translucent onion layers, woven uniform cloth and a smooth spiral horn. Physical material boundaries and impossible anatomical fusion are the main joke. The result must look strange and charismatic, not a generic cute child mascot with accessories. Warm gentle studio illumination; strong material contrast; crisp cutout edges.
Composition: isolated single character, square canvas, full body and all protrusions visible. Center the creature with at least 7 percent empty margin around the horn, cuffs and bottom tyre. Near-front three-quarter view. Actual transparent alpha background. No floor, no cast ground shadow, no backdrop.
Allowed learning motifs ONLY: onion, unicorn, unicycle, uniform, and one represented by one eye, one horn and one wheel. Ordinary anatomical connectors, uniform cuffs and mechanical wheel parts are only structure, not extra learning motifs. The shared PIE root is *oi-no- meaning one; for unicorn, unicycle and uniform the shared part is uni-, not the whole word.
Avoid: text, letters, numerals, labels, logo, watermark, floating props, extra animal species, wings, crown, weapon, backdrop, checkerboard pattern painted as a background, cropped edges, a small wheel under an onion torso, a person riding a unicycle, a uniformed normal humanoid.
```

### 2. alpha-edge-cleanup-attempt

- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-aedb803c-d695-4e56-a96f-c36ecea22aca.png
- 参照した編集対象：D:/etymolingo/work/wildwordopia/sample/root-oino-v002.png
- 最終PNGには使用しない試行。原本を保持。

```text
Use case: background-extraction and precise-object-edit.
Input image: edit target, the finished candidate oino-v002. Keep this exact character, exact silhouette, face, materials, clothing, anatomy, pose, colors, single horn, single wheel and all existing components. Preserve full body framing and current generous empty margins.
Change ONLY accidental bright red and yellow cutout contamination: remove the neon red/yellow pixel speckles and thin colored fringes around onion skin edges and within the transparent gaps between wheel spokes. Those red/yellow speckles are an unwanted alpha-cutout artifact, not part of the character's design. Restore these contaminated edge pixels to clean natural edge colors matching nearby onion or metal, fading smoothly to transparency. Clean natural cutout perimeter, clean transparent voids between spokes; no detached dots.
No new parts, no new costume, no altered face, no new pose, no eye-count change, no changes to body proportions. Actual transparent alpha background. No floor, cast shadow, background, text, watermark or logo.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み。Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。alpha=0の透明ピクセル170864、alpha=255のピクセル2394。
- alpha>16の可視範囲：53, 35, 463, 468。
- 全身・主要モチーフ・外周：最終512画像を目視。円盤状のホイール胴体、玉ねぎハブの一つ眼、一本の角、制服袖、ペダルが全部読める。全身の切れ・文字・地面影なし。
- 外周の数値確認：プレビューで赤く見えた494pxはすべてalpha1〜16。alpha>16の鮮赤は0px。
- ユーザーの造形評価：未評価。検査済みであってもadoptにはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09 | 新規案全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

