# root-gwei-v008 コンセプト

- root key: gwei-
- stem: root-gwei
- candidateId: v008
- status: candidate（未評価・未採用）
- 日本語表示名: グウェイ・バイオヴァイヴ
- 英語表示名: Gwei · Biovive
- ローマ字名: Gwei Biovive
- PIE: gwei-
- 元DBの語義: 生きる / to live
- 作成日時(JST): 2026-10-11T01:58:15.348817+09:00

## コンセプト
Two eyes, no cyclops. A vivid living creature with a viper tail, abdomen full of clearly visible vitamin tablets in a transparent biological container. Retain the reference anatomy but improve readability. Not a generic snake alone.

## 印欧祖語の原義を見せる主構造
~~~json
{
  "meaningJa": "生きる",
  "source": "root-lessons.json#gwei",
  "primaryImage": "膨らむ胸と力強く跳びはねる有機的な主胴を主体にし、生き生きした呼吸と躍動を大きい姿勢で見せる。",
  "mainBodyPart": "Two eyes, no cyclops. A vivid living creature with a viper tail, abdomen full of clearly visible vitamin tablets in a transparent biological container. Retain the reference anatomy but improve readability. Not a generic snake alone."
}
~~~

## 身体の構成
Two eyes, no cyclops. A vivid living creature with a viper tail, abdomen full of clearly visible vitamin tablets in a transparent biological container. Retain the reference anatomy but improve readability. Not a generic snake alone.

## 顔・画風・素材
Detailed physical 3D collectible with bizarre original anatomy and selective cute face. Vivid varied natural materials, matte fabric and appropriate metal highlights. No glazed porcelain, no 2D illustration. Full body large and clear, true transparent background.
detailed three-dimensional surreal creature with natural part materials
### スタイル設計
~~~json
{}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| biology | 生物学 | 「生物学」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 / 「生物学」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 | biologyは生物学で、前半が命、後半は学問や論じることをいう別の一族。 ドイツとフランスでほぼ同時に、別々に思いつかれた造語。 | https://www.etymonline.com/word/biology |
| vitamin | ビタミン | ビタミンを示す厚い粒と容器の区画を体へ融合する。 / ビタミンを示す厚い粒と容器の区画を体へ融合する。 | Latin vita + amine; vita alone is from PIE *gwei-. 生命を表す Latin vita の成分だけが対象語根で、amine は別成分。 | https://www.etymonline.com/word/vitamin |
| survive | 生きのびる | 「生きのびる」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 / 「生きのびる」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 | surviveは生き残るで、前半が超えて、後半が生きる。 The -vive part means live; sur- means over. | https://www.etymonline.com/word/survive |
| viper | クサリヘビ | クサリヘビを主要な身体部位として明瞭に見せる。 / クサリヘビを主要な身体部位として明瞭に見せる。 | viperはクサリヘビ。ラテン語の「生きた子を産む」を表す名前が短くなった言葉で、前半の「生きた」がこの語根。後半の「産む」は別の語根だよ。ヘビの名前にも「生きる」が入っているんだ！ viperはクサリヘビ。ラテン語の「生きた子を産む」を表す名前が短くなった言葉で、前半の「生きた」がこの語根。後半の「産む」は別の語根だよ。ヘビの名前にも「生きる」が入っているんだ！ | https://www.etymonline.com/word/viper |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 語根共通のキャラクター名

- 日本語名：グウェイ・バイオヴァイヴ
- 英語名：Gwei · Biovive
- 語根ID：gwei
- 命名理由：生きる一族を、特定の動物や栄養剤に限定せず、生命力のある名前にする。
同じ語根のすべての案でこの名前を共通に使う。v番号は絵の案を識別する。
~~~json
{
  "rootId": "gwei",
  "kana": "グウェイ・バイオヴァイヴ",
  "name": "Gwei · Biovive",
  "nameParts": [
    "Gwei",
    "Biovive"
  ],
  "kanaParts": [
    "グウェイ",
    "バイオヴァイヴ"
  ],
  "meaningJa": "生きる",
  "meaningEn": "to live",
  "pie": "*gwei-",
  "nameElements": [
    {
      "part": "Gwei",
      "sourceWords": [],
      "explanationJa": "印欧祖語*gwei-の呼び名を、資料の表記Gweiで使う。"
    },
    {
      "part": "Biovive",
      "sourceWords": [
        "biology",
        "survive",
        "viper"
      ],
      "explanationJa": "biologyのbioとsurviveのviveを組み合わせ、生きる意味を響きに含める。viperにも同じ生きる成分がある。"
    }
  ],
  "reasonJa": "生きる一族を、特定の動物や栄養剤に限定せず、生命力のある名前にする。",
  "sources": [
    {
      "title": "共有学習解説",
      "path": "production/root-lessons.json",
      "rootId": "gwei"
    }
  ]
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-bad7c744-1cbf-4f15-b7ed-7bf64e96c0ee.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\_sources\iterations\root-gwei-v008.png
- 原本SHA256: 4ff7880f6a92db9d53214330cdf8fefbc2831d0235d8639ece4684714658246f
- 最終PNG: root-gwei-v008.png
- 参考画像: []
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- https://www.etymonline.com/word/biology
- https://www.etymonline.com/word/vitamin
- https://www.etymonline.com/word/survive
- https://www.etymonline.com/word/viper

## 全文生成プロンプト
~~~text
Generate one original Wild Wordopia creature as a detailed three-dimensional figure. Whole body, 512x512 final PNG composition, transparent background, no text, no labels. Combine a surreal brainrot creature with selective cute figure proportions or symbolic/anime facial features when they suit this design. Preserve the natural materials of its parts. Never turn the whole body into generic white porcelain, a flat illustration, or a uniform humanoid mascot.

PIE ROOT AND ORIGINAL MEANING: *gwei- / 生きる / to live

RARITY AND PHYSICAL BODY DESIGN (design metadata, not teaching text; do not draw stars or labels): 2/5 stars. Build a compact imaginary creature whose anatomy grows directly from the root meaning and selected etymological objects. Use rounded body masses, short supports, expressive gestures and cute faces. Do not introduce unrelated real animal species, ears, muzzle, fur, paws or tail as a stylistic base. Animal parts are permitted only when that animal is explicitly selected from the root lesson. These are physical body structures, never smaller image framing. Vary humanoid, quadruped, blob, mechanical and other plans. Use a proportionally large head, short torso or limbs, and an original imaginary species with rounded anatomy and gestures. All variants must have equally readable full-body framing in 512x512 transparent PNGs with the same visual presence in the image. Do not shrink the artwork, leave extra empty canvas, lower quality, or give higher tiers larger image framing. Preserve detailed natural materials and recognizable selected anatomy.

AUTHORITATIVE LEARNING EXPLANATION (etymology context; not every mentioned word must be depicted; do not render text):
息をして、動いて、「生きる」。この語根はギリシャ語でbio-や生き物をいう形、ラテン語でvitaやviv-、ゲルマン語でquickという、見た目の違う枝を育てたよ。biologyは生物学で、前半が命、後半は学問や論じることをいう別の一族。biologyのbio-が命の側で、論じる後ろは別の家族。biologicalは生物学の・生物のという形容詞だから、同じ命の枝が見える。biologicalにも同じbio-が残る。zooは動物園。zooに残るzoo-が、ギリシャ語の生き物の側なんだ。

動物学の庭園をいう長い呼び名を縮めた形で、生き物をいうギリシャ語の部分が残っている。amphibianは両生類で、両側をいう別の部分と命が合わさった名前。amphibianの-bianは古いbios「命」の後継の部分で、amphi-「両側」は別の祖先。陸と水の環境に関わる生き方が、その意味なんだ。ラテン語のvitalは生命の・非常に重要な。命に関わる大切さが、普通の重要なことにも広がった。vitaminはビタミンで、命をいうvitaと、別の化学の言葉を合わせて作られた名だよ。vitaminのvit-が、vita「命」を受け継ぐ側だよ。

全部が同じ語根でも、現代のビタミンが全てその化学の種類でもない。surviveは生き残るで、前半が超えて、後半が生きる。surviveのvivが生きる側、sur-「超えて」は別の家族。ほかの人や危険の時を越えて生き続けるという組み合わせで、survivalはその生存の名だ。survivalも同じvivを受け継いでいる。viableは実行可能なで、もとは生きられること。赤ん坊などが生きて育てる意味から、計画がうまく続けられる意味へ広がった。

vividは鮮やかな。もとの意味は生きている・生き生きしただから、色や記憶にも元気な姿が残る。quickは速いけれど、古い英語では生きているという意味だった！　生き生き動くことが速さへ、quicklyは速くという副詞へ育った。動物園、栄養、鮮やかな色、素早い動き、生き残る力。命の姿は一つの形に限らないけれど、言語ごとの枝をたどれば同じ古い生きる感覚でつながる！

viperはクサリヘビ。ラテン語の「生きた子を産む」を表す名前が短くなった言葉で、前半の「生きた」がこの語根。後半の「産む」は別の語根だよ。ヘビの名前にも「生きる」が入っているんだ！

ROOT CORE AND SELECTED VISUAL ELEMENTS. The original root meaning must dominate the main body shape or action. Include the selected derived-word objects below as recognizable anatomy. Bring in as many fitting motifs as this design can support while keeping a clear silhouette. Small props and printed labels cannot substitute for selected anatomy.
- 生きる: 膨らむ胸と力強く跳びはねる有機的な主胴を主体にし、生き生きした呼吸と躍動を大きい姿勢で見せる。 / この案での形: Two eyes, no cyclops. A vivid living creature with a viper tail, abdomen full of clearly visible vitamin tablets in a transparent biological container. Retain the reference anatomy but improve readability. Not a generic snake alone.
- biology: 「生物学」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 / この案での形: 「生物学」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。
- vitamin: ビタミンを示す厚い粒と容器の区画を体へ融合する。 / この案での形: ビタミンを示す厚い粒と容器の区画を体へ融合する。
- survive: 「生きのびる」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 / この案での形: 「生きのびる」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。
- viper: クサリヘビを主要な身体部位として明瞭に見せる。 / この案での形: クサリヘビを主要な身体部位として明瞭に見せる。

OMITTED ELEMENTS ARE EXPLANATION ONLY, NOT VISUAL REQUIREMENTS. The full explanation may mention these words, but this variant does not request them as body parts. Only the core and selected list define the requested anatomy.
- quick: 解説に残すが今回の共通デザインセット外。
- biological: 解説に残すが今回の共通デザインセット外。
- zoo: 解説に残すが今回の共通デザインセット外。
- amphibian: 解説に残すが今回の共通デザインセット外。
- vital: 解説に残すが今回の共通デザインセット外。
- survival: 解説に残すが今回の共通デザインセット外。
- viable: 解説に残すが今回の共通デザインセット外。
- vivid: 解説に残すが今回の共通デザインセット外。
- quickly: 解説に残すが今回の共通デザインセット外。

THIS VARIANT'S BODY COMPOSITION:
Two eyes, no cyclops. A vivid living creature with a viper tail, abdomen full of clearly visible vitamin tablets in a transparent biological container. Retain the reference anatomy but improve readability. Not a generic snake alone.

THIS VARIANT'S FACE, MATERIALS AND COLORS:
Detailed physical 3D collectible with bizarre original anatomy and selective cute face. Vivid varied natural materials, matte fabric and appropriate metal highlights. No glazed porcelain, no 2D illustration. Full body large and clear, true transparent background.

Show all selected body parts within the frame. Face, color and joints are stylistic choices, not additional vocabulary claims. Do not add new teaching motifs absent from the explanation. A future song may teach the whole explanation; this image highlights its root core and selected words.
AUTHORITATIVE USER REVISION NOTES:
gwei / 生きる
【個別候補 v007】
尻尾は　ヴァイパーだろう。名前も　バイオヴァイヴ　みたいなの方がわかりやすいだろう。体の中にビタミン剤をたっぷり。目は2つでいい。単眼にする意味がない。


Modify reference v007. Preserve its recognizable anatomy except explicit requested changes.
~~~

## 除外・制約プロンプト
~~~text

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
    28,
    21,
    496,
    473
  ]
}
~~~

## 評価履歴
人間による評価は未実施。候補を表示しただけで採用しない。

## 学習解説との対応

解説先行方式以前の実送信記録から復旧した旧作。現在の学習解説への適合は未確認。


## 実送信プロンプトの記録

画像生成へ実際に送信した全文を採用。後から変わった設計定義を実送信指示として扱わない。

~~~json
{
  "sentPromptSha256": "c66bb2e0e732e2e6d2c211d203abd469e824e7b97192409278b25401ce1428d8",
  "evidence": {
    "kind": "explicit-actual-sent-prompt-file",
    "file": "D:\\etymolingo\\work\\wildwordopia\\production\\memo-gwei-v008.prompt.txt",
    "fileSha256": "3feb3ebde5406f2736e77919d1a85770f34f26c5e6e9652133ca2621ed12ff2b",
    "rootId": "gwei",
    "candidateId": "v008",
    "generatedSource": "C:\\Users\\haiba\\.codex\\generated_images\\01a11c2c-2aea-7d31-acf8-4d418bf98912\\exec-bad7c744-1cbf-4f15-b7ed-7bf64e96c0ee.png",
    "sourceMatched": null
  },
  "generationTimeCreativeSnapshotSha256": null,
  "designRevisionNote": null
}
~~~
