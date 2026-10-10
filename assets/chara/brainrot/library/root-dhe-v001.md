# root-dhe-v001 コンセプト

- 候補キー：dhē-/v001
- 親候補：なし。構造の異なる新規案。
- PNG：root-dhe-v001.png
- status：candidate
- キャラクター名：Oku Dhe Factoff
- 日本語読み：オク・デー・ファクトフ
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*dhe-「置く」
- root key：dhē-
- 既定stem：root-dhe（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：008
- 作成日時：2026-10-09T17:58:59+09:00

## コンセプト

横長で低い工場が巨大な主胴体。正面に若い巨大な顔、脚は机が透けるオフィス建物。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| factory | 工場 | 工業屋根と製造区画がある横長で低い工場の主胴体 | French factorie / Late Latin factorium ← Latin factor ← facere「作る」< PIE *dhe-。 工場建物・製造設備で現代意味を描く。設備の個別名まで同根とは主張しない。 | [factory](https://www.etymonline.com/word/factory) |
| office | オフィス | 事務机が見えるガラスのオフィス建物の短い四脚 | Latin officium（opificium の短縮）= ops + facere。facere < PIE *dhe-。 共有部分は officium の facere 部分。事務机が見える業務用建物で現代意味を示す。 | [office](https://www.etymonline.com/word/office) |
| face | 顔 | 工場正面へ融合した巨大で若い顔 | French face ← Vulgar Latin *facia ← Latin facies、facere「作る」と関連するとされる < PIE *dhe-。 faciesはfacereの一族とされるが、Etymonlineは関連を留保付きで説明する。確定した直接派生とは断定しない。 | [face](https://www.etymonline.com/word/face) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

若い巨大なリアルな顔。複雑な虹彩の大きな目、丸い頬、小さく自然に笑う口。老人顔・髭・皺・点目なし。

スタイル：Photoreal surreal architecture creature with brick factory, exposed manufacturing machinery, clear office glass and youthful softly textured facial surface; believable tactile materials。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：factory / office / face。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[factory](https://www.etymonline.com/word/factory) / [office](https://www.etymonline.com/word/office) / [face](https://www.etymonline.com/word/face)。
- ローカル対応：top30/roots-plan.json rank=8, rootKey=dhē-, htmlStem=dhe。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-29897e70-d0cd-459e-a682-d2ca8b1e4a7c.png
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-6a027032-ead6-4787-94ca-9b3812229a78.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-dhe-v001.png
- 派生関係：新規生成 → ImageGenで原本のクリップを余白修正 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Edit the referenced image ONLY to widen the square transparent framing and reveal the entire leftmost and rightmost office-block feet without any crop. Preserve this exact wide factory-bodied creature, its large youthful realistic face, sawtooth industrial roofs, chimneys, visible manufacturing areas, and all four glass office legs with desks. Do not redesign its face or materials. Reduce the whole creature's scale so the full body including every foot and protrusion occupies at most 75 percent of square canvas width and height, with generous transparent margins on every side. Complete any edge-truncated foot geometry naturally. Standalone full-body square genuine transparent-alpha PNG, no ground, no cast shadow, no background, no text, logos or added motifs. Do not zoom in. Keep the entire creature intact and centered.
```

## 初回・修正前の生成履歴 1

- 理由：原本の左右脚が画面端に接しており保存検査で26個の不透明境界画素を検出。ImageGenで余白のみ修正。
- 原本：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-29897e70-d0cd-459e-a682-d2ca8b1e4a7c.png
- 保存した原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-dhe-v001-attempt001.png

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: Photoreal surreal architecture creature with brick factory, exposed manufacturing machinery, clear office glass and youthful softly textured facial surface; believable tactile materials.
STRUCTURAL DESIGN: The entire primary body is an exceptionally broad low industrial factory complex, with three recognizable sawtooth roof bays, short industrial chimneys, and a big front opening revealing a small assembly line of plain unbranded metal pieces. No smoke. A gigantic youthful humanlike face is fused smoothly into the front brick facade: eyes, nose and mouth occupy most of the width, while factory roofs and production openings remain visible around it. Four squat legs are miniature glazed office blocks, their windows visibly showing simple desks and chairs under neutral office lights, no writing. No normal human or animal torso, no accessories. Wide squat factory with four glass-office legs is the dominant silhouette. Differentiate factory industrial machinery from clean office workplace interiors. All three motifs plainly visible, no foreground or surroundings.
FACE: 若い巨大なリアルな顔。複雑な虹彩の大きな目、丸い頬、小さく自然に笑う口。老人顔・髭・皺・点目なし。
LEARNING MOTIFS: factory=very broad low factory primary body with industrial roof bays and assembly area; office=four short glass office-block legs with visible business desks; face=gigantic youthful face fused into the factory facade. These words share a historical component from *dhe-. Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数192350。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視確認。工業屋根と製造区画の工場、事務机が見えるオフィス、若い顔がそれぞれ読める。横長工場四脚・逆三角形オフィスと工場腕・巨大工場頭と小さいオフィス身体の3構造。v001は初回クリップをImageGenで修正し、全脚と突起が余白内。文字なし。
- 最終画像のalpha>16可視範囲：75, 119, 444, 410。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:58:59+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：オク・デー・ファクトフ
- 英語表示名：To Set · Dhe · Factoff
- 元のローマ字名：Oku Dhe Factoff
- 英語名の三要素：To Set / Dhe / Factoff
- 翻訳する先頭部分：Oku → To Set
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：オク・デー・ファクトフ
- 訂正前の英語名：To Set · Dhe · Factoff
- 現在の混成ローマ字名：Oku Dhe Factoff
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「置く」から「置く」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でOku/To Setを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：置く / to set
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：置く / To Set
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.008](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
