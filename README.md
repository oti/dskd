# dskd version 4

dskd.jp is a memorandum of simple front-end technology.

dskdはフロントエンドについての簡単なメモブログです。2010年12月に公開し、何回かのデザインやマークアップをアップデートを経て４バージョン目となりました。複雑さのない単純な構成ですが、誰かの参考になればと思いリポジトリを公開しています。

## Build by Movable Type 6

dskdはSix Apart 社製のCMSであるMovable Type 6を使用してビルドされています。MT本体をリポジトリに含めることはできませんが、テンプレートファイルのMTMLを同梱してあります。

## MTプラグイン

dskdではMT用のプラグインを２つ使用しています。年別のアーカイブを目的のHTMLで出力するために使用しています。

+ [ArchiveDateHeader](http://kalsey.com/2002/08/archive_date_header_plugin/)
+ [ArchiveDateFooter](http://www.koikikukan.com/archives/2006/06/19-010000.php)

MTMLファイルをクローンした際は構築に注意してください。

## Server Side Include

dskdではMTで出力したHTMLをSSIを利用してインクルードしています。HTMLファイルでSSIを利用するために.htaccessファイルにAddHandlerをつけています。.htaccessはApacheでしか動作しないので注意してください。

## BEMではない

version 3系ではHTMLのスタイル管理に[BEM](http://bem.info/)の命名規則を取り入れていましたが、version 4ではやめています。若者のBEM離れです。

## Gruntによるリソースファイルのビルド

タスクランナーのGruntを使ってリソースファイルをビルドしています。

+ grunt-autoprefixer
+ grunt-contrib-sass
+ grunt-contrib-watch
+ grunt-contrib-imagemin

CSSはSassで作り、grunt-contrib-sassでコンパイルしています。JPG,GIF,PNG,SVGファイルはgrunt-contrib-imageminで最適化しています。

## ウェブフォント

[Vegur](http://dotcolon.net/font/vegur/)を導入し、欧文書体に適用しています。フォントファイルのライセンスはCC0です。

Thank you [Sora Sagano](https://twitter.com/sorasagano) for your great font!

## ライセンス

licensed by [CC BY-NC](http://creativecommons.org/licenses/by-nc/4.0/).

このリポジトリは*非営利目的に限り*自由に使用することができます。ただしその際にはこのリポジトリへのリンクとわたしの名前をクレジットに記さなければなりません。

