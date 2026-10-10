# root-spek-v002 コンセプト

- root key: spek-
- stem: root-spek
- candidateId: v002
- status: candidate（未評価・未採用）
- 日本語表示名: カンサツスル・スペク・プリズマスコープ
- 英語表示名: To Observe · Spek · Prismascope
- ローマ字名: Kansatsusuru Spek Prismascope
- PIE: spek-
- 元DBの語義: 観察する / to observe
- 作成日時(JST): 2026-10-09T22:20:00.509504+09:00

## コンセプト
横長spectaclesが頭と胴を兼ね、二本の短いtelescopeが太い脚。spectrumの色ガラス塊が丸い腹になる。首を作らず、双円の巨頭を主役にする。

## 身体の構成
横長spectaclesが頭と胴を兼ね、二本の短いtelescopeが太い脚。spectrumの色ガラス塊が丸い腹になる。首を作らず、双円の巨頭を主役にする。

## 顔・画風・素材
右レンズは細い眼、左は丸い大きな眼。口を作らず、片側だけ上がる物理レンズ眉でクールな愛嬌。
精密な実物3Dコレクティブルフィギュアのスタジオ商品写真。carved dark walnut spectacle frame
### スタイル設計
~~~json
{
  "medium": "physical-3d-collectible",
  "bodyPlan": "wide spectacle body on two tube legs",
  "silhouette": "wide twin circles above two short thick legs",
  "proportion": "bespoke creature proportions",
  "primaryMaterial": "carved dark walnut spectacle frame",
  "secondaryMaterials": [
    "silver telescopic legs",
    "rainbow-layered glass belly"
  ],
  "eyeTreatment": "one wide and one narrow inset lens eye",
  "expression": "cool asymmetrical curiosity",
  "finish": "precise sculptural surface detail"
}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| spectacles | 眼鏡 | the complete wide spectacle head-body frame / 横長の眼鏡頭胴 | Latin spectaculum/spectare from specere, PIE *spek-. 眼鏡の語義を原典確認。 | https://www.etymonline.com/word/spectacles |
| telescope | 望遠鏡 | two short telescope legs / 太い望遠鏡二脚 | Telescope contains Greek skopos/skopein from *spek-; tele- is separate. -scope部分が同根。 | https://www.etymonline.com/word/telescope |
| spectrum | スペクトル、範囲 | solid color-spectrum lower belly / 色光帯の厚いガラス腹 | Latin spectrum from specere, PIE *spek-. 色光帯を立体ガラスで可視化。prism/rainbowという語自体まで同根とはしない。 | https://www.etymonline.com/word/spectrum |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 命名根拠
語根内で先頭日本語訳・英語訳・PIE表示を共通とし、最後のモチーフ名だけを候補別にする。
~~~json
{
  "romaji": "Kansatsusuru",
  "kana": "カンサツスル",
  "en": "To Observe",
  "selectedMeaningJa": "観察する",
  "selectedMeaningEn": "To Observe",
  "sourceMeaningField": "ja",
  "sourceMeaningDocument": "app/data/generated-etymon/roots.json",
  "englishDisplaySource": "translation of selectedMeaningJa; original database ja/en remains unchanged"
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-a8d06aac-0a24-4611-a559-d2634d7d2f75.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\top100\_sources\root-spek-v002.png
- 原本SHA256: eb1b89ade3c8610c78b37041a2f920c41706cb49f566de8f7c744756cf8e8b16
- 最終PNG: root-spek-v002.png
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- Etymonline: spectacles — https://www.etymonline.com/word/spectacles
- Etymonline: telescope — https://www.etymonline.com/word/telescope
- Etymonline: spectrum — https://www.etymonline.com/word/spectrum

## 全文生成プロンプト
~~~text
Create exactly one original surreal etymology creature as a real, premium PHYSICAL THREE-DIMENSIONAL collectible sculpture, photographed in a studio as a product cutout. True volumetric anatomy, solid sculpted facial planes, actual thick eyeballs or inset glass eyes, intricate tangible materials, realistic reflections, fine construction seams and contact occlusion inside the object. This is not a drawing, cel-shaded illustration, flat anime character or a flat picture pasted onto an object. The integrated words must form the head, body, limbs or large structural wings, not accessories carried by an ordinary character. No unrelated costume or standalone props. The creature may be charming and strange without horror or aged facial features.

STRUCTURE: 横長spectaclesが頭と胴を兼ね、二本の短いtelescopeが太い脚。spectrumの色ガラス塊が丸い腹になる。首を作らず、双円の巨頭を主役にする。

FACE AS A PHYSICAL SCULPT: 右レンズは細い眼、左は丸い大きな眼。口を作らず、片側だけ上がる物理レンズ眉でクールな愛嬌。 Face marks are recessed or painted onto the genuinely curved dimensional sculpt; anime-inspired eyes, if used, are thick inset eyeballs, never a flat illustration.

MATERIALS: carved dark walnut spectacle frame; silver telescopic legs; rainbow-layered glass belly. Preserve fine tangible material texture and precise physical craftsmanship.

RECOGNIZABLE BODY PARTS: spectacles = the complete wide spectacle head-body frame; telescope = two short telescope legs; spectrum = solid color-spectrum lower belly. Each part grows from the body or is the body. Shapes used to visualize a modern meaning do not assert the name of every shape is from the same root.

POSE: full-body three-quarter product view

One entire isolated real sculpture, all limbs and projections contained inside a square, generous transparent margin. Transparent alpha background, final asset 512 x 512. Broad soft studio lighting reveals geometry and microtextures, realistic self-shadow within the figure, no floor or external cast shadow. No writing, alphabet, numbers, labels or logo. No scene or pedestal.

Avoid: No 2D illustration, flat cel shading, flat paper-drawn face, drawn background, text, letters, watermark, logo, captions, pedestal, display stand, cast shadow on a floor, scene, detached props, unrelated mascot animal, blood, exposed organs, human teeth, old-man face, cropping.
~~~

## 除外・制約プロンプト
~~~text
No 2D illustration, flat cel shading, flat paper-drawn face, drawn background, text, letters, watermark, logo, captions, pedestal, display stand, cast shadow on a floor, scene, detached props, unrelated mascot animal, blood, exposed organs, human teeth, old-man face, cropping.
~~~

## 仕上げ検証
~~~json
{
  "size": [
    512,
    512
  ],
  "mode": "RGBA",
  "alpha": [
    0,
    255
  ],
  "corners": [
    0,
    0,
    0,
    0
  ],
  "bbox": [
    26,
    51,
    491,
    475
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。
