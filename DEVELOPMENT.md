# 開発

dskd は記事原稿を markdown で管理し、HTML を静的にビルドしています。

ビルドシステムは [dskdius](https://github.com/oti/dskdius) として切り出してあり、このリポジトリはその利用側です。原稿・テンプレート・CSS だけを持ちます。

## ローカル環境構築

```bash
npm ci
npm start
```

python3 でローカルサーバーが立ち上がるので**手動で** `localhost:3000` にアクセスしてください。

## dskdius の参照

publish するまでの間、package.json は隣のディレクトリを直接参照しています。

```json
"devDependencies": {
  "dskdius": "file:../dskdius"
}
```

そのため `/Users/oti/Sandobox/dskdius` を clone しておく必要があります。

> [!IMPORTANT]
> この指定のままだと GitHub Actions と Netlify では `npm ci` が壊れたシンボリックリンクを作り、`npm run build` が `dskdius: command not found` で落ちます。
> npm に publish したら `"dskdius": "^1.0.0"` に、GitHub から入れるなら `"dskdius": "github:oti/dskdius"` に差し替えてください。

## ブログ設定

プロジェクトルートの [dskdius.config.js](dskdius.config.js) にサイトのメタ情報を記述します。

書式と、テンプレートに渡る変数、ディレクトリ・URL の規約は [dskdius の README](https://github.com/oti/dskdius#readme) を参照してください。

## アセット

プリプロセッサーやトランスパイラーは利用しないハードコアスタイルです。

画像と CSS は src/ ディレクトリから dist/ へ**コピーされるだけ**なので、必要があれば事前に加工してください。

JavaScript はテンプレートか md ファイル内に直接記述してください。

## テンプレート

[src/template/](src/template/) の pug です。dskdius はテーマを同梱しないので、見た目に関するものはすべてこのリポジトリにあります。

## デプロイ

`npm run build` を実行するとプロジェクトルートに `dist/` ディレクトリが生成されます。

これをドキュメントルートとしてウェブサーバーでホスティングすればウェブサイトとして閲覧可能です。

dskd では Netlify を使ってデプロイ、ホスティングしています。

## テスト

出力された HTML と CSS を lint します。実行は npx で行い、依存モジュールとはしていません。

- [markuplint](https://github.com/markuplint/markuplint)
- [stylelint](https://github.com/stylelint/stylelint)
