# SampleApp

日本語入力を安全に受け付ける Spring Boot アプリです。WebフォームとAPIの両方を提供します。

## YCF (Yamaoka Common Framework)
- 目的: 入力文字列のトリム・正規化を共通化し、実装のゆらぎを減らす。
- 現行バージョン: `0.1.0`
- 主要機能:
  - JSON入力の文字列自動正規化（`YcfJacksonModule`）
  - クエリ/フォーム入力の文字列自動正規化（`TrimParamFilter`）

## 起動手順
```bash
mvn -q clean test
mvn -pl app spring-boot:run
```

起動後: `http://localhost:8080`

## 環境変数
- `DB_URL` (既定: H2メモリDB)
- `DB_USER`
- `DB_PASSWORD`
- `DB_DRIVER` (PostgreSQL時は `org.postgresql.Driver`)
- `LOG_LEVEL` (既定: `INFO`)

## API
- `POST /api/messages`
  - request: `{ "content": "文字列" }`
  - response: `201 Created`
- `GET /api/messages`

## 手動受け入れテスト
1. 画面で `　ＡＢＣ　　テスト  ` を入力して保存。
2. 一覧に `ABC テスト` と表示される。
3. `curl -X POST localhost:8080/api/messages -H 'Content-Type: application/json' -d '{"content":"  Ａ  "}'`
4. `content` が `A` になっていることを確認。



## 完全初心者向けガイド
「どのアプリで、どこにコマンドを入れるのか」まで含めた手順は
`docs/BEGINNER_GUIDE.md` を参照してください。

## Gitコミット後に自動デプロイする方法（ダウンロード不要）
以下を一度設定すれば、**`main` / `master` へ push するたびに自動デプロイ**されます。

1. Render で Web Service を作成し、`app` ディレクトリをビルド対象にする（またはルートで `mvn -pl app -am package`）。
2. Render の **Deploy Hook URL** を発行する。
3. GitHub リポジトリの `Settings > Secrets and variables > Actions` に以下を登録:
   - `RENDER_DEPLOY_HOOK_URL` : Render の Deploy Hook URL（必須）
   - `APP_HEALTHCHECK_URL` : デプロイ後に疎通確認するURL（任意、例: `https://<your-app>.onrender.com/api/messages`）

設定後は `.github/workflows/auto-deploy-render.yml` が push を検知して Render へデプロイ要求を送ります。

> 補足: PR では `.github/workflows/ci.yml` が自動で `mvn -q test` を実行します。


## 開発ブランチ運用
- このリポジトリでは、今後のコミット先を `master` ブランチに統一します。
- GitHub Actions の自動デプロイは `master` への push でも実行されます。


## master にマージできない時
競合が出た場合は `docs/MERGE_GUIDE.md` の手順で、
ローカルで `master` を取り込んで解消コミットを作成してください。

## Render/Railway 配備
- Render: Build command `mvn -pl app -am package`, Start command `cd app && java -Dserver.port=$PORT -jar target/sample-app-1.0.0.jar`
- Railway: 同様に jar 実行。`DB_*` を設定すると PostgreSQL を利用可能。

## バグ再現手順テンプレ
- 前提:
- 手順:
- 期待値:
- 実際値:
- ログ:

## 既知の制約
- サンプル実装のため認証機能は未実装。
- 一覧は単純全件表示のみ（ページング未実装）。

## YCF バージョン更新フロー
1. `/commons` を更新し `commons/CHANGELOG.md` を追記、バージョンを更新。
2. 各アプリで `VERSIONS.md` と Maven `ycf.version` を更新。
3. テスト実行後、影響点をREADMEの「既知の制約」に追記。
