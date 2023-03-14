# 開発

dskd は md（マークダウン）ファイルでコンテンツを管理し、HTML を静的にビルドするブログシステムです。

## コンセプト

ブログのテンプレートを開発するときは、静的ウェブサイトのビルド環境と同じように。

ブログの記事を執筆するときは、md ファイルだけ触ればいいように。

テンプレートと原稿（コンテンツ）を可能な分離して、コンテンツの追加・編集ではを md ファイルにだけ関心を持てばいいように作りました。

静的ウェブサイトとしてビルドされるので、JS フレームワークとの親和性は考慮していません。

## ローカル環境構築

```bash
npm ci
npm start
```

python3 でローカルサーバーが立ち上がるので**手動で** `localhost:3000` にアクセスしてください。

### アセットはハードコア

プリプロセッサーやトランスパイラーは利用しません。

画像と CSS は src/ ディレクトリから dist/ へ**コピーされるだけ**です。

JavaScript はテンプレートか md ファイル内に直接記述してください。

### テンプレート

pug を利用しています。

記事のメタ情報やブログの設定情報、年別リストやタグ別リストの情報が格納された巨大なオブジェクトを内部で受け取り、テンプレートで利用しています。

## デプロイ

`npm run build` を実行するとプロジェクトルートに `dist/` ディレクトリが生成されます。

これをドキュメントルートとしてウェブサーバーでホスティングすればウェブサイトとして閲覧可能です。

dskd では Netlify を使ってデプロイ、ホスティングしています。

## 依存モジュール

ビルドは以下のモジュールに依存しています。

- [fast-glob](https://github.com/mrmlnc/fast-glob)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [marked](https://github.com/markedjs/marked)
- [pug](https://github.com/pugjs/pug)

テスト実行は以下のモジュールに依存しています。

- [markuplint](https://github.com/markuplint/markuplint)
- [stylelint](https://github.com/stylelint/stylelint)

git コミット時に prettier を実行するため husky を利用しています。

- [husky](https://github.com/typicode/husky)
