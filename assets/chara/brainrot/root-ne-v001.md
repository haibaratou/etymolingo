# root-ne-v001 コンセプト

- 候補キー：ne/v001
- 親候補：なし。構造の異なる新規案。
- PNG：root-ne-v001.png
- status：candidate
- キャラクター名：Nashi Ne Atomethyst
- 日本語読み：ナシ・ネ・アトメシスト
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*ne-「否定」
- root key：ne
- 既定stem：root-ne（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：004
- 作成日時：2026-10-09T17:32:15+09:00

## コンセプト

巨大な原子模型の軌道が丸い胴体を作り、核が顔を持つ紫水晶。審判の襟と帽子が結晶へ食い込み、脚は途中だけ見えなくなる。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| atom | 原子 | 丸い全身を作る交差した原子模型の軌道 | Greek atomos＝a-（not）＋tomos（cutting）。否定a- ← PIE *ne。 共有部分は否定a-。核と軌道は原子模型の視覚化で、ball/ringの語源を同根と教えない。 | [atom](https://www.etymonline.com/word/atom) |
| amethyst | 紫水晶 | 紫水晶の核と短い結晶の足 | French ametiste ← Latin amethystus ← Greek amethystos＝a-＋methyskein（make drunk）。 共有部分は否定a-。現代の紫色の水晶そのものを描く。 | [amethyst](https://www.etymonline.com/word/amethyst) |
| umpire | 審判 | 核に融合した審判の帽子と襟 | Middle English noumper ← Old French nonper＝non（not）＋per（equal）。non ← *ne oinom。 歴史的な否定non-部分を共有。審判の帽子・防具は人物の識別用で、その物体名まで同根としない。 | [umpire](https://www.etymonline.com/word/umpire) |
| invisible | 見えない | 脚の中間の見えない空間 | Latin invisibilis＝否定in-（not）＋visibilis。否定in- ← PIE *ne。 否定のin-を共有。*en「中へ」のin-とは別。透明・欠落は意味を描くための造形。 | [invisible](https://www.etymonline.com/word/invisible) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

紫水晶の核に大きな一つ眼。虹彩は淡い金色、厚い半透明の結晶まぶた、ゆるく開いた小さな口。眠そうで少し困った顔。

スタイル：surreal photographic 3D with luminous purple crystal, polished atomic-model rings and matte umpire cloth。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：atom / amethyst / umpire / invisible。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[atom](https://www.etymonline.com/word/atom) / [amethyst](https://www.etymonline.com/word/amethyst) / [umpire](https://www.etymonline.com/word/umpire) / [invisible](https://www.etymonline.com/word/invisible)。
- ローカル対応：top30/roots-plan.json rank=4, rootKey=ne, htmlStem=ne。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-ed7e5c9e-2fad-4c83-afa5-3be44d4ddf6f.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-ne-v001.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: surreal photographic 3D with luminous purple crystal, polished atomic-model rings and matte umpire cloth.
STRUCTURAL DESIGN: An ENORMOUS ATOM MODEL is the whole round living torso: three crossing metal orbital loops surround one large AMETHYST CRYSTAL nucleus. The nucleus has a single huge gentle sleepy eye with golden iris and a small softly open mouth carved naturally into translucent purple crystal. A black sports UMPIRE cap and short dark umpire collar are fused into the crystal nucleus, making the nucleus a umpire-like figure, not a helmet mascot. Two short crystal legs connect to the lower orbital body but their middle sections are INVISIBLE: visibly separated upper leg and foot with clean transparent gaps and no ghost outlines. No extra loose objects. Wide spherical atomic silhouette with a crystal cyclops umpire core. No numbers, scientific labels or logos.
FACE: 紫水晶の核に大きな一つ眼。虹彩は淡い金色、厚い半透明の結晶まぶた、ゆるく開いた小さな口。眠そうで少し困った顔。
LEARNING MOTIFS: atom=Three crossed atomic-model orbits making the whole spherical body; amethyst=The large purple amethyst nucleus and short crystal feet; umpire=Umpire identity of the nucleus, fused cap and collar; invisible=Clean transparent missing middle sections of the legs. These words share a historical component from *ne-. Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数179190。
- 原本の四隅alpha：0 / 0 / 1 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視。原子模型・紫水晶・審判の識別・見えない身体の空間が確認でき、全身が収まり文字なし。球状の原子胴体／結晶胴体／審判人体で構造を分けている。
- 最終画像のalpha>16可視範囲：66, 57, 454, 456。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:32:15+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：ヒテイ・ネ・アトメシスト
- 英語表示名：Not · Ne · Atomethyst
- 元のローマ字名：Nashi Ne Atomethyst
- 英語名の三要素：Not / Ne / Atomethyst
- 翻訳する先頭部分：Hitei → Not
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：ナシ・ネ・アトメシスト
- 訂正前の英語名：Not · Ne · Atomethyst
- 現在の混成ローマ字名：Hitei Ne Atomethyst
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「否定」から「否定」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でHitei/Notを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：否定 / not
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：否定 / Not
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.004](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
