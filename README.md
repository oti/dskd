# dskd version 5

dskd.jp is a memorandum of simple front-end technology.

dskdはフロントエンドについての簡単なメモブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て5バージョン目となりました。複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## Build by gulp

dskdはタスクランナーのgulpを使ってビルドしています。HTMLはJade、CSSはSassを利用しています。使用プラグインは以下の通りです。

+ gulp-sass
+ gulp-autoprefixer
+ gulp-imagemin
+ gulp-plumber
+ gulp-watch
+ gulp-sourcemap
+ run-sequence
+ browser-sync

## gulpfile.jsは「ブログのビルド」

ウェブサイトとしてのブログをビルドするタスクはgulpfile.jsに集められています。gulpfile.jsはSassのコンパイルと画像の最適化処理、およびそれらをwatchするのみです。

ローカルサーバーを立ち上げ、Sassをwatchするタスクは `gulp default` です。

```
$ gulp
```

## postfile.jsは「記事のビルド」

記事をHTMLへコンパイルするタスクはpostfile.jsに集めました。posfile.jsでは `md/post/*.md` と `md/demo/page/*.md` を全てあさってさまざまなjsonファイルを作り、frontMatterでそれらのjsonをマージしながらHTMLを書き出しています。

```
$ gulp build:html --gulpfile postfile.js
```

## 生成物は .gitignore
タスクランナーの生成物は `htdocs/` に出力されます。このディレクトリはブログのドキュメントルートの想定です。

`htdocs/` の中身は `.gitignore` してあり、masterブランチには含まれません。`htdocs/` ルートとしたpublishブランチを作っています。

このpublishブランチはGitHubのウェブフックを利用し、dskd.jpのサーバーに同期されています。

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


## 再びBEM

version 4でさよならしたBEMですが、再び戻ってきました。これは成功かもしれないし、失敗かもしれません。

v5の試みとして、モジュールとなるスタイルセットをSassのmixinで持ち、必要なところにincludeする方式をとっています。BEMの命名規則にスタイルの仕事を兼任させないことが目的で、これによりクラス名とモジュールの結びつきをゼロにして、詳細度の高いセレクタでの上書きの必要をなくしています。

## ウェブフォント

[Vegur](http://dotcolon.net/font/vegur/)を導入し、欧文書体に適用しています。フォントファイルのライセンスはCC0です。

Thank you [Sora Sagano](https://twitter.com/sorasagano) for your great font!

## ライセンス

licensed by [CC BY-NC](http://creativecommons.org/licenses/by-nc/4.0/).

このリポジトリは*非営利目的に限り*自由に使用することができます。
