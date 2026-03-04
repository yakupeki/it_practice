# CHANGELOG

## 2026-03-03
- 超初心者向けに、実行アプリ名・起動手順・コマンド入力場所まで含めた `docs/BEGINNER_GUIDE.md` を追加。
- `master` マージ競合の解消手順を `docs/MERGE_GUIDE.md` に追加。
- ブランチ運用方針として、コミット先を `master` に統一する旨を README に追記。
- Git push 後に自動デプロイできるよう GitHub Actions を追加（Render Deploy Hook 連携）。
- PR 時に自動テストを実行する CI ワークフローを追加。
- 旧JSPサンプルファイル（`index.html`, `parameterJsp.jsp`）を削除し、構成を Spring Boot に一本化。

## 2026-03-03
- 初版作成: SampleApp + YCF 0.1.0 を同梱。
