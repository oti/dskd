# dskd version 5

dskd.jp is a memorandum of simple front-end technology.

dskdはフロントエンドについての簡単なメモブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て5バージョン目となりました。複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## 再びBEM

version 4でさよならしたBEMですが、再び戻ってきました。これは成功かもしれないし、失敗かもしれません。

v5の試みとして、モジュールとなるスタイルセットをSassのmixinで持ち、必要なところにincludeする方式をとっています。BEMの命名規則にスタイルの仕事を兼任させないことが目的で、これによりクラス名とモジュールの結びつきをゼロにして、詳細度の高いセレクタでの上書きの必要をなくしています。

## ウェブフォント

[Vegur](http://dotcolon.net/font/vegur/)を導入し、欧文書体に適用しています。フォントファイルのライセンスはCC0です。

Thank you [Sora Sagano](https://twitter.com/sorasagano) for your great font!

## Build by gulp

dskdはタスクランナーのgulpを使ってビルドしています。ウェブサイトとしてのビルドとブログ記事のビルドの2種類のビルドがあります。環境を整えるには少々特殊なクローン方法が必要です。

```
$ git clone git@github.com:oti/dskd dskd
$ cd dskd
$ git clone -b publish git@github.com:oti/dskd htdocs
```

`htdocs/` はタスクランナーの生成物が出力されるディレクトリです。publishブランチを再度クローンしている理由は後述しています。

## gulpfile.jsは「ブログのビルド」

ウェブサイトとしてのブログをビルドするタスクはgulpfile.jsに集められています。gulpfile.jsはSassのコンパイルと画像の最適化処理、およびそれらをwatchするのみです。

ローカルサーバーを立ち上げ、Sassをwatchするタスクは `gulp default` です。

```
$ gulp
```

使用プラグインは以下の通りです。

- gulp-sass
- gulp-autoprefixer
- gulp-imagemin
- gulp-plumber
- gulp-watch
- gulp-sourcemap
- run-sequence
- browser-sync

特に難しいことはしていないので、gulpfile.jsを見ればだいたいわかると思います。

## postfile.jsは「記事のビルド」

記事をHTMLへコンパイルするタスクはpostfile.jsに集めました。posfile.jsでは `md/post/*.md` と `md/demo/page/*.md` を全てあさってfront matterなどでさまざまなjsonファイルを作り、それらのjsonをマージしながらHTMLを書き出しています。

```
$ gulp build:html --gulpfile postfile.js
```

使用プラグインは以下の通りです。

- fs
- gulp-front-matter
- gulp-prettify
- gulp-imagemin
- gulp-layout
- gulp-markdown
- gulp-markdown-to-json
- gulp-plumber
- gulp-rename
- gulp-util
- lodash
- run-sequence
- through2

## 生成物は .gitignore

タスクランナーの生成物は `htdocs/` に出力されます。このディレクトリはブログのドキュメントルートの想定です。

`htdocs/` の中身は `.gitignore` してあり、masterブランチには含まれません。`htdocs/` ルートとしたpublishブランチを作っています。

このpublishブランチはGitHubのwebhookを利用し、dskd.jpのサーバーに同期されています。

```
dskd/ <master branch>
 ┠.gitignore
 ┠package.json
 ┠gulpfile.js
 ┠postfile.js
 ┠README.md
 ┠src/
 ┗htdocs/ <ignoired dir> && <publish branch>
  ┠css/
  ┠img/
  ┗index.html
```

この方法はhail2u.netの[サブディレクトリ－をgh-pagesへ向ける運用](http://hail2u.net/blog/software/pointing-sub-directory-to-gh-pages.html)を参考にしました。

## 記事追加手順

1. `src/md/post/` に `<post-id>.md` ファイルを追加
2. 記事のタグが新規の場合、 `src/md/archives/` に `<tag-name>.md` ファイルを追加
3. `npm run build:html`

## デモ追加手順

1. `src/md/demo/page/` に `<post-id>.md` ファイルを追加
2. `npm run build:html`

`<post-id>` は記事とデモで一意な通し番号です。重複すると不具合を起こす可能性があります。

`<tag-name>` はSafe URLな文字列です。全て小文字で、タグ名のスペースは `_` に変換してください。

- `Advent Calendar` -> `advent_calender`

## デプロイ

```
$ cd dskd
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
