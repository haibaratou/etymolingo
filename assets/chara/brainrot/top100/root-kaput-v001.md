# root-kaput-v001

- 名前: Atama Kaput Cabbagino
- 読み: アターマ・カプト・キャバジーノ
- 印欧祖語: *kaput-
- rootKey: `kaput-`
- 語根ID: `kaput`
- 候補ID: `v001`
- 意味: 頭 / Head
- 状態: `candidate`（人の全体採用チェックは未選択）
- 制作日時: 不明。生成日や時刻をファイル更新日時から推定していません。

## コンセプト

キャベツの頭、かわいい子ウシの顔、牛の胴体と四本の蹄、巨大な上腕二頭筋、キャプテンの帽子と袖なし制服を融合。

## 顔

かわいい子ウシの丸い目と短い牛の口元。おじさん顔にはしない。

表情は個体ごとに判断します。過去の全員点目・U字口という指示は履歴であり、現在のデザイン規則ではありません。

## 英単語と見た目の対応

| English | 意味 | 見た目の部位 | 共有部分・注記 |
|---|---|---|---|
| cabbage | キャベツ | A round cabbage head |  |
| cattle | ウシ・家畜 | A piebald cattle body with four hoofed legs |  |
| biceps | 上腕二頭筋 | Two enormous muscular arms | The -ceps part comes from head; bi- means two. |
| captain | キャプテン・船長 | A captain's hat and cropped sleeveless uniform |  |

普通の接続構造や描かれた動物の種名まで同じ語源だと主張するものではありません。共通するのは上表の英単語・指定した構成要素です。

## 出典

- [cabbage](https://www.etymonline.com/word/cabbage)
- [cattle](https://www.etymonline.com/word/cattle)
- [biceps](https://www.etymonline.com/word/biceps)
- [captain](https://www.etymonline.com/word/captain)

## 原本と保存ファイル

- 候補PNG: `root-kaput-v001.png`（512×512・透過PNG）
- コンセプト: `root-kaput-v001.md`
- 生成記録上の原本: `不明`
- ローカル原本控え: `_sources/root-kaput-v001.png`
- 原本種別: `saved_512_copy_original_unknown`
- 選択PNGに対応する生成原本を特定できないため、保存済み512 PNGを原本控えとして保持。

## レビュー履歴

顔だけの肯定・否定を、キャラクター全体の採用・不採用に変換しません。採用は比較画面で人が別途チェックします。

- この候補への人の全体判断は未選択。自動採用していません。

## プロンプト全文と履歴

以下は再現用の制作記録です。APPROVEDなどの古い文言や全員点目の指定は当時のプロンプトの引用であり、現在の採用状態や新しい指示ではありません。

### 旧デザインからの切り抜きプロンプト全文

記録ファイル: `generation-prompts.json`

```text
Use case: background-extraction / identity-preserve. The supplied image is the APPROVED final three-character design board and is the edit target, not just a loose style reference. Extract ONLY the specified character into ONE individual square PNG game asset with genuine transparent alpha background. Preserve the exact approved character identity, design, colors, materials, proportions, all meaningful components, facial expression and pose. Do not redesign, simplify, change the face, add parts or include either of the other characters. Remove all concrete backdrop, floor, cast ground shadow and any backdrop between limbs. Keep natural shading ON the character itself. No white backdrop, fake checkerboard pattern, scenery, floating props, labels, names, letters, text or watermark. Preserve clear anti-aliased edges and all complete extremities. Put the entire full-body character centered in a square 512 by 512 pixel image, largest comfortable size with a small transparent margin on all four sides; no cropping and no distorted stretching. If an extremity touched the original board edge, complete ONLY that tiny clipped outer contour in the same form rather than cutting it off. Output this single subject with transparent background.
Subject: ONLY the RIGHT creature, Atama Kaput Cabbagino. Preserve its huge layered green CABBAGE head, clearly visible leaf veins and silhouette, and the APPROVED CUTE YOUNG CALF FACE with large glossy round eyes, soft short bovine muzzle and gentle mouth. Preserve the large white/navy ship captain's peaked hat and the cropped open sleeveless captain uniform with gold rank epaulettes and buttons. Keep its extremely large flexed BARE BICEPS on both sides at the same exaggerated scale and pose. Preserve the squat black-and-white PIEBALD CATTLE body and all FOUR short cattle legs ending in cloven hooves. Keep exposed furry cattle belly between uniform panels. Do NOT humanize the body into two legs, age the face, add moustache, hide muscle under sleeves, remove cattle traits or add stone architecture. No left balloon or middle foot character. Entire silhouette, both massive arms, hat and all four hooves in frame.
```

### 背景清掃プロンプト全文

記録ファイル: `generation-prompts.json`

```text
Use case: precise-object-edit / background-extraction cleanup. The supplied image is an already approved individual transparent PNG game asset. Preserve the exact existing character, pose, face, full-body silhouette, colors, every component and all interior pixels as closely as possible. Do NOT redesign or add anything. The only correction is cleaning small disconnected specks left in the transparent background. Remove every isolated floating fleck, white dot, red dot, stray pixel island or fringe mark outside the actual character silhouette. In particular remove the small isolated WHITE BLOB floating ABOVE the captain's hat; retain the APPROVED cute calf face, cabbage head, captain hat and sleeveless uniform, gigantic bare biceps, piebald cattle body and all four hoofed legs. Keep clean natural anti-aliased edges, genuine transparent alpha background everywhere outside the subject, and transparent spaces between limbs. No background color, floor, cast ground shadow, fake checkerboard, text or additional objects. Exactly one full-body subject centered on a square transparent canvas with comfortable margins, no cropping, intended final size 512x512. This is only a narrow alpha-background cleanup of the approved design.
```

### 履歴の顔修正プロンプト全文（現在の全体ルールではない）

記録ファイル: `face-edits-legacy.json`

```text
Use case: precise-object-edit. Input image is the EDIT TARGET, an existing transparent game creature PNG. Change ONLY the calf's face inside the cabbage head to the game's genuinely minimal cute emoticon signature (• ◡ •): exactly two SMALL solid BLACK circular dot eyes and one SMALL thin BLACK clean U-curved closed smile. Eyes are flat pure-black graphic circles painted directly on cabbage/calf face material, no white sclera, detailed iris, rendered eyeballs, highlights, eyelashes, eyebrows, eyelids or sockets. Keep soft rounded short calf muzzle shape, but simplify the front facial detail so it has a tiny closed black U smile, no pronounced nose/nostril detail, lips, grimace, teeth or tongue; no old-man expression or facial wrinkles. Preserve the cabbage HEAD and layered green leaves, leaf veins and realistic material texture, white/navy captain's hat and gold trim, sleeveless open white/navy captain vest with shoulder insignia and gold buttons, BOTH enormous bare BICEPS arms flexing, full brown-and-white piebald CATTLE body, all FOUR hoofed legs, pose, centering, silhouette, camera, colours, texture, realistic 3D look and transparent clear margins EXACTLY as source. The only change is the facial marks: not a redesign or simplification of the creature body. No text or watermark. Return one complete isolated creature on genuinely TRANSPARENT background, preserve alpha, all parts fully visible.
```
