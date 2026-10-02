オンライン語源辞書の完成を目指す。
"D:\etymon-source\tools\word-art-todo.csv"
登録された英単語のリストの中から、まだ対応した英単語のイラストがないもの、なおかつレア度の低いものを優先してイラストを作っていく。
ただし画像が存在していても
"D:\etymolingo\work\etymopedia\png_creation_dates.csv"
をチェックして、9/10 以前の画像は品質に難があるため全て生成し直します。
大量のデータになるので、画像のプロンプト生成担当と、画像生成担当を分けることになる。
基本的に

ChatGPT→プロンプト制作
Works、Codex→画像生成&検品&保存

詳しいフローは
"D:\etymolingo\work\etymopedia\WORKFLOW.md"
を確認する。

プロンプトのサンプルは
"D:\etymolingo\work\etymopedia\etymopedia_sample\prompt_rows_template.csv"

参照に使う画像は
D:\etymolingo\work\etymopedia\etymopedia_sample\_illust
