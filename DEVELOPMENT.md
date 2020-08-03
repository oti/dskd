# 開発

```bash
npm ci
npm start
```

ローカルサーバー `localhost:3000` が立ち上がります。

## 記事追加手順

1. `src/md/post/` に `<post-id>.md` ファイルを追加
2. `npm run md`

## デモページ追加手順

1. `src/md/demo/` に `<post-id>.md` ファイルを追加
2. `npm run md`

`<post-id>` は記事とデモで通して一意な番号です。重複するとページが正しく表示されません。

## タグ追加手順

記事にはカテゴリー的なタグを指定できます。

記事の YAML ブロックに `page_tag` フィールドで配列型式でタグ名を指定してください。

タグ名を指定するだけで、他のタグ用のファイルは必要ありません。

## デプロイ

dskd.jp は Netlify を使ってデプロイ、ホスティングしています。

`npm run build` によって生成された `htdocs/` が https://dskd.jp としてアクセス可能になっています。
