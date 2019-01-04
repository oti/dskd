# dskd v6

dskd.jp is a weblog about website coding.

dskdはウェブサイト制作についての簡単な覚書と日記を主としたウェブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て6バージョン目となりました。

複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## やはりBEM（ただし刷新）

v4でさよならし、v5で再び戻ってきたBEMですが、v6でもやっぱりBEMです。CSSクラスの命名規則はよほどコンポーネントが確立したデザインでない限り、BEMおよびMindBEMdingを採用するのが最も幸福度が高いと感じています。

v5の試みだった「モジュールとなるスタイルセットをSassのmixinで持ち、必要なところにincludeしてCSSクラス名が要素の説明とスタイリングの仕事を兼任しないようにする」はある程度成功したと思っているのでv6でも同じことをしています。

ただしマークアップは刷新しました。HTML5のセマンティクスが成立していない箇所などを修正しています。

## 画像のインライン化

v6の特徴の一つとして、記事本文で利用する画像以外は全てインライン化しました。ノイジーな背景画像も、ロゴやSNSアイコンのSVGもインライン化しています。

## gulpでビルド

dskdはタスクランナーのgulpを使ってビルドしています。環境を整えるには少々特殊なリポジトリのクローン方法が必要です。

```bash
$ git clone git@github.com:oti/dskd dskd
$ cd dskd
$ git clone -b publish git@github.com:oti/dskd htdocs
```

`htdocs/` はタスクランナーの生成物が出力されるディレクトリで、ブログのドキュメントルートの想定です。

`htdocs/` の中身は `.gitignore` してあり、masterブランチには含まれません。かつ `htdocs/` ルートとしたpublishブランチを作っています。

このpublishブランチはGitHubのwebhookを利用し、dskd.jpのサーバーに同期されています。

```
dskd/ <master branch>
 ┠.gitignore
 ┠package.json
 ┠postfile.js
 ┠README.md
 ┠src/
 ┗htdocs/ <ignoired dir> && <publish branch>
  ┠css/
  ┠img/
  ┗index.html
```

この方法はhail2u.netの[サブディレクトリ－をgh-pagesへ向ける運用](http://hail2u.net/blog/software/pointing-sub-directory-to-gh-pages.html)を参考にしました。

## 開発

```bash
$ npm i
$ npm start
```

これでローカルサーバー `localhost:3000` が立ち上がります。 `src/` ディレクトリの中身は基本全て監視してあるので、変更があればビルドされます。

## 記事追加手順

1. `src/md/post/` に `<post-id>.md` ファイルを追加
3. `npm run md`

## デモ追加手順

1. `src/md/demo/page/` に `<post-id>.md` ファイルを追加
2. `npm run md`

`<post-id>` は記事とデモで一意な通し番号です。重複すると不具合を起こす可能性があります。

## デプロイ

```bash
$ git commit -am 'Add post 72'
$ git push origin master
$ cd htdocs/
$ git commit -am 'Add post 72'
$ git push origin publish
```

ソース管理をしているmasterブランチでmdファイルをcommitし、dskd.jpと同期されているhtdocsディレクトリで生成物のHTMLファイルをcommitする流れです。

---

## ライセンス

licensed by [CC BY-NC](http://creativecommons.org/licenses/by-nc/4.0/).

このリポジトリは*非営利目的に限り*自由に使用することができます。
