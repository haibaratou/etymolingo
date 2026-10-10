# root-bha2-v004 コンセプト

- root key: bhā-2
- stem: root-bha2
- candidateId: v004
- status: candidate（未評価・未採用）
- 日本語表示名: ハナス・バァ・ファビュロフォン
- 英語表示名: To Speak · Bha · Fabulophone
- ローマ字名: Hanasu Bha Fabulophone
- PIE: bhā-2
- 元DBの語義: 話す / to speak
- 作成日時(JST): 2026-10-09T21:43:24.904527+09:00

## コンセプト
大きな可愛い妖精少女の頭に、分厚い寓話本の四足怪獣胴を融合した本電話獣。

## 身体の構成
横長の開いた寓話本が怪獣の胴体。本の背から立体の妖精頭が伸び、電話受話器が四本の太い脚になる。背に二枚の分厚い透明妖精羽。

## 顔・画風・素材
若い妖精の少女頭。短い柔らかな前髪、立体ガラスの大きな青緑虹彩、ふくらんだ頬、小さな得意げの口。可愛い頭と重い四足怪獣胴の落差。
実物の陶磁器妖精頭、古い革装丁・繊維紙、艶のあるベークライト電話脚と肉厚な透明ガラス羽の精密フィギュア写真。
### スタイル設計
~~~json
{
  "medium": "physical-3d-collectible",
  "bodyPlan": "book-bodied quadruped with fairy head",
  "silhouette": "wide low heavy four-legged monster; large head and two tall wings",
  "proportion": "oversized youthful head on elongated nonhuman body",
  "primaryMaterial": "aged leather and layered rag paper",
  "secondaryMaterials": [
    "porcelain",
    "bakelite",
    "thick veined glass"
  ],
  "eyeTreatment": "large inset layered glass irises",
  "expression": "confident tiny smile",
  "finish": "tactile paper edges, polished ceramic cheeks, glossy bakelite"
}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| fairy | 妖精 | oversized sculpted fairy head and two substantial translucent fairy wings / 大きな立体の妖精少女頭と肉厚の透明妖精羽 | English fairy ← Old French faerie ← fay/fee ← Latin Fata/fatum ← fari ← PIE *bhā-2, in the OED derivation reported by Etymonline. ユーザー指定DB系統をデザインに使用。EtymonlineはFatuus/Faunus経路の別説も併記しており、唯一確定説とはしない。妖精の羽や耳はfairyを認識する造形で、それらの物体名自体が同根という意味ではない。 | https://www.etymonline.com/word/fairy |
| fable | 寓話 | a thick open illustrated fable storybook forming the entire quadruped torso / 四足怪獣の胴を丸ごと作る厚い寓話本 | English fable ← French fable ← Latin fabula ← fari ← PIE *bhā-2. 寓話は厚い実物の物語本と、文字なしの浅い動物寓話レリーフで可視化。bookや動物名自体が同根という説明ではない。 | https://www.etymonline.com/word/fable |
| phone | 電話 | four curved telephone handsets as load-bearing legs, with coiled-cord joints / 四本の受話器脚と巻き電話コードの関節 | English phone (telephone device) is shortened from telephone; its inherited phone element is Greek phōnē ← PIE *bhā-2. 電話を描く。音声学のphoneとは描写対象を混同しない。元のtelephoneではphone部分だけが対象語根で、tele-は別。 | https://www.etymonline.com/word/phone |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 命名根拠
語根内で先頭日本語訳・英語訳・PIE表示を共通とし、最後のモチーフ名だけを候補別にする。
~~~json
{
  "romaji": "Hanasu",
  "kana": "ハナス",
  "en": "To Speak",
  "selectedMeaningJa": "話す",
  "selectedMeaningEn": "To Speak",
  "sourceMeaningField": "ja",
  "sourceMeaningDocument": "app/data/generated-etymon/roots.json",
  "englishDisplaySource": "translation of selectedMeaningJa; original database ja/en remains unchanged"
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-aba37151-ee6b-4f5f-ba95-1ba5d5bb4be8.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\top100\_sources\root-bha2-v004.png
- 原本SHA256: 0e6d3c5b25ea2cf8181432955a4004b94808c414362576784772b5495c360d58
- 最終PNG: root-bha2-v004.png
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- Etymonline: fairy — https://www.etymonline.com/word/fairy
- Etymonline: fable — https://www.etymonline.com/word/fable
- Etymonline: phone — https://www.etymonline.com/word/phone

## 全文生成プロンプト
~~~text
Create exactly one original surreal etymology creature as a real, premium PHYSICAL THREE-DIMENSIONAL collectible sculpture, photographed in a studio as a product cutout. True volumetric anatomy, solid sculpted facial planes, actual thick eyeballs or inset glass eyes, intricate tangible materials, realistic reflections, fine construction seams and contact occlusion inside the object. This is not a drawing, cel-shaded illustration, flat anime character or a flat picture pasted onto an object. The integrated words must form the head, body, limbs or large structural wings, not accessories carried by an ordinary character. No unrelated costume or standalone props. The creature may be charming and strange without horror or aged facial features.

The main anatomy is a low, broad four-legged BOOK MONSTER. A very thick open fable storybook is its complete torso, with leather covers serving as a continuous back and belly and hundreds of physical page edges visible between them. The pages have a small shallow relief of animals exchanging a moral tale, with no words; no independent animal body. Four chunky curved telephone HANDSETS grow directly from the book's corners as weight-bearing legs, their earpieces forming the feet and coiled cords forming their joints. An oversized fairy girl's head emerges from the book spine at the front. Two thick translucent fairy wings grow from the rear book binding. Keep it one coherent creature, with a huge charming head and an unmistakably heavy nonhuman quadruped torso.

Face: A cute youthful fairy girl's oversized sculpted porcelain head rises directly from the book spine, with a softly curled short fringe, pointed fairy ears, large inset teal glass irises, rounded cheeks and a tiny confident smile. Her eyes have actual curved glass thickness and painted iris layers; not a flat anime image.

Material and photography: Fine porcelain face and hair sculpt, weathered leather book skin, cream cotton-fiber paper with real thickness, deep emerald glossy bakelite telephone legs, chunky translucent veined glass wings with bright edges. Fine realistic surface variation and luxury miniature craftsmanship, not uniformly cheap plastic.

Readable structural motifs: fairy: oversized sculpted fairy head and two substantial translucent fairy wings; fable: a thick open illustrated fable storybook forming the entire quadruped torso; phone: four curved telephone handsets as load-bearing legs, with coiled-cord joints. These are visualizations of the modern meanings, and connecting structure is sculptural design, not an additional vocabulary motif.

Present one entire isolated figure at a three-quarter view, every wing, foot, cord and protrusion visible, generous transparent margin on all four sides. Transparent alpha background. The figure fills about 82 percent of a square composition and remains readable at 512 x 512. Soft broad studio key light and narrow rim light show material depth; only self-shadow within the sculpture, no background, floor or external shadow. No writing anywhere, including book pages and phone surfaces.

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
    28,
    478,
    496
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。
