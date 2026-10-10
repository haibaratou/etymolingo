# root-uper-v002 コンセプト

- root key: uper
- stem: root-uper
- candidateId: v002
- status: candidate（未評価・未採用）
- 日本語表示名: コエテ・ウペル・コートマーケット
- 英語表示名: Over · Uper · Coatmarket
- ローマ字名: Koete Uper Coatmarket
- PIE: uper
- 元DBの語義: 超えて / over
- 作成日時(JST): 2026-10-09T22:17:07.960222+09:00

## コンセプト
横長のglass supermarketが四足胴。overcoatの毛織り袖が前脚、overallsのデニム裾が後脚になり、外套の背面が丸い屋根。店の入口がそのまま立体の顔になる。

## 身体の構成
横長のglass supermarketが四足胴。overcoatの毛織り袖が前脚、overallsのデニム裾が後脚になり、外套の背面が丸い屋根。店の入口がそのまま立体の顔になる。

## 顔・画風・素材
入口枠へ大きな曇りガラス眼球と小さい口を埋める。眉は水平、無表情だが硬い顔にせず丸い輪郭。
精密な実物3Dコレクティブルフィギュアのスタジオ商品写真。thick smoked shop glass
### スタイル設計
~~~json
{
  "medium": "physical-3d-collectible",
  "bodyPlan": "supermarket quadruped with cloth limbs",
  "silhouette": "low wide glazed shop on four textile legs",
  "proportion": "bespoke creature proportions",
  "primaryMaterial": "thick smoked shop glass",
  "secondaryMaterials": [
    "camel wool",
    "blue denim",
    "aged copper storefront"
  ],
  "eyeTreatment": "two large frosted glass globes",
  "expression": "calm deadpan",
  "finish": "precise sculptural surface detail"
}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| overalls | オーバーオール | denim overall cuffs as rear legs / 後二脚のデニム裾 | Overalls = over + all; over is from PIE *uper. overallの抽象義でなく衣服overallsを原典確認。over-だけ同根。 | https://www.etymonline.com/word/overalls |
| overcoat | 外套 | coat back as roof and sleeves as front legs / 屋根と前脚の外套 | Overcoat = over- + coat; over- is from PIE *uper. over-だけ同根。coat自体は別。 | https://www.etymonline.com/word/overcoat |
| supermarket | スーパーマーケット | the whole glazed shop torso with shelves and entrance / スーパー主胴 | Supermarket contains Latin super-, from PIE *uper. super-だけ同根。店舗の棚は現代語義の可視化、商品名は同根としない。 | https://www.etymonline.com/word/supermarket |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 命名根拠
語根内で先頭日本語訳・英語訳・PIE表示を共通とし、最後のモチーフ名だけを候補別にする。
~~~json
{
  "romaji": "Koete",
  "kana": "コエテ",
  "en": "Over",
  "selectedMeaningJa": "超えて",
  "selectedMeaningEn": "Over",
  "sourceMeaningField": "ja",
  "sourceMeaningDocument": "app/data/generated-etymon/roots.json",
  "englishDisplaySource": "translation of selectedMeaningJa; original database ja/en remains unchanged"
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-f95647b5-7373-4ede-bdf7-02177cb9663c.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\top100\_sources\root-uper-v002.png
- 原本SHA256: 9574121d73598428e3e18e0513ed5ea1ddfb2c9c8d58f4a278133fe68ca92e17
- 最終PNG: root-uper-v002.png
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- Etymonline: overalls — https://www.etymonline.com/word/overalls
- Etymonline: overcoat — https://www.etymonline.com/word/overcoat
- Etymonline: supermarket — https://www.etymonline.com/word/supermarket

## 全文生成プロンプト
~~~text
Create exactly one original surreal etymology creature as a real, premium PHYSICAL THREE-DIMENSIONAL collectible sculpture, photographed in a studio as a product cutout. True volumetric anatomy, solid sculpted facial planes, actual thick eyeballs or inset glass eyes, intricate tangible materials, realistic reflections, fine construction seams and contact occlusion inside the object. This is not a drawing, cel-shaded illustration, flat anime character or a flat picture pasted onto an object. The integrated words must form the head, body, limbs or large structural wings, not accessories carried by an ordinary character. No unrelated costume or standalone props. The creature may be charming and strange without horror or aged facial features.

STRUCTURE: 横長のglass supermarketが四足胴。overcoatの毛織り袖が前脚、overallsのデニム裾が後脚になり、外套の背面が丸い屋根。店の入口がそのまま立体の顔になる。

FACE AS A PHYSICAL SCULPT: 入口枠へ大きな曇りガラス眼球と小さい口を埋める。眉は水平、無表情だが硬い顔にせず丸い輪郭。 Face marks are recessed or painted onto the genuinely curved dimensional sculpt; anime-inspired eyes, if used, are thick inset eyeballs, never a flat illustration.

MATERIALS: thick smoked shop glass; camel wool; blue denim; aged copper storefront. Preserve fine tangible material texture and precise physical craftsmanship.

RECOGNIZABLE BODY PARTS: overalls = denim overall cuffs as rear legs; overcoat = coat back as roof and sleeves as front legs; supermarket = the whole glazed shop torso with shelves and entrance. Each part grows from the body or is the body. Shapes used to visualize a modern meaning do not assert the name of every shape is from the same root.

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
    16,
    41,
    492,
    450
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。
