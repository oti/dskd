# dskd v6

dskd.jp is a weblog about website coding.

dskdはウェブサイト制作についての簡単な覚書と日記を主としたウェブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て6バージョン目となりました。

複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## やはりBEM（ただし刷新）

v4でさよならし、v5で再び戻ってきたBEMですが、v6でもやっぱりBEMです。CSSクラスの命名規則はよほどコンポーネントが確立したデザインでない限り、BEMおよびMindBEMdingを採用するのが最も幸福度が高いと感じています。

v5の試みだった「モジュールとなるスタイルセットをSassのmixinで持ち、必要なところにincludeしてCSSクラス名が要素の説明とスタイリングの仕事を兼任しないようにする」はある程度成功したように思われます。

しかし、**同じスタイルなら一つのクラス名で扱われるべき**だと思い直しました。内容が違うけどデザインが同じBlockを、わざわざ別名で説明することに大きな利点を実感できなかったのが主な理由です。

よってマークアップは刷新しました。これにより要素を説明しているようなクラス名とスタイルを説明しているようなクラス名が混在していますが、v6においては**そういうBlockなのだ**と言い切ることにしています。

## 画像のインライン化

v6の特徴の一つとして、記事本文で利用する画像以外は全てインライン化しました。ノイジーな背景画像も、ロゴやSNSアイコンのSVGもインライン化しています。

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
- gulp-merge-media-queries
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
