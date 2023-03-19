# 開発

dskd は記事原稿を markdown で管理し、HTML を静的にビルドするブログ向け SSG です。

## コンセプト

『小さなブログなら小さな環境で。』

dskd は小さな開発環境を追い求めています。省ける処理は省き、シンプルで小さなビルドタスクになるようにしました。

## ローカル環境構築

```bash
npm ci
npm start
```

python3 でローカルサーバーが立ち上がるので**手動で** `localhost:3000` にアクセスしてください。

### ブログ設定

dskd.config.js に入出力のパスやウェブサイトのメタ情報を記述します。

pug テンプレートから参照されるキーは `CONFIGS {}` に含めてください。

### アセット

プリプロセッサーやトランスパイラーは利用しないハードコアスタイルです。

画像と CSS は src/ ディレクトリから dist/ へ**コピーされるだけ**なので、必要があれば事前に加工してください。

JavaScript はテンプレートか md ファイル内に直接記述してください。

### テンプレート

pug を利用しています。

記事のメタ情報やブログの設定情報、年別リストやタグ別リストの情報が格納された巨大なオブジェクトを内部で受け取り、テンプレートで引き当てて HTML をビルドしています。

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
