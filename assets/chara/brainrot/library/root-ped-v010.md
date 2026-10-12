# root-ped-v010 コンセプト

- root key: ped-
- stem: root-ped
- candidateId: v010
- status: candidate（未評価・未採用）
- 日本語表示名: ペド・フットペダ
- 英語表示名: Ped · Footpeda
- ローマ字名: Ped Footpeda
- PIE: ped-
- 元DBの語義: 足 / foot
- 作成日時(JST): 2026-10-11T00:12:29.010931+09:00

## コンセプト
足・サッカーボール・ペダル・チェスポーンの異常合体クリーチャー。足を主役にし、左右の腕はそれぞれ肩から手まで一本の連続した構造。腕の途中の分岐や余分な肢を削る。

## 印欧祖語の原義を見せる主構造
~~~json
{
  "meaningJa": "足",
  "source": "root-lessons.json#ped",
  "primaryImage": "大きい足首から下の形が胴の大半を占め、踏み出す足と地面の関係を主役にする。",
  "mainBodyPart": "足・サッカーボール・ペダル・チェスポーンの異常合体クリーチャー。足を主役にし、左右の腕はそれぞれ肩から手まで一本の連続した構造。腕の途中の分岐や余分な肢を削る。"
}
~~~

## 身体の構成
足・サッカーボール・ペダル・チェスポーンの異常合体クリーチャー。足を主役にし、左右の腕はそれぞれ肩から手まで一本の連続した構造。腕の途中の分岐や余分な肢を削る。

## 顔・画風・素材
高品質な立体フィギュア。部位本来の鮮やかな色と質感、可愛さは異形に合わせて一部へ。全身の白い陶器化・釉薬光沢・ぬめり・乳児顔・2Dイラストは禁止。
detailed three-dimensional surreal creature with natural part materials
### スタイル設計
~~~json
{}
~~~

## 英単語と部品
| English | 意味 | 身体の部品 | 共有部分・経路・注記 | Source |
|---|---|---|---|---|
| foot | 足 | 甲、かかと、つま先のある巨大な足を主胴そのものにする。 上記の身体構成に自然に融合。 / 甲、かかと、つま先のある巨大な足を主胴そのものにする。 上記の身体構成に自然に融合。 | Old English fot → Germanic *fōts → *ped-. 身体の足を指す語。タコという生き物の英語名を、このモチーフの同根語として追加しない。 | https://www.etymonline.com/word/foot |
| football | フットボール | 「フットボール」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 上記の身体構成に自然に融合。 / 「フットボール」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 上記の身体構成に自然に融合。 | footballは足と球の組み合わせで、前半だけがこの一族。 1424年のスコットランドの法律で禁止された遊びだった。 | https://www.etymonline.com/word/football |
| pedal | ペダル | 足で踏むペダルと回転軸を脚の関節そのものへ融合し、踏む足の動きが分かる形にする。 上記の身体構成に自然に融合。 / 足で踏むペダルと回転軸を脚の関節そのものへ融合し、踏む足の動きが分かる形にする。 上記の身体構成に自然に融合。 | Latin pedalis from pes/pedis → *ped-. 足に関する Latin pedalis から。踏み板そのものを表す英単語で、足の姿勢だけと区別する。 | https://www.etymonline.com/word/pedal |
| pawn | チェスのポーン | チェスのポーンの厚い駒形を足の支持節へ融合する。貸金の意味の語は扱わない。 上記の身体構成に自然に融合。 / チェスのポーンの厚い駒形を足の支持節へ融合する。貸金の意味の語は扱わない。 上記の身体構成に自然に融合。 | French peon → Latin pedonem/pes → *ped-. チェスの駒を表す pawn n.2 のみ。質入れ・担保を表す pawn n.1 とは別語。 | https://www.etymonline.com/word/pawn |

複合語は対象語根に由来する部分のみを共有する。現代語義を描く象徴の物体名まで同根だとは扱わない。

## 語根共通のキャラクター名

- 日本語名：ペド・フットペダ
- 英語名：Ped · Footpeda
- 語根ID：ped
- 命名理由：足という芯がすぐ分かり、走る・踏む・歩く姿のどれにも使える名前にする。
同じ語根のすべての案でこの名前を共通に使う。v番号は絵の案を識別する。
~~~json
{
  "rootId": "ped",
  "kana": "ペド・フットペダ",
  "name": "Ped · Footpeda",
  "nameParts": [
    "Ped",
    "Footpeda"
  ],
  "kanaParts": [
    "ペド",
    "フットペダ"
  ],
  "meaningJa": "足",
  "meaningEn": "foot",
  "pie": "*ped-",
  "nameElements": [
    {
      "part": "Ped",
      "sourceWords": [],
      "explanationJa": "印欧祖語*ped-の呼び名を、資料の表記Pedで使う。"
    },
    {
      "part": "Footpeda",
      "sourceWords": [
        "foot",
        "pedal"
      ],
      "explanationJa": "footとpedalを組み合わせた固有名。ゲルマン語の足と、ラテン語の足からできた枝を重ねる。"
    }
  ],
  "reasonJa": "足という芯がすぐ分かり、走る・踏む・歩く姿のどれにも使える名前にする。",
  "sources": [
    {
      "title": "共有学習解説",
      "path": "production/root-lessons.json",
      "rootId": "ped"
    }
  ]
}
~~~

## 制作・保存記録
- Tool: built-in ImageGen
- 生成原本: C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-750d5cdd-6ca3-4b87-a971-992bb5b13671.png
- 保存原本: D:\etymolingo\work\wildwordopia\sample\_sources\iterations\root-ped-v010.png
- 原本SHA256: f2ce274d8d65ae7068dc0cbe578a29446ed235a78aa594a24e4271ce722890c7
- 最終PNG: root-ped-v010.png
- 参考画像: []
- 仕上げ: PowerShell System.Drawingで縦横比維持、512x512、外周16px以上の透過余白。主要部品の描き直しなし。

## 語源の出典
- https://www.etymonline.com/word/foot
- https://www.etymonline.com/word/football
- https://www.etymonline.com/word/pedal
- https://www.etymonline.com/word/pawn

## 全文生成プロンプト
~~~text
Generate one original Wild Wordopia creature as a detailed three-dimensional figure. Whole body, 512x512 final PNG composition, transparent background, no text, no labels. Combine a surreal brainrot creature with selective cute figure proportions or symbolic/anime facial features when they suit this design. Preserve the natural materials of its parts. Never turn the whole body into generic white porcelain, a flat illustration, or a uniform humanoid mascot.

PIE ROOT AND ORIGINAL MEANING: *ped- / 足 / foot

RARITY AND PHYSICAL BODY DESIGN (design metadata, not teaching text; do not draw stars or labels): 2/5 stars. Build a compact imaginary creature whose anatomy grows directly from the root meaning and selected etymological objects. Use rounded body masses, short supports, expressive gestures and cute faces. Do not introduce unrelated real animal species, ears, muzzle, fur, paws or tail as a stylistic base. Animal parts are permitted only when that animal is explicitly selected from the root lesson. These are physical body structures, never smaller image framing. Vary humanoid, quadruped, blob, mechanical and other plans. Use a proportionally large head, short torso or limbs, and an original imaginary species with rounded anatomy and gestures. All variants must have equally readable full-body framing in 512x512 transparent PNGs with the same visual presence in the image. Do not shrink the artwork, leave extra empty canvas, lower quality, or give higher tiers larger image framing. Preserve detailed natural materials and recognizable selected anatomy.

AUTHORITATIVE LEARNING EXPLANATION (etymology context; not every mentioned word must be depicted; do not render text):
地面を踏む「足」。この語根は、歩く足から長さや道具の名前へ、いろいろな地域の枝を伸ばしたよ。ゲルマン語では古いpの音がfへ対応する変化があり、英語のfootになった。feetはその複数形。古い母音の変化が残っているので、足が二つでも単純に語尾を足す形ではないんだ。footballは足と球の組み合わせで、前半だけがこの一族。footballのfoot-が足の側で、球の部分は別の祖先。ラテン語では足をいう形がped-になり、pedalは足で動かすペダルにつながる。

pawnはチェスのポーンだけど、古い名は歩いて戦う兵士。騎馬の兵士と違って、自分の足で進む人から駒の名になったんだ。質屋で預ける品をいう同じ綴りは別の語だから、混ぜないでね。expeditionは遠征。expeditionの-ped-が足の側で、外へをいう先頭とは別の語根。古い動詞の中身は「足を外へ解く」、つまり足の束縛をほどいて出発の準備をすることだった。ギリシャ語の枝では足がpodの形になる。tripodは三脚で、前半が三、後半が足。tripodの-podが足、tri-「三」は別の家族だよ。

カメラの台そのものの語源ではなく、三つの支える足が名前の中にいるんだ。pilotはパイロットで、昔は船の水先案内人。pilotの昔のギリシャ語の枝では、pod-「足」をもとに見る伝統的な説明がある。語源をたどると、船を操るオールをいう古い語に、足を表す部分がいたと考えられている。今の航空機の操縦者へは、さらに後で意味が広がった。ペルシャ語の枝から来たpajamasはパジャマ。pajamasのpa-がペルシャ語の足・脚で、衣服をいう後ろとは別の祖先。もとの組み合わせは脚・足の衣服で、ズボンから寝間着の名へつながった。

足の音がf、ped、podになり、地域の違いを越えて再会する。ポーンが歩き、ペダルを踏み、三脚が支え、パジャマが足を包む。歩く足も、踏む足も、支える足も、古い「足」の名を受け継いでいるんだ！

ROOT CORE AND SELECTED VISUAL ELEMENTS. The original root meaning must dominate the main body shape or action. Include the selected derived-word objects below as recognizable anatomy. Bring in as many fitting motifs as this design can support while keeping a clear silhouette. Small props and printed labels cannot substitute for selected anatomy.
- 足: 大きい足首から下の形が胴の大半を占め、踏み出す足と地面の関係を主役にする。 / この案での形: 足・サッカーボール・ペダル・チェスポーンの異常合体クリーチャー。足を主役にし、左右の腕はそれぞれ肩から手まで一本の連続した構造。腕の途中の分岐や余分な肢を削る。
- foot: 甲、かかと、つま先のある巨大な足を主胴そのものにする。 / この案での形: 甲、かかと、つま先のある巨大な足を主胴そのものにする。 上記の身体構成に自然に融合。
- football: 「フットボール」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 / この案での形: 「フットボール」が読み取れる姿・動作・構造を3Dの身体モチーフにする。本文で教えるこの語の意味と共有成分を基準に選び、原義の構造を隠さない。文字を書いて済ませず、別の物体名まで同根とは教えない。 上記の身体構成に自然に融合。
- pedal: 足で踏むペダルと回転軸を脚の関節そのものへ融合し、踏む足の動きが分かる形にする。 / この案での形: 足で踏むペダルと回転軸を脚の関節そのものへ融合し、踏む足の動きが分かる形にする。 上記の身体構成に自然に融合。
- pawn: チェスのポーンの厚い駒形を足の支持節へ融合する。貸金の意味の語は扱わない。 / この案での形: チェスのポーンの厚い駒形を足の支持節へ融合する。貸金の意味の語は扱わない。 上記の身体構成に自然に融合。

OMITTED ELEMENTS ARE EXPLANATION ONLY, NOT VISUAL REQUIREMENTS. The full explanation may mention these words, but this variant does not request them as body parts. Only the core and selected list define the requested anatomy.
- feet: 語根の固定デザインセット外。解説には残すが、この新案の造形には追加しない。
- expedition: 語根の固定デザインセット外。解説には残すが、この新案の造形には追加しない。
- tripod: 語根の固定デザインセット外。解説には残すが、この新案の造形には追加しない。
- pilot: 語根の固定デザインセット外。解説には残すが、この新案の造形には追加しない。
- pajamas: 語根の固定デザインセット外。解説には残すが、この新案の造形には追加しない。

THIS VARIANT'S BODY COMPOSITION:
足・サッカーボール・ペダル・チェスポーンの異常合体クリーチャー。足を主役にし、左右の腕はそれぞれ肩から手まで一本の連続した構造。腕の途中の分岐や余分な肢を削る。

THIS VARIANT'S FACE, MATERIALS AND COLORS:
高品質な立体フィギュア。部位本来の鮮やかな色と質感、可愛さは異形に合わせて一部へ。全身の白い陶器化・釉薬光沢・ぬめり・乳児顔・2Dイラストは禁止。

Show all selected body parts within the frame. Face, color and joints are stylistic choices, not additional vocabulary claims. Do not add new teaching motifs absent from the explanation. A future song may teach the whole explanation; this image highlights its root core and selected words.

AUTHORITATIVE USER REVISION NOTES:
ped / 足
【個別候補 v004】
良いが、腕が途中で分かれてるのはなんだ？


Use the explicit requested changes while preserving the root meaning and fixed vocabulary. Reference images, when supplied, are starting anatomy only; apply these revisions. Do not reproduce text from the source image.
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
    16,
    16,
    482,
    487
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
  "sentPromptSha256": "57ac3f99354fc2a42bb57f68255644ffafe5ddd4c23eb2911dfbd1c0df8e9207",
  "evidence": {
    "kind": "explicit-actual-sent-prompt-file",
    "file": "D:\\etymolingo\\work\\wildwordopia\\production\\memo-ped-v010.prompt.txt",
    "fileSha256": "c57d342ea86b148b6fe685cad55b0f8d1e06486fc2e1c0b50206e18a747b2878",
    "rootId": "ped",
    "candidateId": "v010",
    "generatedSource": "C:\\Users\\haiba\\.codex\\generated_images\\01a11c2c-2aea-7d31-acf8-4d418bf98912\\exec-750d5cdd-6ca3-4b87-a971-992bb5b13671.png",
    "sourceMatched": null
  },
  "generationTimeCreativeSnapshotSha256": null,
  "designRevisionNote": null
}
~~~
