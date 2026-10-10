# root-per1-v003 コンセプト

- 候補キー：per1/per1-v003
- 親候補：なし。構造の異なる新規案。
- PNG：root-per1-v003.png
- status：candidate
- キャラクター名：Mae Per Princologne
- 日本語読み：マエ・ペル・プリンコロン
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*per- (1)「前へ」
- root key：per1
- 既定stem：root-per1（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：001
- 作成日時：2026-10-09T17:15:19+09:00

## コンセプト

王子のちび人体だが、頭のほとんどが額、腹が香水の丸いガラス槽、前腕だけが長く伸びた異形。小物ではなく香水槽と腕の比率そのものが体を作る。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| perfume | 香水 | 香水のガラス腹と噴霧口 | French parfum ← perfumar/perfumare ← Latin per（through）＋fumare。per ← PIE *per- (1)。 共有するのはper-（通して）の部分。fumeの部分は別の語源。 | [perfume](https://www.etymonline.com/word/perfume) |
| prince | 王子 | 王子として読める若い人体と襟・冠 | Old French prince ← Latin princeps ← primus（first）＋capere。primus ← *preis- ← PIE *per- (1)。 princepsのprimus（第一の）側がこの語根。capere（取る）側は別語根。冠と王子の装いはprinceの意味を示す造形であり、crownの語源まで同じとは教えない。 | [prince](https://www.etymonline.com/word/prince) |
| forearm | 前腕（ひじから手首） | 肘と手首を備えた長い前腕 | fore-＋arm。fore- ← Old English fore ← PIE *per- (1)。 共有するのはfore-。armは別の語源。 | [forearm](https://www.etymonline.com/word/forearm) |
| forehead | 額 | 大頭の大半を占める額 | Old English forheafod ← fore-＋heafod。fore- ← PIE *per- (1)。 共有するのはfore-。headは*kaput-の一族。 | [forehead](https://www.etymonline.com/word/forehead) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

高い額の下に日本アニメ寄りの細い二眼と大きな青い瞳。すっきりした眉、小さな口、クールな微笑み。セル調の顔とガラス槽の質感を組み合わせる。

スタイル：original Japanese anime/chibi character with elegant cool-cute proportions, cel-shaded face and translucent glass anatomy。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：perfume / prince / forearm / forehead。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[perfume](https://www.etymonline.com/word/perfume) / [prince](https://www.etymonline.com/word/prince) / [forearm](https://www.etymonline.com/word/forearm) / [forehead](https://www.etymonline.com/word/forehead) / [fore](https://www.etymonline.com/word/fore)。
- ローカル対応：top30/roots-plan.json rank=1, rootKey=per1, htmlStem=per1。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-a035c0ac-415f-4645-9f14-98acc0460e21.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-per1-v003.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: original Japanese anime/chibi character with elegant cool-cute proportions, cel-shaded face and translucent glass anatomy.
STRUCTURAL DESIGN: A cool youthful chibi PRINCE is anatomically impossible: an immense rounded FOREHEAD takes up most of the oversized head, crowned by a small royal crown; beneath the brow are two elegant anime eyes. The entire belly is a round transparent PERFUME RESERVOIR, with atomizer nozzle physically growing from the collarbone and perfume liquid clearly visible inside, not a held accessory. The two FOREARMS are strikingly oversized and long, attached to tiny upper arms, with elbows and wrists readable. The prince has ordinary tiny feet and a short royal collar fused around the glass belly. Tall-headed narrow humanoid silhouette, huge forehead and glass belly, long forearms; no sword, no external props.
FACE: 高い額の下に日本アニメ寄りの細い二眼と大きな青い瞳。すっきりした眉、小さな口、クールな微笑み。セル調の顔とガラス槽の質感を組み合わせる。
LEARNING MOTIFS: perfume=The whole glass belly and atomizer as a perfume body; prince=The young prince identity of the body and royal collar/crown; forearm=Two oversized long forearms with visible elbows and wrists; forehead=The upper majority of the oversized head is the forehead. These words share PIE *per- (1); for compound words only the stated fore-/per-/primus elements share that lineage, not the other components. The royal crown is a visual identifier for prince, not a new same-root word.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数189678。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視。香水・王子・前腕・額が確認でき、全身が収まり文字なし。3案は香水瓶の胴体／前腕のアーチ／アニメの大頭人体で構造が異なる。
- 最終画像のalpha>16可視範囲：58, 33, 450, 476。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:15:19+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：マエヘ・ペル・プリンコロン
- 英語表示名：Forward · Per · Princologne
- 元のローマ字名：Mae Per Princologne
- 英語名の三要素：Forward / Per / Princologne
- 翻訳する先頭部分：Maehe → Forward
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：マエ・ペル・プリンコロン
- 訂正前の英語名：Forward · Per · Princologne
- 現在の混成ローマ字名：Maehe Per Princologne
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「前へ」から「前へ」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でMaehe/Forwardを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：前へ / forward
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：前へ / Forward
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.001](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
