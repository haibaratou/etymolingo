# エティモペディアのイラスト制作

語源辞書の単語イラストを、正式な日本語語義と画像名に合わせて制作する。

## プロンプトCSVの担当別フォルダ

- [dot](dot/README.md)：009・011・028〜030。dotが画像生成・検品を担当
- [codex](codex/README.md)：007・008・010・012〜027。Codexが画像生成を担当
- 000〜006は担当未確認の履歴として、このフォルダ直下に保持

担当は画像生成の担当を表す。プロンプト作成済み・画像生成済み・検品合格・公開反映済みは、それぞれ別の状態として確認する。

9月10日末以前の未更新画像は、レア度順にdotがプロンプトと画像の両方を担当する。既にプロンプトがあることだけを理由に、再生成が完了したとは扱わない。

## 共通ルールと参照

- [制作ワークフロー](WORKFLOW.md)
- [プロンプトのサンプル](etymopedia_sample/prompt_rows_template.csv)
- [唯一の画風参照画像](etymopedia_sample/references/invidious.png)
- [保留語の記録](prompt_review_pending.csv)
- [画像日付表](png_creation_dates.csv)

CSV内の `references/invidious.png` は上記サンプル一式内の共通パス。CSVを担当フォルダへ移した後も、この同じ画像を参照する。画像ステージング先と本番の `assets/word/` は変更しない。
