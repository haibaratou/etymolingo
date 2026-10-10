# root-ped-v001

- 名前: Ashi Ped Pajamino
- 読み: アシ・ペド・パジャミーノ
- 印欧祖語: *ped-
- rootKey: `ped-`
- 語根ID: `ped`
- 候補ID: `v001`
- 意味: 足 / Foot
- 状態: `candidate`（人の全体採用チェックは未選択）
- 制作日時: 不明。生成日や時刻をファイル更新日時から推定していません。

## コンセプト

大きな足裏の頭、木製チェスのポーンの胴体、パジャマ、自転車のペダルの手、金属の三脚と三本の裸足を融合。タコは含めない。

## 顔

大きな足裏に顔を配置する。表情はこの候補PNGを確認し、別途人が判定する。

表情は個体ごとに判断します。過去の全員点目・U字口という指示は履歴であり、現在のデザイン規則ではありません。

## 英単語と見た目の対応

| English | 意味 | 見た目の部位 | 共有部分・注記 |
|---|---|---|---|
| foot | 足 | A giant foot head and three bare feet |  |
| pawn | チェスのポーン | A polished wooden chess-pawn torso | The chess-piece sense descends from a foot soldier. The pledge/loan sense of pawn is a different word. |
| pajamas | パジャマ | Striped pajama shirt and dotted pajama shorts | The Persian pa-/pā- component means leg/foot; the jamah clothing component has separate ancestry. |
| pedal | ペダル | Two rectangular bicycle-pedal hands |  |
| tripod | 三脚 | A three-legged metal tripod lower body | The -pod component means foot; tri- means three. |

普通の接続構造や描かれた動物の種名まで同じ語源だと主張するものではありません。共通するのは上表の英単語・指定した構成要素です。

## 出典

- [foot](https://www.etymonline.com/word/foot)
- [pawn](https://www.etymonline.com/word/pawn)
- [pajamas](https://www.etymonline.com/word/pajamas)
- [pedal](https://www.etymonline.com/word/pedal)
- [tripod](https://www.etymonline.com/word/tripod)

## 原本と保存ファイル

- 候補PNG: `root-ped-v001.png`（512×512・透過PNG）
- コンセプト: `root-ped-v001.md`
- 生成記録上の原本: `不明`
- ローカル原本控え: `_sources/root-ped-v001.png`
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
Subject: ONLY the CENTER creature, Ashi Ped Pajamino. Preserve the giant upright bare human FOOT head with five toes pointing upward and solemn face on its sole. Keep the conspicuous dark polished wooden CHESS PAWN torso with round top bulb, narrowing neck and broad stepped base. Preserve the open blue-and-cream striped pajama shirt and red/pale-dotted mismatched pajama shorts. Keep both rectangular bicycle-PEDAL hands with short metal crank arms, one raised and one lower. Preserve the metal three-legged TRIPOD lower body, telescoping leg segments, central hub and braces, and THREE bare human feet (two front, one rear, all readable). All FIVE motifs remain plainly recognizable. No octopus or tentacle, no ordinary human torso, no shoes. Preserve the exact current material realism and arrangement. No left balloon creature or right cabbage captain.
```

### 背景清掃プロンプト全文

記録ファイル: `generation-prompts.json`

```text
Use case: precise-object-edit / background-extraction cleanup. The supplied image is an already approved individual transparent PNG game asset. Preserve the exact existing character, pose, face, full-body silhouette, colors, every component and all interior pixels as closely as possible. Do NOT redesign or add anything. The only correction is cleaning small disconnected specks left in the transparent background. Remove every isolated floating fleck, white dot, red dot, stray pixel island or fringe mark outside the actual character silhouette. In particular remove the tiny isolated RED DOT floating just to the RIGHT of the foot head; retain its giant foot head, wood pawn body, blue-striped pajama shirt, red-dot pajama shorts, two pedal hands, tripod legs and three feet. Keep clean natural anti-aliased edges, genuine transparent alpha background everywhere outside the subject, and transparent spaces between limbs. No background color, floor, cast ground shadow, fake checkerboard, text or additional objects. Exactly one full-body subject centered on a square transparent canvas with comfortable margins, no cropping, intended final size 512x512. This is only a narrow alpha-background cleanup of the approved design.
```

### 履歴の顔修正プロンプト全文（現在の全体ルールではない）

記録ファイル: `face-edits-legacy.json`

```text
Use case: precise-object-edit. Input image is the EDIT TARGET, an existing transparent game creature PNG. Change ONLY its facial expression on the peach sole-of-foot head to the game's minimal cute emoticon signature (• ◡ •): exactly two SMALL solid BLACK circular dot eyes and one SMALL thin BLACK clean U-curved closed smile. The eyes must be flat black circles painted directly onto foot skin, with NO white sclera, iris, eye sockets, rendered eyeballs, pupils, glints, lashes, eyebrows, eyelids, old-man facial wrinkles or serious expression. Tiny closed smile, no teeth, tongue, lips, nose. Erase the realistic human eye features and restore natural foot skin behind them before applying black dot eyes. Keep the entire foot head and five toe crown shape, realistic skin surface material elsewhere, wooden chess-pawn torso, blue/white striped pajama shirt, red/white polka-dot pajama shorts, both black metal bicycle-pedal hands, three-legged shiny metal tripod structure, all THREE flesh foot ends, pose, centering, full silhouette, camera, colours, texture, realistic 3D look and transparent margins EXACTLY as source. Surgical face-only edit; do not simplify or omit a single motif, do not convert the body into a flat cartoon. No text or watermark. Return one complete isolated creature on genuinely TRANSPARENT background, preserve alpha, all parts fully visible.
```

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：アシ・ペド・パジャミーノ
- 英語表示名：Foot · Ped · Pajamino
- 元のローマ字名：Ashi Ped Pajamino
- 英語名の三要素：Foot / Ped / Pajamino
- 翻訳する先頭部分：Ashi → Foot
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：アシ・ペド・パジャミーノ
- 訂正前の英語名：Foot · Ped · Pajamino
- 現在の混成ローマ字名：Ashi Ped Pajamino
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「足」から「足」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でAshi/Footを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：足 / foot
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：足 / Foot
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.025](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
