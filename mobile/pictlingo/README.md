# Pictlingo Android 全画像同梱版

[全画像入りAPKをダウンロード](https://github.com/haibaratou/etymolingo/releases/download/pictlingo-android-v0.3.0/pictlingo-offline.apk)

2026-10-07作成。既存のHTMLゲームをCapacitorでAndroidアプリ化した検証版です。

- 9月10日以降に更新され、日英の回答・解説が確認済みの全1,086問を収録。
- 出題画像をすべて同梱。追加ダウンロードなしで初回から圏外で遊べます。
- 同じ画像のPNGとパックの二重収録はしません。
- 全画面、日英切り替え、なぞり操作、採点、コレクション保存に対応。
- 音声はAndroid TextToSpeechで通常・ゆっくり再生。音声モデルは同梱せず、音質と圏外の音声再生は端末に入っている言語音声に依存します。
- 広告・課金は未搭載。デバッグ署名の検証用で、Google Play公開版ではありません。

実測容量は **242,856,163 bytes（242.86 MB / Windows表示237,165 KB）**。全1,086画像の収録とAPK署名を確認済みです。

出力は `downloads/pictlingo-offline.apk`。以前の `pictlingo-preview.apk` は全件版ではありません。

## ビルドと検証

Node.js 22以上、JDK 21以上、Android SDK 36を用意し、`build.cmd` を実行します。必要なら `JAVA_HOME` と `ANDROID_HOME` を設定してください。Android 7以上と更新済みAndroid System WebViewを対象とします。

`prepare-web.cjs` は現行ゲームから全対象を `www/` に生成します。元のゲームHTMLや辞書は変更しません。画像欠落・ハッシュ不一致ではビルドを止めます。

`npm test` は全件の画像ハッシュ、解説・日英の出題可否、通信禁止での画像準備、通常・ゆっくり音声の連携を検査します。Androidテストは `:app:assembleDebugAndroidTest` でビルドし、`com.haibaratou.pictlingo.preview.test/androidx.test.runner.AndroidJUnitRunner` で実行します。

生成物、SDK、依存パッケージ、署名鍵をGitには含めません。全件APKはGitHub Releasesで配布します。アプリIDは `com.haibaratou.pictlingo.preview` のままなので以前の検証版に上書き更新できます。記録はブラウザー版とは別です。
