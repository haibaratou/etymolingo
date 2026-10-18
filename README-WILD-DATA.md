# Wild Wordopia データ連携

母艦 etymon-source の export_public_game_data.py が配信先の app/data/generated-etymon を更新した後、配信先で python tools/build_wild_wordopia.py を実行する。

- build_wild_dictionary.py は既存の公開用語根・単語データを読み、104体に対応する読み取り専用データを生成する。語義・語源の作文や母艦の書き換えはしない。
- app/data/wild-wordopia-dictionary.js は生成物。直接編集しない。file:// でも読み込める。
- キャラクターの候補と選択は従来の library.js / site-characters.js / selection-sync.js を維持する。
- app/wildwordopia.html はデザイン比較・調整用。app/wild-wordopia.html は紹介サイト。
- etymopedia 用の build_etymopedia_from_pie.py → build_etymopedia_emb.py も引き続き利用する。Wild 用の語源は同じ母艦の公開データから取得する。
- 語根キーは rootKey と root の完全一致（Unicode NFCのみ正規化）で対応。綴りが同じだけの別語義へのフォールバックはしない。

検証: 104体の詳細HTML生成、頭/kaput-の対応、派生語検索、file:// 用JS読込方式、JavaScript構文を確認。実ブラウザーの見た目は未検証。
公開・ローカル反映前の修正版。既存画像・選択記録・レビュー用HTMLは変更していない。
