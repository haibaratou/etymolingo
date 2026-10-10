# root-ad-v003 コンセプト

- 候補キー：ad-/v003
- 親候補：なし。構造の異なる新規案。
- PNG：root-ad-v003.png
- status：candidate
- キャラクター名：Tsuku Ad Appvert
- 日本語読み：ツク・アド・アップヴァート
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*ad-「～へ」
- root key：ad-
- 既定stem：root-ad（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：007
- 作成日時：2026-10-09T17:52:48+09:00

## コンセプト

巨大広告パネルが頭と胴体を兼ねる薄い生物。蛇腹の長首と腕、アプリの四角い脚、接着剤の関節。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| adhesive | 接着剤 | 透明な接着剤の太い関節と連結する糸 | Latin adhaerere = ad- + haerere。ad- < PIE *ad-。 共有部分は ad-。接着剤の粘る見た目を描き、glueという別単語が同根だとは主張しない。 | [adhesive](https://www.etymonline.com/word/adhesive) |
| advertisement | 広告 | 大きな絵入り広告が頭と胴体 | French avertissement / avertir ← Latin advertere = ad- + vertere。 共有部分は ad-/av-。文字なしの製品広告面で現代意味を描く。看板という別単語全体の同根性は主張しない。 | [advertisement](https://www.etymonline.com/word/advertisement) |
| app | アプリ | アプリアイコンを表示する四角い画面の両脚 | app ← application / apply ← Latin applicare = ad- + plicare。 appはapplicationの短縮。共有部分は歴史的ap- < ad-。端末や画面はアプリを示す図像で、phone等は同根と主張しない。 | [app](https://www.etymonline.com/word/app) |
| accordion | アコーディオン | 鍵盤が見えるアコーディオン蛇腹の背骨と長い腕 | German Akkordion ← Akkord ← accord / *accordare = ad- + cor。 共有部分は ac- < ad-。楽器の蛇腹・鍵盤で現代意味を示す。 | [accordion](https://www.etymonline.com/word/accordion) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

広告パネル上部に、左右非対称の若い大きなリアルな虹彩。印刷されたような顔と立体の口が奇妙に共存。笑いすぎない好奇心の表情。

スタイル：Material-realistic surreal printed advertisement creature, glossy app glass, worn accordion bellows and viscous translucent adhesive; striking thin rectangular anatomy。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：adhesive / advertisement / app / accordion。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[adhesive](https://www.etymonline.com/word/adhesive) / [advertisement](https://www.etymonline.com/word/advertisement) / [app](https://www.etymonline.com/word/app) / [accordion](https://www.etymonline.com/word/accordion) / [ad-（共有接頭辞）](https://www.etymonline.com/word/ad-)。
- ローカル対応：top30/roots-plan.json rank=7, rootKey=ad-, htmlStem=ad。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-0b6c8865-bbaf-458d-9bb5-b728da6a6939.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-ad-v003.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: Material-realistic surreal printed advertisement creature, glossy app glass, worn accordion bellows and viscous translucent adhesive; striking thin rectangular anatomy.
STRUCTURAL DESIGN: A huge tall thin rectangular advertisement panel is the primary head-and-torso, visibly a pictorial advertisement featuring a large accordion product illustration in its lower half with a decorative colored border, absolutely no writing. A very long narrow accordion bellows section with a small keyboard edge descends below this panel as its neck/spine. It divides into two separate square thick glass app-screen feet, each displaying big generic rounded-square interface icons with dots or bars, no real app marks. Two exceptionally long accordion-bellows arms emerge from the panel sides, ending in small keyboard hands. Clear amber adhesive joints and thick sticky bridges visibly fuse the glass feet, bellows and panel. Face eyes are embedded into the top of the advertisement, not detached. Flat tall panel and long bellows limbs produce a narrow, angular, dramatically different silhouette. Four motifs visibly fused, no loose props.
FACE: 広告パネル上部に、左右非対称の若い大きなリアルな虹彩。印刷されたような顔と立体の口が奇妙に共存。笑いすぎない好奇心の表情。
LEARNING MOTIFS: adhesive=thick clear amber adhesive joints and sticky connecting bridges; advertisement=huge tall pictorial advertisement head-and-torso; app=two square glass app-screen feet with interface icons; accordion=very long accordion bellows spine and arms with keyboard edges. These words share a historical component from *ad-. Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数195487。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視確認。アコーディオンの鍵盤と蛇腹、粘る接着剤、一般的なアプリ画面、アコーディオン製品を描いた広告面が読める。横広楽器・丸い接着剤・薄い縦長広告面の3構造。全身と突起は余白内、文字・ロゴなし。
- 最終画像のalpha>16可視範囲：83, 33, 431, 474。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:52:48+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：ヘ・アド・アップヴァート
- 英語表示名：To · Ad · Appvert
- 元のローマ字名：Tsuku Ad Appvert
- 英語名の三要素：To / Ad / Appvert
- 翻訳する先頭部分：He → To
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：「～」は対象を表すplaceholderなので名前へ含めず、「へ」の読みHe/ヘを保持する。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：ツク・アド・アップヴァート
- 訂正前の英語名：To Attach · Ad · Appvert
- 現在の混成ローマ字名：He Ad Appvert
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「～へ」から「～へ」を名前に選ぶ。「～」は対象を表すplaceholderなので名前へ含めず、「へ」の読みHe/ヘを保持する。 同じ語根の全候補でHe/Toを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：～へ / to
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：～へ / To
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.007](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
