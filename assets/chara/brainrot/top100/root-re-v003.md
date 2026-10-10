# root-re-v003 コンセプト

- 候補キー：re-/v003
- 親候補：なし。構造の異なる新規案。
- PNG：root-re-v003.png
- status：candidate
- キャラクター名：Modori Ure Discold
- 日本語読み：モドリ・ウレ・ディスコールド
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*ure (DB: re-)「後ろに」
- root key：re-
- 既定stem：root-re（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：005
- 作成日時：2026-10-09T17:36:46+09:00

## コンセプト

縦向きの巨大レコード一枚が丸い胴体。冷蔵庫の上半分が頭となり、円盤の真ん中にレストランの口。細い審判の脚で立つ。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| record | 音楽レコード | 巨大な円形レコードの胴体 | record noun ← record verb ← Latin recordari＝re-＋cor（heart）。 共有部分はre-。cor（heart）側は別語源。共有するre-のPIE遡及は、現行DBの*ureを保持。Etymonlineには*wret/*wert説もあり、単一の確定説として断定しない。 | [record](https://www.etymonline.com/word/record) |
| refrigerator | 冷蔵庫 | 小さな冷蔵庫頭と扉の腕 | refrigerator ← refrigerate ← Latin refrigerare＝re-＋frigerare（make cool）。 共有部分はre-。frigerare側は別語源。共有するre-のPIE遡及は、現行DBの*ureを保持。Etymonlineには*wret/*wert説もあり、単一の確定説として断定しない。 | [refrigerator](https://www.etymonline.com/word/refrigerator) |
| restaurant | レストラン | 円盤の中心のレストラン入口口 | French restaurant ← restaurer ← Latin restaurare＝re-＋staurare。 共有部分はre-。食べ物単体ではなく店の入口・店内を描く。共有するre-のPIE遡及は、現行DBの*ureを保持。Etymonlineには*wret/*wert説もあり、単一の確定説として断定しない。 | [restaurant](https://www.etymonline.com/word/restaurant) |
| referee | 審判 | 細い審判脚と接合部の縞服 | referee ← refer ← Latin referre＝re-（back）＋ferre（carry）。 共有部分はre-。縞の服はrefereeの人物役割を示す識別で、服の別名称まで同根とはしない。共有するre-のPIE遡及は、現行DBの*ureを保持。Etymonlineには*wret/*wert説もあり、単一の確定説として断定しない。 | [referee](https://www.etymonline.com/word/referee) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

冷蔵庫の小さな頭に二つの細くクールな眼。眉は扉の縁、円盤の入口口は少しだけ開く。無表情の顔と巨大なレコード胴体の落差。

スタイル：surreal cinematic 3D, shiny black vinyl disk body, cool stainless-steel fridge face and crisp referee cloth。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：record / refrigerator / restaurant / referee。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[record](https://www.etymonline.com/word/record) / [refrigerator](https://www.etymonline.com/word/refrigerator) / [restaurant](https://www.etymonline.com/word/restaurant) / [referee](https://www.etymonline.com/word/referee) / [re- (PIEについて複数説)](https://www.etymonline.com/word/re-)。
- ローカル対応：top30/roots-plan.json rank=5, rootKey=re-, htmlStem=re。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-543f89bf-aa1a-48ef-9867-424c9b53cbf5.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-re-v003.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: surreal cinematic 3D, shiny black vinyl disk body, cool stainless-steel fridge face and crisp referee cloth.
STRUCTURAL DESIGN: ONE ENORMOUS upright black VINYL RECORD is the entire circular torso, thick reflective grooves, no label writing. A small stainless REFRIGERATOR head grows above the record rim, two fridge doors acting as eyelid planes over slim cool youthful eyes. The record center is a tiny RESTAURANT ENTRANCE as a mouth, an open arch with an awning and visible dining room inside, not a center label. Two short fridge-door arms emerge from the vinyl sides. Very thin REFEREE legs under the circular disk, black-white striped referee cloth fused at the disk lower edge and thigh joints, ordinary small shoes. Circular disk body on very thin legs with a small rectangular fridge head; no human torso, no separate props, no letters.
FACE: 冷蔵庫の小さな頭に二つの細くクールな眼。眉は扉の縁、円盤の入口口は少しだけ開く。無表情の顔と巨大なレコード胴体の落差。
LEARNING MOTIFS: record=The enormous circular vinyl record torso; refrigerator=The small fridge head and fridge-door arms; restaurant=The restaurant entrance mouth in the record center; referee=Thin referee legs and striped cloth at the body joints. These words share a historical component from *ure (DB: re-). Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数196395。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：512画像を目視確認。冷蔵庫・レコード・レストラン入口と室内・審判の白黒縞の身体が全身内に収まり、3案は縦長冷蔵庫、低い店舗、巨大円盤という主胴体・輪郭が異なる。余白あり、文字なし。
- 最終画像のalpha>16可視範囲：96, 42, 421, 462。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:36:46+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：ウシロニ・ウレ・ディスコールド
- 英語表示名：Back · Ure · Discold
- 元のローマ字名：Modori Ure Discold
- 英語名の三要素：Back / Ure / Discold
- 翻訳する先頭部分：Ushironi → Back
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：モドリ・ウレ・ディスコールド
- 訂正前の英語名：Return · Ure · Discold
- 現在の混成ローマ字名：Ushironi Ure Discold
- ユーザー原文：なんで正確なbackの日本語訳を使わずにモドリにしてるんだ？
- 訂正理由：元DBの日本語語義「後ろに」から「後ろに」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でUshironi/Backを共通にし、候補別には既存の混成語末尾だけを残す。 英語名のBackはユーザー明示指定を保持する。元DBの英語義backwardは変更しない。
- 語根の意味：後ろに / backward
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：後ろに / Back
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.005](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
- 命名の根拠：[Etymonline re-](https://www.etymonline.com/word/re-) — backという意味と*ureへの説を確認。別説の記載を消さず既存DB分類に沿う。
<!-- wildwordopia-display-names:end -->
