# dskd version 5

dskd.jp is a memorandum of simple front-end technology.

dskdはフロントエンドについての簡単なメモブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て5バージョン目となりました。複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## Build by gulp

dskdはタスクランナーのgulpを使ってビルドしています。HTMLはJade、CSSはSassを利用しています。使用プラグインは以下の通りです。

+ gulp-jade
+ gulp-sass
+ gulp-autoprefixer
+ gulp-imagemin
+ gulp-plumber
+ gulp-watch
+ gulp-sourcemap
+ run-sequence
+ browser-sync

## 生成物は .gitignore
タスクランナーの生成物は `htdocs/` に出力されます。このディレクトリはブログのドキュメントルートの想定です。

`htdocs/` の中身は `.gitignore` してあり、masterブランチには含まれません。`htdocs/` ルートとしたpublishブランチを作っています。

このpublishブランチはGitHubのウェブフックを利用し、dskd.jpのサーバーに同期されています。

```
dskd/ <master branch>
 ┠.gitignore
 ┠package.json
 ┠gulpfile.js
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

## ウェブフォント

[Route 159](http://dotcolon.net/font/route159/)を導入し、欧文書体に適用しています。フォントファイルのライセンスはCC0です。

Thank you [Sora Sagano](https://twitter.com/sorasagano) for your great font!

## ライセンス

licensed by [CC BY-NC](http://creativecommons.org/licenses/by-nc/4.0/).

このリポジトリは*非営利目的に限り*自由に使用することができます。ただしその際にはこのリポジトリへのリンクとわたしの名前をクレジットに記さなければなりません。
