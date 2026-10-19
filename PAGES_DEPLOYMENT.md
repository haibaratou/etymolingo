# GitHub Pages の配信

GitHub Pages の Source は GitHub Actions。main の更新で `.github/workflows/pages-runtime.yml` が起動する。

- `tools/build_pages.py` は `_site` に実行用ファイルをコピーする。リポジトリの資料・画像・ローカル用ファイルは変更も削除もしない。
- PNG/WebP等のメディアと、画像を重複保持していた scene-assets パックは、同じ公開リポジトリのコミット固定 raw URL から取得する。画素、ファイルのバイト列、画像ハッシュは変えない。
- 辞書JSONと語義・画像の対応情報はそのまま。画像URLの変換は配信時に追加する `pages-assets.js` が行う。ローカルHTMLには追加しない。
- 主要UI画像はPagesに保持。オフライン用パックは既存の明示的保存・ハッシュ検証を維持し、Pages版だけ読み込みをfetchと安全なJSON解析に切り替える。
- サイト用の容量が900MBを超えた場合は公開前に停止する。出力の `deployment-manifest.json` に容量とコミットを記録する。
- raw.githubusercontent.comへの接続が必要。別のCDNや画像変換を導入する場合、辞書の画像ハッシュ検証を無効化しないこと。
- 配信先だけのバイト変換やファイル移動をローカル正本に逆輸入しないこと。

テスト: `python tools/test_pages_build.py` と `node tools/test_pages_assets.cjs`。
