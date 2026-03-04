# 超初心者向けガイド（何のアプリで何をするか）

このガイドは、**プログラミング未経験**の方が
「コードをダウンロードせずに、GitHub と Render だけで公開運用する」ための手順です。

---

## 0. まず使うアプリ（ツール）

このプロジェクトで使うのは基本的に次の 3 つです。

1. **ブラウザ**（Chrome / Edge）
   - GitHub と Render の画面操作に使います。
2. **GitHub**（Webサービス）
   - ソースコード保管、変更管理、Actions 実行。
3. **Render**（Webサービス）
   - アプリを公開（デプロイ）する場所。

> 重要: 公開運用だけなら、最初は「ローカルで毎回起動」しなくても進められます。

---

## 1. 事前準備（アカウント作成）

### 1-1. GitHub アカウントを作る
1. ブラウザで `https://github.com` を開く。
2. `Sign up` からアカウント作成。
3. メール認証を完了。

### 1-2. Render アカウントを作る
1. ブラウザで `https://render.com` を開く。
2. `Get Started` からアカウント作成。
3. GitHub 連携を許可。

---

## 2. 「公開アプリ」を1回作る（Render側）

1. Render の Dashboard で `New +` → `Web Service` を押す。
2. GitHub リポジトリを選択。
3. 設定値を入力：
   - **Root Directory**: `app`
   - **Build Command**: `mvn -pl app -am package`
   - **Start Command**: `cd app && java -Dserver.port=$PORT -jar target/sample-app-1.0.0.jar`
4. `Create Web Service` を押す。
5. 初回デプロイ完了を待つ。

完了すると `https://xxxx.onrender.com` のような URL が発行されます。

---

## 3. 自動デプロイ設定（GitHub Actions）

このリポジトリには、push をきっかけに Render にデプロイ要求を送る設定があります。

- 設定ファイル: `.github/workflows/auto-deploy-render.yml`
- 対象ブランチ: `main` / `master`

### 3-1. Render で Deploy Hook URL を作成
1. Render で対象サービスを開く。
2. `Settings` → `Deploy Hook` を作成。
3. 表示された URL をコピー。

### 3-2. GitHub に Secret を登録
1. GitHub リポジトリを開く。
2. `Settings` → `Secrets and variables` → `Actions`。
3. `New repository secret` で以下を登録。
   - `RENDER_DEPLOY_HOOK_URL` : さきほどの URL（必須）
   - `APP_HEALTHCHECK_URL` : 例 `https://xxxx.onrender.com/api/messages`（任意）

これで、`master` へ push すると自動デプロイされます。

---

## 4. 「コマンド」はどこで実行するの？

### Windows の場合
使うアプリは **PowerShell** です。

#### 開き方
1. キーボードの `Windows` キーを押す。
2. `PowerShell` と入力。
3. `Windows PowerShell` をクリック。

#### コマンドを実行する場所を移動
次を入力して Enter。

```powershell
cd C:\作業フォルダ\it_practice
```

> `C:\作業フォルダ\it_practice` は、あなたの保存先に置き換えてください。

#### 実行例
```powershell
git status
git add .
git commit -m "更新"
git push origin master
```

---

## 5. 変更して公開する最短フロー（毎回これ）

1. コードを変更（GitHub Web でもOK）。
2. `master` に push。
3. GitHub の `Actions` タブで workflow 成功を確認。
4. Render の Dashboard でデプロイ成功を確認。
5. 公開 URL をブラウザで開いて動作確認。

---

## 6. つまずきポイントと対処

### Q1. 「master にマージできない（競合）」
- `docs/MERGE_GUIDE.md` の手順で解消してください。

### Q2. デプロイされない
- GitHub Secret `RENDER_DEPLOY_HOOK_URL` が正しいか確認。
- Actions のログにエラーが出ていないか確認。

### Q3. アプリが開かない
- Render 側ログを確認。
- `Start Command` が一致しているか再確認。

---

## 7. 販売前チェック（最低限）

- [ ] 公開 URL が常に開ける
- [ ] 利用規約 / プライバシーポリシーの準備
- [ ] 問い合わせ先メールの準備
- [ ] 障害時の案内文テンプレ準備

