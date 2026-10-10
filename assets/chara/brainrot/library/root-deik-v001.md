# root-deik-v001 コンセプト

- root key: deik-
- stem: root-deik
- candidateId: v001
- status: candidate（未評価・未採用）
- 日本語表示名: シメス・デイク・ディクショナッジ
- 英語表示名: To Show · Deik · Dictionudge
- ローマ字名: Shimesu Deik Dictionudge
- PIE: deik-
- 元DBの語義: 示す / to show
- 作成日時(JST): 2026-10-09T22:22:36.094749+09:00

## コンセプト
巨大dictionaryが開いた二枚の頁翼を持つ頭と胸になり、indexの索引タブが骨格の指状突起になる。judgeの丸い若者顔と法服が本の背から生え、短い太い二本の指脚で立つ。

## 身体の構成
巨大dictionaryが開いた二枚の頁翼を持つ頭と胸になり、indexの索引タブが骨格の指状突起になる。judgeの丸い若者顔と法服が本の背から生え、短い太い二本の指脚で立つ。

## 顔・画風・素材
judgeの陶磁器顔はふっくら若く、薄い鼻・大きなガラス虹彩・小さい自信の口。かつらは頭に融合する細かい毛の彫刻、老人のシワなし。
精密な実物3Dコレクティブルフィギュアのスタジオ商品写真。aged leather dictionary binding
### スタイル設計
~~~json
{
  "medium": "physical-3d-collectible",
  "bodyPlan": "open dictionary wing-body with short pointer legs",
  "silhouette": "wide open book over a compact judge-shaped spine and two thick pointing legs",
  "proportion": "bespoke creature proportions",
  "primaryMaterial": "aged leather dictionary binding",
  "secondaryMaterials": [
    "thick rag-paper leaves",
    "warm porcelain judge face",
    "black judicial fabric"
  ],
  "eyeTreatment": "large inset blue glass irises",
  "expression": "confident gentle smile",
  "finish": "precise sculptural surface detail"
}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| dictionary | 辞書 | a giant open dictionary as the entire head and chest / 巨頭と胸の辞書 | Latin dictionarium/dictio ← dicere ← PIE *deik-. 原典で確認した基本語を追加。desk/dishのdiskos経路は別説があるため中心に使わない。 | https://www.etymonline.com/word/dictionary |
| index | 索引、指数 | index tabs and pointing-finger structural projections / 索引タブと指し示す突起 | Latin index/indicare: in- + dicare, with dicare from *deik-. 索引の頁タブと指し示す指で可視化。index fingerではindex部分だけを対象にし、finger自体は別。 | https://www.etymonline.com/word/index |
| judge | 裁判官 | a sculpted young judge head and integrated judicial robe / 若い裁判官頭と法服 | Latin iudex: ius + dicere; dicere belongs to *deik-. 裁判官という現代意味を頭・法服で表す。法服やかつらの語そのものが同根という意味ではない。 | https://www.etymonline.com/word/judge |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 命名根拠
語根内で先頭日本語訳・英語訳・PIE表示を共通とし、最後のモチーフ名だけを候補別にする。
~~~json
{
  "romaji": "Shimesu",
  "kana": "シメス",
  "en": "To Show",
  "selectedMeaningJa": "示す",
  "selectedMeaningEn": "To Show",
  "sourceMeaningField": "ja",
  "sourceMeaningDocument": "app/data/generated-etymon/roots.json",
  "englishDisplaySource": "translation of selectedMeaningJa; original database ja/en remains unchanged"
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-7a6686b7-23db-4b62-a656-81912f37f9d7.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\top100\_sources\root-deik-v001.png
- 原本SHA256: 6f0a915bc8401643b6fcfc949658204529ffb14672a2a37afd63623076c4b8d8
- 最終PNG: root-deik-v001.png
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- Etymonline: dictionary — https://www.etymonline.com/word/dictionary
- Etymonline: index — https://www.etymonline.com/word/index
- Etymonline: judge — https://www.etymonline.com/word/judge

## 全文生成プロンプト
~~~text
Create exactly one original surreal etymology creature as a real, premium PHYSICAL THREE-DIMENSIONAL collectible sculpture, photographed in a studio as a product cutout. True volumetric anatomy, solid sculpted facial planes, actual thick eyeballs or inset glass eyes, intricate tangible materials, realistic reflections, fine construction seams and contact occlusion inside the object. This is not a drawing, cel-shaded illustration, flat anime character or a flat picture pasted onto an object. The integrated words must form the head, body, limbs or large structural wings, not accessories carried by an ordinary character. No unrelated costume or standalone props. The creature may be charming and strange without horror or aged facial features.

STRUCTURE: 巨大dictionaryが開いた二枚の頁翼を持つ頭と胸になり、indexの索引タブが骨格の指状突起になる。judgeの丸い若者顔と法服が本の背から生え、短い太い二本の指脚で立つ。

FACE AS A PHYSICAL SCULPT: judgeの陶磁器顔はふっくら若く、薄い鼻・大きなガラス虹彩・小さい自信の口。かつらは頭に融合する細かい毛の彫刻、老人のシワなし。 Face marks are recessed or painted onto the genuinely curved dimensional sculpt; anime-inspired eyes, if used, are thick inset eyeballs, never a flat illustration.

MATERIALS: aged leather dictionary binding; thick rag-paper leaves; warm porcelain judge face; black judicial fabric. Preserve fine tangible material texture and precise physical craftsmanship.

RECOGNIZABLE BODY PARTS: dictionary = a giant open dictionary as the entire head and chest; index = index tabs and pointing-finger structural projections; judge = a sculpted young judge head and integrated judicial robe. Each part grows from the body or is the body. Shapes used to visualize a modern meaning do not assert the name of every shape is from the same root.

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
    25,
    30,
    490,
    485
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。
