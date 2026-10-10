# root-kom-v003 コンセプト

- 候補キー：kom/v003
- 親候補：なし。構造の異なる新規案。
- PNG：root-kom-v003.png
- status：candidate
- キャラクター名：Issho Kom Combite
- 日本語読み：イッショ・コム・コンバイト
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*kom-「一緒に」
- root key：kom
- 既定stem：root-kom（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：002
- 作成日時：2026-10-09T17:24:10+09:00

## コンセプト

横に長い生きたコンバイン。運転席はコンピューターの顔そのもの、頭上へ伸びる製図コンパスが二股の首、刈取りリールが口。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| computer | コンピューター | 運転席そのものになったコンピューターと鍵盤 | computer ← compute ← Latin computare＝com（together）＋putare。com ← PIE *kom。 共有部分はcom-。putareは別語根。 | [computer](https://www.etymonline.com/word/computer) |
| compass | コンパス（方位磁針・円を描く道具） | 二股の首を作る製図コンパス | Old French compas ← Vulgar Latin compassare ← com＋passus（step）。com ← PIE *kom。 共有部分はcom-。passusは別語根。 | [compass](https://www.etymonline.com/word/compass) |
| combine | コンバイン（穀物を刈り取る機械） | 横長のコンバイン胴体・車輪・リールの口 | combine noun ← combine verb ← Late Latin combinare＝com＋bini（two by two）。 共有部分はcom-。農機のcombineはcombine harvesterの短縮。harvesterという別語まで同根とはしない。 | [combine](https://www.etymonline.com/word/combine) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

運転席の画面に大きいが眠そうな二眼。コンパスのヒンジが眉のように傾き、リール口は少し開く。無表情の農機が小さな顔をしている落差。

スタイル：surreal cinematic 3D farm-machine creature with real metal, rubber tyres, muted green paint and glossy screen。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：computer / compass / combine。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[computer](https://www.etymonline.com/word/computer) / [compass](https://www.etymonline.com/word/compass) / [combine](https://www.etymonline.com/word/combine)。
- ローカル対応：top30/roots-plan.json rank=2, rootKey=kom, htmlStem=kom。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-7ecd4617-800b-4e8e-b238-219596de7621.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-kom-v003.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: surreal cinematic 3D farm-machine creature with real metal, rubber tyres, muted green paint and glossy screen.
STRUCTURAL DESIGN: A low wide COMBINE HARVESTER is the creature's main horizontal torso: recognizable green farm-machine body, large tyres, and a very wide grain-cutting reel which is its mouth. The driver cabin is replaced entirely by a living COMPUTER monitor and integrated keyboard dashboard, no driver inside. A giant DRAFTING COMPASS grows upward from the chassis as a split metal neck, its top hinge supporting the computer face above the low machine body. The two compass legs straddle the harvester like anatomical beams. The face is two sleepy luminous eyes inside the monitor, no letters or symbols. Whole machine creature, wide silhouette with a tall split neck; not a normal tractor carrying a computer.
FACE: 運転席の画面に大きいが眠そうな二眼。コンパスのヒンジが眉のように傾き、リール口は少し開く。無表情の農機が小さな顔をしている落差。
LEARNING MOTIFS: computer=The living monitor cabin and keyboard dashboard; compass=A giant drafting compass as the split upper neck; combine=The wide combine body, tyre undercarriage and cutting-reel mouth. These words share a historical component from *kom-. Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数178702。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視。コンピューター・コンパス・コンバインが確認でき、全身と部品が収まり文字なし。箱形のコンピューター主胴体／逆V字の製図コンパス／横長のコンバイン主胴体で構造を分けている。
- 最終画像のalpha>16可視範囲：44, 36, 474, 461。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:24:10+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：イッショニ・コム・コンバイト
- 英語表示名：Together · Kom · Combite
- 元のローマ字名：Issho Kom Combite
- 英語名の三要素：Together / Kom / Combite
- 翻訳する先頭部分：Isshoni → Together
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：イッショ・コム・コンバイト
- 訂正前の英語名：Together · Kom · Combite
- 現在の混成ローマ字名：Isshoni Kom Combite
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「一緒に」から「一緒に」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でIsshoni/Togetherを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：一緒に / together
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：一緒に / Together
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.002](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
