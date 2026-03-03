# master マージ競合の解消手順

GitHub 上で「このブランチには解決しなければならない競合があります」と表示された場合は、
ローカルで `master` を取り込んで競合解消コミットを作るのが最短です。

## 手順

```bash
# 1) 作業ブランチへ移動
git checkout work

# 2) master の最新を取り込む
#   (remote 名が origin 以外なら読み替え)
git fetch origin
git merge origin/master

# 3) 競合ファイルを編集し、<<<<<<< / ======= / >>>>>>> を解消
#   例: README.md, docs/CHANGELOG.md

# 4) 競合解消をステージしてコミット
git add README.md docs/CHANGELOG.md
git commit -m "Resolve merge conflicts with master"

# 5) ブランチを push
git push origin work
```

## どちらを残すかの判断基準

- **README.md**: 新しい運用手順（自動デプロイ、master 運用）を優先。
- **docs/CHANGELOG.md**: 変更履歴は両方残す（片方を消さない）。

## マージを通しやすくするコツ

- `master` へ定期的に追随 (`git merge origin/master`) してから PR を更新する。
- README の同じ行を複数人で同時編集しない（章を分ける）。
- changelog は「先頭追記」ではなく「日付セクション内追記」に揃える。
