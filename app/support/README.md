# プロダクト共通の補助ファイル

すべての開く入口HTMLは `app` 直下です。アプリとゲームを区別せず、JS/CSS/補助データ/内部画面/ビルダー/テストをこのsupport配下へ分離します。

- `picture-words/`: Pictlingo本体・カタログ・画像パック・生成器・テスト
- `pictlingo-quest/`: 現在も利用する並びデータと保持した旧試作・素材
- `etymopedia/`: 図鑑の補助デザインコード・制作資料
- `wildwords/`: 商品企画とfeedbackの補助コード
- `wildwordopia-history/`: 履歴比較のコードと生成データ
- `puzzle.html`: 箱庭内スマートフォンが開く内部画面
- `*.webmanifest`, `icon.svg`, `etymon-word-forge-data.js`: 共通配置の既存補助
- `picture-words-sw.js`: オフライン本体。app直下の薄いloaderから読む。

共通の辞書・コード・素材は既存の `app/data/`、`app/shared/`、`assets/` を参照し、無断複製しません。新規作成と生成先のルールはルートの `AGENTS.md` にあります。今回の是正記録は `work/product-entry-layout-20261028/` です。
