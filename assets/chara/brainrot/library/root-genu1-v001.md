# root-genu1-v001

- 名前: Hiza Genu Hexaknee
- 読み: ヒザ・ゲヌ・ヘクサニー
- 印欧祖語: *genu-1
- rootKey: `genu-1`
- 語根ID: `genu`
- 候補ID: `v001`
- 意味: ひざ・角 / Knee · Angle
- 状態: `candidate`（人の全体採用チェックは未選択）
- 制作日時: 不明。生成日や時刻をファイル更新日時から推定していません。

## コンセプト

ベージュの玩具の関節で構成された、膝を曲げて立つクリーチャー。曲がった膝を読み取りやすくし、胴体前面に六角形のシアンの顔、左右の腕先に五角形の黄色い手、下部に八角形のオレンジの足を融合する。足面にはシアンの対角線を大きく出す。最終PNGは生々しい人間の皮膚ではなく、丸い関節と立体玩具の素材で表現している。

## 顔

六角形の面に収まるシンプルなグラフィックの顔。

表情は個体ごとに判断します。過去の全員点目・U字口という指示は履歴であり、現在のデザイン規則ではありません。

## 英単語と見た目の対応

| English | 意味 | 見た目の部位 | 共有部分・注記 |
|---|---|---|---|
| knee | ひざ | 巨大な曲がった膝の胴体 |  |
| hexagon | 六角形 | 正六角形の顔 | The -gon part means angle; hexa- means six. |
| pentagon | 五角形 | 五角形の手 | The -gon part means angle; penta- means five. |
| octagon | 八角形 | 八角形の足 | The -gon part means angle; octa- means eight. |
| diagonal | 対角線 | 八角形の足を横切る光る対角線 | The -gon part means angle; dia- means across. |

普通の接続構造や描かれた動物の種名まで同じ語源だと主張するものではありません。共通するのは上表の英単語・指定した構成要素です。

## 出典

- [knee](https://www.etymonline.com/word/knee)
- [hexagon](https://www.etymonline.com/word/hexagon)
- [pentagon](https://www.etymonline.com/word/pentagon)
- [octagon](https://www.etymonline.com/word/octagon)
- [diagonal](https://www.etymonline.com/word/diagonal)

## 原本と保存ファイル

- 候補PNG: `root-genu1-v001.png`（512×512・透過PNG）
- コンセプト: `root-genu1-v001.md`
- 生成記録上の原本: `C:\Users\haiba\.codex\generated_images\01a11c2c-2aea-7d31-acf8-4d418bf98912\exec-78b630b5-64a5-437a-9eec-89fec1a52585.png`
- ローカル原本控え: `_sources/root-genu1-v001.png`
- 原本種別: `generated_original`

## レビュー履歴

顔だけの肯定・否定を、キャラクター全体の採用・不採用に変換しません。採用は比較画面で人が別途チェックします。

- この候補への人の全体判断は未選択。自動採用していません。

## プロンプト全文と履歴

以下は再現用の制作記録です。APPROVEDなどの古い文言や全員点目の指定は当時のプロンプトの引用であり、現在の採用状態や新しい指示ではありません。

### 生成プロンプト全文

記録ファイル: `generation-prompts-new-roots.json`

```text
Use case: stylized-concept. Asset type: original surreal game-creature transparent PNG. Make a funny 3D geometric KNEE MONSTER built from a LARGE beige silicone ARTICULATED TOY KNEE JOINT, the sort of nonhuman plastic joint on an educational mannequin. The main body is the bent V-shaped joint with a round molded kneecap, completely artificial matte silicone and visible mechanical seams. No real human flesh, no naked person, no medical gore. Its face is a large cyan regular HEXAGON plate with exactly SIX sides mounted over the kneecap. Paint TWO VERY SMALL solid round black DOT EYES and ONE SHORT thin U-shaped black SMILE in the center of the flat cyan face, like (• ◡ •), no whites, iris, pupils, eyebrows, glossy reflections, lips, teeth or tongue. Two articulated beige toy arms end in bright yellow regular PENTAGON plates with exactly FIVE sides as palms. Two lower toy shins end in broad orange OCTAGON plates with exactly EIGHT sides as feet, each with one wide cyan DIAGONAL line linking non-neighboring vertices. Show all geometric vertices clearly. Absurd brainrot-style impossible creature, physically real silicone/plastic materials with a minimal flat graphic friendly face. Every component fused into the body. Full body, square composition, soft studio lighting, at least 6 percent blank transparent padding ALL sides, no crops, no floor, no backdrop, no labels, no watermark. Highlight unmistakable bent knee+hexagon head+pentagon hands+octagon feet+diagonals.
```

### 現在の顔に対応する修正プロンプト全文

記録ファイル: `face-edits-root.json`

```text
Use case: precise-object-edit. Edit target: the attached original character cutout. Make the FACE ONLY match the new game-wide minimal emoticon expression, while preserving every other character feature and all word motifs, material texture, colour and pose.
Replace ONLY the cyan six-sided face expression. Fill the existing realistic eyes and open mouth/tongue with matching continuous blue material and add TWO very small round solid black dots and a single short thin U smile centrally. No eyebrow ridges, cheeks, eye sockets, lips or realistic face sculpting. Preserve exact hexagon silhouette with six sides, bare knee body, pentagon hands with five sides, octagon feet with eight sides and diagonal stripe.
Mandatory series face language: extremely simple flat ink-black DOT EYES and ONE SMALL thin CURVED SMILE, visually (• ◡ •), like a minimalist adventure cartoon emoticon. Exactly two solid round/vertical oval black dot eyes; no whites, irises, pupils, reflections, eyelashes, brow ridges or detailed facial musculature. The mouth is one short clean U-shaped dark curve, no visible teeth/tongue/lips. Facial marks are small in the center of face with wide spacing and lots of blank space, printed/painted directly on the creature's material. Keep realistic 3D absurd chimera body texture, but face stays minimalist 2D graphical black dots and curve. This face rule OVERRIDES any mention of large glossy eyes, pupil, toothy grins, infant/animal realism or detailed eye shapes in subject description.
Keep entire creature within square image including tips/feet with empty transparent margins; true transparent alpha background and no new backdrop or floor. No labels, no watermark. Do not redesign or simplify the body.
```
