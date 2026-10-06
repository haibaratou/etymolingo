# Pictlingo Android 検証版

[Android用APKをダウンロード](https://github.com/haibaratou/etymolingo/raw/refs/heads/main/mobile/pictlingo/downloads/pictlingo-preview.apk)

2026-10-07作成。既存のHTMLゲームをCapacitor 8.5.2でAndroidアプリ化した、デバッグ署名の検証版です。Google Playへの公開版ではありません。

## この版で試せること

- URL欄のない全画面プレイ、Androidの戻る操作、開始画面の「閉じる」。
- 日英で遊べる確認済みの23問を同梱。初回から通信なしで遊べます。
- 同じイラストでの日英切り替え、なぞり操作、答えの表示、採点、コレクション。
- AndroidのTextToSpeechによる通常・ゆっくり再生。音声モデルはアプリに同梱しません。音声の品質・対応言語・圏外再生の可否は、端末にインストールされた音声に依存します。
- 記録はアプリ内に保存。ブラウザー版の記録とは別です。

APKは約13.8 MBです。端末へのインストール後の使用容量とは異なります。容量と動作を確認するための小さな問題セットであり、サイトの全画像をダウンロードしません。広告SDK・広告表示・課金はまだ入れていません。

Android 7以上を対象とし、Android System WebViewは更新されたものを使用してください。日本語などの音声がない端末では、Android側でその言語の音声データを追加する必要があります。端末によって初回にAndroid標準の全画面操作ガイドが表示されます。

## 検証

- Android 15 / API 35・Pixel 4構成の専用エミュレーターへAPKをインストール。
- Wi-Fiとモバイルデータを無効にして、起動、日英切り替えで画像が維持されること、文字盤が画面内に収まること、再読み込み後の保存を検査。
- Androidのタッチイベントで3文字をなぞり、正解と100点の表示まで確認。Android実行テスト2件、データ・音声連携テスト3件が成功しました。
- 同梱された全23問の画像ハッシュ・説明・日英の出題可否を検査。画像準備中のネットワークアクセスを禁止したテストも実施。
- 実機の音質、タッチ遅延、電池消費、広告からの復帰は未測定です。

## 更新・ビルド

Node.js 22以上、JDK 21以上、Android SDK 36を用意して、このフォルダーの `build.cmd` を実行します。必要に応じて `JAVA_HOME` と `ANDROID_HOME` を設定してください。

`prepare-web.cjs` は現行ゲームから必要なファイルだけを `www/` に生成します。元のHTMLや辞書データは書き換えません。確認済み日英問題から画像パック合計6 MB・最大40問までを選び、現在のデータでは23問です。画像、意味、説明の整合性検査はアプリでも維持します。

出力: `downloads/pictlingo-preview.apk`。`www/`、依存パッケージ、SDK、ビルド中間ファイル、端末別設定、署名キーはGitに含めません。共有するAPKだけをdownloadsに置きます。

Androidテストは `:app:assembleDebugAndroidTest` でビルドし、検証端末へインストール後、`com.haibaratou.pictlingo.preview.test/androidx.test.runner.AndroidJUnitRunner` で実行します。

アプリIDは検証専用の `com.haibaratou.pictlingo.preview` です。本番公開時は広告・プライバシー設定、署名鍵、配布用ビルド、実機検証を別途整えます。
