# DMセールス台帳（PWA・オフライン完結）

Instagram DM販売向けの個人用CRMです。**自動送信は行わず**、管理・テンプレ作成・コピー支援を提供します。

## YCF について
本アプリには Yamaoka Common Framework (YCF) 0.1.0 を同梱しています。文字列のトリム＆正規化を共通化し、将来の複数アプリ展開で一貫した入力品質を担保します。

## 主機能
- リード管理（status/opt-in/次フォロー）
- ダッシュボードの今日の要フォロー表示
- テンプレ変数差し込みとコピー
- 送信前チェック（opt-in、危険表現）
- IndexedDB 永続化、JSON エクスポート/インポート
- PWA 対応（オフライン可）

## 起動方法
```bash
npm install
npm run dev
```

## テスト
```bash
npm run test
npm run build
```

## 環境変数
不要（サーバレス構成）。

## 手動受け入れテスト
1. リード新規作成
2. nextFollowUpAt を今日に設定しダッシュボード表示確認
3. テンプレ作成 `{name}` 変数の差し込み確認
4. optInStatus=denied でコピー不可確認
5. JSON エクスポート→インポートで復元確認

## 既知の制約
- 連投警告はON/OFF設定のみで、詳細しきい値は固定化未対応。
- リード一覧の複合フィルタUIは最小実装（検索＋statusクエリ）。

## 配布
```bash
npm run build
```
`dist/` を静的ホスティング（Netlify/Cloudflare Pages/GitHub Pages）へ配置。
