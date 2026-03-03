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
