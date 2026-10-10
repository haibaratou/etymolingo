# root-bhel2-v001

- 名前: Fukura Bhel Bowloon
- 読み: フクラ・ベル・ボウルーン
- 印欧祖語: *bhel-(2)
- rootKey: `bhel-2`
- 語根ID: `bhel2`
- 候補ID: `v001`
- 意味: 膨らむ / Blow / swell
- 状態: `candidate`（人の全体採用チェックは未選択）
- 制作日時: 不明。生成日や時刻をファイル更新日時から推定していません。

## コンセプト

膨れた赤い風船が頭と胴体。陶器のボウルが口と側面を作り、サッカーボール、バスケットボール、赤い縫い目のベースボールが融合した丸い多球体のクリーチャー。

## 顔

風船の素材上に顔を置く。表情はこの候補PNGを確認し、別途人が判定する。

表情は個体ごとに判断します。過去の全員点目・U字口という指示は履歴であり、現在のデザイン規則ではありません。

## 英単語と見た目の対応

| English | 意味 | 見た目の部位 | 共有部分・注記 |
|---|---|---|---|
| balloon | 風船 | An inflated red latex head and body |  |
| bowl | ボウル | A hollow ceramic mouth and side bowls | The container sense of bowl is intended, not another homograph. |
| soccer ball | サッカーボール | Black-and-white soccer balls integrated into the body and foot | The shared word is ball, meaning a round object. Soccer itself has separate ancestry. |
| basketball | バスケットボール | An orange basketball on the upper side | The ball component shares the root; basket has separate ancestry. |
| baseball | ベースボール | A white baseball foot with curved red stitches | The ball component shares the root; base has separate ancestry. |

普通の接続構造や描かれた動物の種名まで同じ語源だと主張するものではありません。共通するのは上表の英単語・指定した構成要素です。

## 出典

- [ball](https://www.etymonline.com/word/ball)
- [bowl](https://www.etymonline.com/word/bowl)
- [balloon](https://www.etymonline.com/word/balloon)
- [basketball](https://www.etymonline.com/word/basketball)
- [baseball](https://www.etymonline.com/word/baseball)

## 原本と保存ファイル

- 候補PNG: `root-bhel2-v001.png`（512×512・透過PNG）
- コンセプト: `root-bhel2-v001.md`
- 生成記録上の原本: `不明`
- ローカル原本控え: `_sources/root-bhel2-v001.png`
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
Subject: ONLY the LEFT creature, Fukura Bhel Bowloon. Keep the asymmetric bulging glossy red inflated balloon head/body, its tied red balloon knot at the upper left, funny protruding mismatched round eyes, soccer ball at upper right, orange basketball on upper-left side, cream ceramic hollow bowl mouth and ceramic side bowls. Keep the huge classic black-and-white panelled soccer ball as its LOWER LEFT rolling foot and huge white leather baseball with curved RED stitches as its LOWER RIGHT rolling foot. The sports ball surfaces must remain plainly distinguishable from red latex and ceramic. It is exactly the approved bizarre living balloon / sporting-balls / bowl creature, not an ordinary balloon or a collection of props. Entire body and both sporting-ball feet complete and visible. Do not add human arms or feet. No center foot character or cabbage captain.
```

### 履歴の顔修正プロンプト全文（現在の全体ルールではない）

記録ファイル: `face-edits-legacy.json`

```text
Use case: precise-object-edit. Input image is the EDIT TARGET, an existing transparent game creature PNG. Change ONLY its facial expression to the game's minimal cute emoticon signature (• ◡ •): exactly two SMALL solid BLACK circular dot eyes and one SMALL thin BLACK clean U-curved closed smile. No sclera, white eyes, iris, detailed pupils, eye highlights, eyelashes, eyebrows, teeth, tongue, lips, or nose. Paint these three black marks directly on the realistic glossy RED balloon skin of the central face, keeping the face compact. Existing protruding eyeballs become smooth red balloon bumps with little black dot eyes, preserving their anatomical locations. Put a tiny closed U smile on the red facial surface between/below the dot eyes, ABOVE the ceramic bowl rim. Preserve the large hollow ceramic bowl as exactly the same bowl construction; it is not a gaping expressive grin. Preserve ALL other details exactly: red inflated balloon body and knot, basketball upper left, soccer ball upper right, side ceramic bowls, hollow ceramic front bowl, soccer ball lower left, stitched white baseball lower right, their shapes and locations, full silhouette, camera, textures, realistic 3D materials, colours, lighting, proportions, centering and clear margins. This is a surgical face-only edit, not a redesign or cute-cartoon restyling. No text or watermark. Return one complete isolated creature on genuinely TRANSPARENT background, preserve alpha, all body parts visible.
```
