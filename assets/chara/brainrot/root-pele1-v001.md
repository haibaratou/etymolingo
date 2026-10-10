# root-pele1-v001 コンセプト

- 候補キー：pelə-1/v001
- 親候補：なし（同語根の独立した構造案）
- PNG：root-pele1-v001.png
- status：candidate（人間未採用）
- キャラクター名：Ippai Pele Fillip
- 日本語読み：イッパイ・ペレ・フィリップ
- 名前の構成：Ippai（いっぱい） / Pele / fill + plus
- PIE：*pelə-1 (local) / *pele- (1) / 満たす / to fill
- root key：pelə-1
- 既定stem：root-pele1（top30/roots-plan.json の htmlStem）
- 作成日時：10/09/2026 17:21:20

## コンセプト
背の高い透明な水瓶が全身。水面が縁まで見える。左右の蛇口腕が瓶に水を注ぎ、プラス記号の脚、平面多角形の首飾り、完成パズルの蓋が顔になる。

## 英単語と部品
| English word | Meaning | Visible anatomy | Shared component / lineage | Source |
|---|---|---|---|---|
| full | いっぱいの | brim-full visible water reservoir / 水でいっぱいの器 | Germanic *fullaz → *pele- (1). The reservoir symbolizes full; the vessel name is not taught as same-root. | [Etymonline](https://www.etymonline.com/word/full) |
| fill | 満たす | faucet flowing directly into the reservoir / 器を満たす蛇口 | Germanic *fulljanan, derived from *fullaz → *pele- (1). The pouring action illustrates fill; faucet is not a claimed derivative. | [Etymonline](https://www.etymonline.com/word/fill) |
| plus | プラス | large three-dimensional plus sign / 大きな立体プラス記号 | Latin plus/*pleos → *pele- (1). The plus symbol illustrates the modern plus word. | [Etymonline](https://www.etymonline.com/word/plus) |
| polygon | 多角形 | large flat colored polygon plates / はっきりした平面の多角形 | Greek polys + gonia; polys → *pele- (1). Only poly- (many) shares this root; -gon is *genu- (1). | [Etymonline](https://www.etymonline.com/word/polygon) |
| complete | 完成させる | all pieces present in a completed jigsaw panel / 全部そろった完成パズル | Latin complere = com- + plere; plere → *pele- (1). Only -plete/plere is the shared component; jigsaw pieces illustrate completed state. | [Etymonline](https://www.etymonline.com/word/complete) |

現代の語義を示す象徴を身体に融合する。象徴の物体名そのものを同根として教えるものではない。partial=true の語は共有部分のみが対象語根に由来する。

## 顔と素材
Wide separate round expressive eyes on the completed-puzzle lid, one raised brow, tiny worried open O mouth as the reservoir overflows; physical puzzle seams around eyes.
スタイル：Photorealistic glass and water with chrome faucets, painted wooden signs and jigsaw lid.

## 維持する要素・避ける変更
同根の英単語を主要部品として維持。衣装と手持ち小物だけに置き換えない。各候補は構造から異なり、顔差分ではない。全員点目という旧方針は現行ルールではない。

## 出典・生成経緯
- ローカル対応表：top30/roots-plan.json / tools/word-art-todo.csv（限定したCSVのみ参照）
- 使用ツール：built-in ImageGen（1候補につき1回の新規生成）
- 編集元・参考画像：なし
- 生成原本：C:\Users\haiba\.codex\generated_images\01a11f58-4477-7010-abd2-7853b355e1fb\exec-8f211263-34cb-46ab-a2e9-8c7fe00a8f91.png
- 保存原本：D:\etymolingo\work\wildwordopia\sample\_sources\root-pele1-v001.png
- 仕上げ：PowerShell System.Drawing による縦横比維持の512×512リサイズと透明余白のみ。主要部品の描き直し・除去なし。

## 完全な生成プロンプト
```text
One standalone original absurd word-family creature. Same-family learning anatomy FULL, FILL, PLUS, POLYGON (poly- only), COMPLETE (-plete only). Objects physically fuse into the body; no simple dressed mascot or props. Large clear forms readable at 512. No unrelated animals. Entire full body with generous transparent margin. TRUE transparent background, no scenery, floor, shadows, checkerboard, written text, numbers, labels, logos. MAIN BODY a tall clear glass jar totally FULL to the brim with blue water, clearly visible liquid line and broad contained spill lip. Its head is a COMPLETED square multicolor jigsaw puzzle lid, every piece fitted, with worried wide rounded eyes and a small O mouth integrated in the puzzle wood. Two enormous chrome FAUCET ARMS curve inward and each POURS water visibly INTO its glass body, showing FILL. TWO thick yellow PLUS signs serve as sturdy feet with vertical shins. Large flat cyan pentagon and magenta hexagon POLYGON plates ring the shoulders as an angular collar. Realistic transparent glass/refraction and polished faucet texture. Tall bottle silhouette, playful anxious overfilled personality.
```

## 仕上げ確認
- PNG / 512×512 / RGBA：確認済み
- 四隅alpha：0, 0, 0, 0
- 透明ピクセル：182826 / 前景ピクセル：79318
- 全身・主要モチーフ・外周：生成結果と最終512プレビューを目視確認。人間による採用判断は未実施。

## 評価履歴
| 日時(JST) | 範囲 | ユーザー原文 | 解釈・対応 | status |
|---|---|---|---|---|
| 10/09/2026 17:21:20 | 全体 | 未評価 | 比較候補を保存。自動採用しない。 | candidate |

## 背景透過の修正履歴

修正前原本：C:\Users\haiba\.codex\generated_images\01a11f58-4477-7010-abd2-7853b355e1fb\exec-dd3e9db9-87c1-4caa-b84c-68e4d6901321.png

背景だけをImageGenで透過。身体は維持。

```text
Edit ONLY the background of this existing full-water-jar puzzle faucet creature. Remove the entire gray and multicolored hazy gradient, glow and ground; make every exterior background pixel fully transparent alpha=0, including openings between faucets and glass body and between the feet. Keep the creature's full exact shape, complete colorful jigsaw head and worried face, both chrome faucets, flowing water, full blue water reservoir, polygon collar and yellow plus feet unchanged. Preserve realistic glass/water but remove colored backdrop from the outside. No redesign, no new pose, no lost bodyparts, all extremities visible. Clean true transparent cutout with generous transparent margins.
```

<!-- wildwordopia-display-names:start -->
## 表示名（日本語・英語）

- 日本語表示名：ミタス・ペレ・フィリップ
- 英語表示名：To Fill · Pele · Fillip
- 元のローマ字名：Ippai Pele Fillip
- 英語名の三要素：To Fill / Pele / Fillip
- 翻訳する先頭部分：Mitasu → To Fill
- 方針：現在の先頭は語根ごとの確定訳を全候補で共通にする。選んだ日本語原訳の助詞・語尾を省略せずカタカナにし、その先頭だけを英語表示で訳す。PIEの音と既存の混成語末尾は維持し、制作時の旧名は履歴として残す。
- 翻訳辞書：top30/name-prefix-translations.json
- 翻訳の注記：元DBの日本語訳の助詞・語尾を省略しない。

### 名前の訂正履歴（2026-10-09）

- 訂正前の日本語名：イッパイ・ペレ・フィリップ
- 訂正前の英語名：Full · Pele · Fillip
- 現在の混成ローマ字名：Mitasu Pele Fillip
- ユーザー原文：無茶苦茶な名前が大量にいるな
- 訂正理由：元DBの日本語語義「満たす」から「満たす」を名前に選ぶ。その日本語を助詞・語尾も含めて省略せず使う。 同じ語根の全候補でMitasu/To Fillを共通にし、候補別には既存の混成語末尾だけを残す。
- 語根の意味：満たす / to fill
- 訂正記録：top30/candidate-name-overrides.json
- 生成時の本文・旧名・プロンプトは制作履歴として保持する。
- 名前に選んだ語義：満たす / To Fill
- 選択語義の元欄：top30/roots-plan.json:meaning
- 命名の根拠：[roots-plan.json No.022](D:/etymolingo/work/wildwordopia/top30/roots-plan.json) — 既存語根の日本語・英語の語義を根拠とし、元データを変更しない。
<!-- wildwordopia-display-names:end -->
