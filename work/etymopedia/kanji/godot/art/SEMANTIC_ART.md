# 継承する技の水墨素材

2026-10-13。imagegen スキル・内蔵画像生成ツールで原画を生成した。
既存の採用済み画像、甲骨文字の線、甲骨文字データは上書きしていない。

原画: `art/incoming/fx_semantic_atlas.png`。
ゲーム用: `assets/art/fx_semantic_{tree,flame,wave,cloud,lightning,wind,rock,claw,feather,root,slash,sun}.png`。
取り込み: `python tools/import_semantic_atlas.py`。切り抜き、白背景の透明化、縮小だけを行う。
12個の長辺は512px以下。原画も残す。

生成に使ったプロンプト:

> ONE production sprite atlas for a Chinese ink-wash kanji survival game, 4 columns by 3 rows, twelve equally sized square cells, overall square image. Elegant Song/Yuan Chinese brush ink painting: restrained brush abbreviations, broken dry brush, watery bleed, black ink masses and abundant white negative space. Pure white background; no paper texture, shadows, borders, text or seals. Every sprite fully within its cell with generous clear margins and isolated from the others. Reading-order subjects: pine tree; cinnabar flames; indigo curling river wave; dark storm cloud; branching lightning; curling wind; cracked mountain rock; three claw marks; feather; spreading roots; horizontal sword slash; faint antique gold radiant sun. Distinct silhouettes at small game VFX size. Ink painting, not vector, neon, 3D or anime.

漢字の弾・部首の字を前に描き、絵は後ろの物性と軌跡に使う。
波が複数重なっても英単語の札を隠さないよう、波の濃さ・表示幅を抑える。
林や森は育つ木立、炎は進む火と残る火、雷は雲・予告・落雷の順に見える。
