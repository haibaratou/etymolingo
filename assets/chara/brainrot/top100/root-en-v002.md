# root-en-v002 コンセプト

- 候補キー：en/v002
- 親候補：なし。構造の異なる新規案。
- PNG：root-en-v002.png
- status：candidate
- キャラクター名：Naka En Entragut
- 日本語読み：ナカ・エン・エントラガット
- 名前の構成：冒頭の日本語由来の一語＋PIEの音＋英単語を混ぜた創作の響き。創作名の綴りそのものを歴史的な語源例とはしない。
- PIE：*en-「中に」
- root key：en
- 既定stem：root-en（roots-plan.jsonのhtmlStem・既存HTMLROOT_CONCEPT対応）
- Explorer No.：003
- 作成日時：2026-10-09T17:27:38+09:00

## コンセプト

入口のアーチ自体が背の高い胴体。入口の奥に腸のコイルとエンジンが生え、昆虫の六脚がアーチから直接伸びる。

## 英単語と部品

| 英単語 | 現代の意味 | 描く部位・形 | PIEへの経路・共有部分 | 根拠 |
|---|---|---|---|---|
| insect | 昆虫 | 入口の左右へ直接生えた六本の昆虫脚 | Latin insectum ← in（into）＋secare（cut）。in ← PIE *en。 共有部分はin-（中へ）。secareは別語根。昆虫の種類の名前まで同根とはしない。 | [insect](https://www.etymonline.com/word/insect) |
| engine | エンジン | アーチの中のエンジン | Old French engin ← Latin ingenium＝in-＋gignere（beget）。 共有部分はingeniumのin-（中に）。gignereは別語根。 | [engine](https://www.etymonline.com/word/engine) |
| intestine | 腸 | 入口の空間を巡る腸のループ | Latin intestinum ← intestinus（internal）← intus ← PIE *entos, *enの接尾形。 血や傷ではなく、腸のループ状の形を描く。 | [intestine](https://www.etymonline.com/word/intestine) |
| entrance | 入口 | 全身と口を作る入口アーチ | entrance ← enter ← French entrer ← Latin intrare ← intra/inter ← PIE *enter（*enの比較形）。 扉の形は入口を視覚化するもの。doorの語源まで同根とは教えない。 | [entrance](https://www.etymonline.com/word/entrance) |

複合語と接頭辞を持つ語は上の共有部分のみを同根として説明する。対象語根以外の語形成部分や、現代の意味を描くための象徴の名前まで同根と教えない。

## 顔と素材

入口上部のアーチ面に、二つの縦長で非対称なカートゥーン眼と片眉。口は入口の空間そのもの。楽しげに驚いた表情。

スタイル：original American-cartoon 3D, soft expressive architecture, tactile stone and metal and clean pink loops。顔の位置・眼・眉・口・基準感情・材質との接続をこの候補に合わせて選ぶ。全語根を同じ点目へ統一しない。

## 維持する要素・避ける変更

- 主要学習モチーフ：insect / engine / intestine / entrance。
- 物体を体へ融合させ、持っている小物だけにしない。別系統の動物・道具を主要部品として追加しない。
- 同じ語根の他候補を削除・置換しない。顔や色だけの差を別の構造案と数えない。
- 全身、主要部品、突起を切らない。文字、ラベル、地面影、背景を描かない。

## 出典・生成経緯

- 語源・語義の出典：[insect](https://www.etymonline.com/word/insect) / [engine](https://www.etymonline.com/word/engine) / [intestine](https://www.etymonline.com/word/intestine) / [entrance](https://www.etymonline.com/word/entrance)。
- ローカル対応：top30/roots-plan.json rank=3, rootKey=en, htmlStem=en。
- 使用ツール：built-in ImageGen。
- 編集元・参考画像：なし、新規生成。
- 生成出力：C:\Users\haiba\.codex\generated_images\01a11c2d-64d0-7441-b557-2dd9387c1175\exec-c8886483-8cca-49f6-a8b0-c0b89aed628b.png
- ワークスペース内の生成原本：D:/etymolingo/work/wildwordopia/sample/_sources/root-en-v002.png
- 派生関係：新規生成 → サイズ調整のみ。
- 仕上げ処理：PowerShell System.Drawingで512×512の透明キャンバスへ縦横比を保って縮小配置。描き直しやモチーフ除去なし。Python画像編集なし。

## 完全な生成プロンプト

```text
Use case: stylized-concept. Asset: original English-etymology game character, standalone transparent raster PNG. A surprising impossible anatomical fusion with 3-5 clearly readable major learning motifs; an original creature, not themed accessories on an otherwise normal mascot. All meaningful requested objects are fused into the body. Full body and every protrusion completely visible; square framing with generous clear margins, the character occupying about 75 percent of canvas height. Three-quarter front view unless anatomy requires a near frontal view. No crop, no floor, no ground shadow, no backdrop, genuine transparent alpha. No letters, digits, labels, logos, text, watermarks or floating props. Strong material differentiation and clean edges; charismatic youthful appearance, no middle-aged face. Do not add extra animals, tools, garments or motifs outside this specification.
STYLE: original American-cartoon 3D, soft expressive architecture, tactile stone and metal and clean pink loops.
STRUCTURAL DESIGN: A giant freestanding rounded ENTRANCE ARCH is the entire tall torso and open mouth, with no building around it and no letters. Two oversized asymmetrical cartoon eyes are embedded high in the arch stonework, one raised eyebrow. The open arch interior is anatomically occupied by visible smooth pink INTESTINE coils, which weave around an exposed piston ENGINE forming the arch's living heart. Six INSECT legs grow directly from the arch sides at three levels and angle outward for a distinctive tall six-legged gateway silhouette; small insect antennae are ordinary connecting anatomy. No person standing inside, no separate doorway held as a prop. A living entrance-engine-intestine insect.
FACE: 入口上部のアーチ面に、二つの縦長で非対称なカートゥーン眼と片眉。口は入口の空間そのもの。楽しげに驚いた表情。
LEARNING MOTIFS: insect=Six insect legs directly attached to the doorway sides; engine=An exposed engine inside the arch chest; intestine=Visible clean intestine loops weaving through the open doorway; entrance=The tall rounded entrance arch which is the whole torso and mouth. These words share a historical component from *en-. Compound words and prefix formations only share the component listed in the accompanying concept; do not imply all other word components, or all names of decorative anatomy, share this root.
```

## 仕上げ確認

- PNG / 512×512 / RGBA：確認済み、Format32bppArgb。
- 背景alpha・四隅：0 / 0 / 0 / 0。透明ピクセル数175159。
- 原本の四隅alpha：0 / 0 / 0 / 0。原本の不透明境界ピクセル：0。
- 全身・主要モチーフ・外周：最終512画像を目視。昆虫・エンジン・腸のループ・入口が確認でき、全身と部品が収まり文字なし。横長の昆虫／高い入口アーチ／エンジン大頭と螺旋首で構造を分けている。
- 最終画像のalpha>16可視範囲：89, 39, 449, 477。
- 採用評価：未評価。検査済みであってもadoptとはしない。

## 評価履歴

| 日時(JST) | 評価の範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 2026-10-09T17:27:38+09:00 | 全体・顔・名前 | 未評価 | 生成・保存・最終512画像確認済み。選択待ち。 | candidate |

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：ナカニ・エン・エントラガット
- 英語表示名：In · En · Entragut
- 元のローマ字名：Naka En Entragut
- 英語名の三要素：In / En / Entragut
- 翻訳する先頭部分：Nakani → In
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：ナカ・エン・エントラガット
- 訂正前の英語名：Inside · En · Entragut
- 現在の混成ローマ字名：Nakani En Entragut
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「中に」から「中に」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でNakani/Inを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：中に / in
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：中に / In
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.003](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
