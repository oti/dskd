# dskd v7

dskd.jp is a weblog about website coding.

dskdはウェブサイト制作についての簡単な覚書と日記を主としたウェブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て7バージョン目となりました。

複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## やはりBEM（ただし刷新）

v4でさよならし、v5で再び戻ってきたBEMですが、v6ももv7でもやっぱりBEMです。CSSクラスの命名規則はよほどコンポーネントが確立したデザインでない限り、BEMおよびMindBEMdingを採用するのが最も幸福度が高いと感じています。

v5の試みだった「モジュールとなるスタイルセットをSassのmixinで持ち、必要なところにincludeしてCSSクラス名が要素の説明とスタイリングの仕事を兼任しないようにする」はある程度成功したと思っているのでv7でも同じことをしています。

## 画像を極力使わない

v7では、記事本文で利用する画像以外ではロゴのみをインラインSVGにし、他のアイコンの利用をやめました。

## 開発

```bash
git clone git@github.com:oti/dskd
cd dskd
npm ci
npm start
```

これでローカルサーバー `localhost:3000` が立ち上がります。

## 記事追加手順

1. `src/md/post/` に `<post-id>.md` ファイルを追加
3. `npm run md`

## デモ追加手順

1. `src/md/demo/` に `<post-id>.md` ファイルを追加
2. `npm run md`

`<post-id>` は記事とデモ通して一意な番号です。重複すると不具合を起こす可能性があります。

## デプロイ

dskd.jpはNetlifyを使ってデプロイ、ホスティングしています。

`npm run build` によって生成された `htdocs/` が https://dskd.jp としてアクセス可能になっています。

---

## ライセンス

licensed by [CC BY-NC](http://creativecommons.org/licenses/by-nc/4.0/).

このリポジトリは*非営利目的に限り*自由に使用することができます。
