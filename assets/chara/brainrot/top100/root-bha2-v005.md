# root-bha2-v005 コンセプト

- root key: bhā-2
- stem: root-bha2
- candidateId: v005
- status: candidate（未評価・未採用）
- 日本語表示名: ハナス・バァ・ミクリフェイ
- 英語表示名: To Speak · Bha · Micrifae
- ローマ字名: Hanasu Bha Micrifae
- PIE: bhā-2
- 元DBの語義: 話す / to speak
- 作成日時(JST): 2026-10-09T21:43:26.374144+09:00

## コンセプト
巨大マイクの頭と輪になった電話受話器の胴を持つ、六本コード脚の機械妖精。

## 身体の構成
巨大な丸いマイクグリルが頭、縦に曲がった電話受話器が輪状の胴体。厚い寓話本の二枚の表紙と頁束が背中の甲羅・羽になる。六本の太い電話コード脚で歩く。

## 顔・画風・素材
マイクの網目へ埋め込まれた若い妖精の立体顔。左右で目の開きを変え、片眉を上げ、いたずらを考える小さな横口。金属顔面に厚い乳白ガラスの眼球。
古い真鍮・磨いたクローム・網目金属・濃赤ベークライト・古い本装丁が融合した、六脚メカのスタジオ写真。
### スタイル設計
~~~json
{
  "medium": "physical-3d-collectible",
  "bodyPlan": "microphone-headed six-legged phone-ring mech",
  "silhouette": "compact circular torso with a huge spherical head and six splayed cord legs",
  "proportion": "spherical head almost as wide as hollow ring torso",
  "primaryMaterial": "brushed chrome and aged brass",
  "secondaryMaterials": [
    "deep red bakelite",
    "clothbound book",
    "milky glass"
  ],
  "eyeTreatment": "asymmetric inset opaline glass eyeballs",
  "expression": "mischievous one-brow smirk",
  "finish": "fine metal mesh, oxidized seams, polished curved handset"
}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| fairy | 妖精 | a sculpted imp-fairy face with pointed ears and book-shaped fairy wings / マイクへ埋め込んだ妖精の立体顔と本から生える妖精羽 | English fairy ← Old French faerie ← fay/fee ← Latin Fata/fatum ← fari ← PIE *bhā-2, in the OED derivation reported by Etymonline. ユーザー指定DB系統をデザインに使用。EtymonlineはFatuus/Faunus経路の別説も併記しており、唯一確定説とはしない。妖精の羽や耳はfairyを認識する造形で、それらの物体名自体が同根という意味ではない。 | https://www.etymonline.com/word/fairy |
| microphone | マイク | a huge spherical vocal microphone mesh head / 頭全体になる球形の音声マイク | English microphone contains Greek phōnē ← PIE *bhā-2; micro- is a different element. 同根部分は-phoneだけ。認識しやすい音声用マイクの網目グリルを身体へ融合。 | https://www.etymonline.com/word/microphone |
| phone | 電話 | a curved telephone handset forming the whole ring torso and six coiled-cord legs / 受話器の輪状胴と六本の巻きコード脚 | English phone (telephone device) is shortened from telephone; its inherited phone element is Greek phōnē ← PIE *bhā-2. 電話を描く。音声学のphoneとは描写対象を混同しない。元のtelephoneではphone部分だけが対象語根で、tele-は別。 | https://www.etymonline.com/word/phone |
| fable | 寓話 | a physical fable storybook fused as the back carapace and paired page wings / 背中の甲羅と二枚の頁羽になる実物の寓話本 | English fable ← French fable ← Latin fabula ← fari ← PIE *bhā-2. 寓話は厚い実物の物語本と、文字なしの浅い動物寓話レリーフで可視化。bookや動物名自体が同根という説明ではない。 | https://www.etymonline.com/word/fable |

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
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-d12a5364-43b9-44aa-b4c7-36b8ed8cff57.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\top100\_sources\root-bha2-v005.png
- 原本SHA256: c0760d59be4c3b20f93337782fddf000c5ad7f4e4b57b386a923700ea7322036
- 最終PNG: root-bha2-v005.png
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- Etymonline: fairy — https://www.etymonline.com/word/fairy
- Etymonline: microphone — https://www.etymonline.com/word/microphone
- Etymonline: phone — https://www.etymonline.com/word/phone
- Etymonline: fable — https://www.etymonline.com/word/fable

## 全文生成プロンプト
~~~text
Create exactly one original surreal etymology creature as a real, premium PHYSICAL THREE-DIMENSIONAL collectible sculpture, photographed in a studio as a product cutout. True volumetric anatomy, solid sculpted facial planes, actual thick eyeballs or inset glass eyes, intricate tangible materials, realistic reflections, fine construction seams and contact occlusion inside the object. This is not a drawing, cel-shaded illustration, flat anime character or a flat picture pasted onto an object. The integrated words must form the head, body, limbs or large structural wings, not accessories carried by an ordinary character. No unrelated costume or standalone props. The creature may be charming and strange without horror or aged facial features.

Make a squat six-legged mechanical FAIRY creature, not a human figure. Its huge spherical head is a recognizable vocal MICROPHONE mesh grille. The entire torso is one large curved telephone HANDSET bent into a thick open oval loop: both speaker cups and its handle are readable as a real telephone receiver. Six heavy coiled telephone cords grow directly from the lower loop as splayed walking legs. A thick fable book binding is fused along the back of the loop; its two physical cloth covers and real layered pages unfold into two short broad wings and an armored book carapace. A tiny youthful fairy face is sculpted within the giant microphone head, with pointed ears grown from the grille. The silhouette is circular and low with six spread cord legs, completely different from a long four-legged book animal.

Face: A mischievous young imp-fairy face is physically sculpted into the front of the huge microphone grille, with short pointed fairy ears, one wide milky-glass eye and one narrowed glass eye, a raised metal brow and a tiny sideways smirk. It has young rounded facial planes, no old or horror features. The face is inset relief and actual eyes, not a picture on the grille.

Material and photography: Brushed chrome microphone mesh, aged warm brass facial relief, burgundy bakelite telephone loop, chunky rubber-insulated coils, dark teal clothbound book wings, ivory paper edge strata. Opaline glass eyeballs shine within the metallic sculpted face; show physical assembly and fine machining.

Readable structural motifs: fairy: a sculpted imp-fairy face with pointed ears and book-shaped fairy wings; microphone: a huge spherical vocal microphone mesh head; phone: a curved telephone handset forming the whole ring torso and six coiled-cord legs; fable: a physical fable storybook fused as the back carapace and paired page wings. These are visualizations of the modern meanings, and connecting structure is sculptural design, not an additional vocabulary motif.

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
    23,
    18,
    491,
    490
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。
