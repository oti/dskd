#dskd.jp version 3.4.1
　dskd.jp は Six Apart 社製の CMS Movable Type 5 を使用してビルドされています。2010年12月に公開し、構造を変更して今回が３バージョン目です。何の変哲もない単純なブログですが、誰かの参考になればと思いリポジトリを公開いたします。

##使用プラグイン
　dskd.jp ではプラグインを３つ使用しています。リポジトリをクローンした際は構築に注意してください。使用しているプラグインの詳細は以下のとおりです。

+ [ArchiveDateHeader](http://kalsey.com/2002/08/archive_date_header_plugin/)
+ [ArchiveDateFooter](http://www.koikikukan.com/archives/2006/06/19-010000.php)
+ [PageBute](http://www.mtcms.jp/movabletype-blog/plugins/pagebute/201310232069.html)

###ArchiveDateHeader と ArchiveDateFooter
　年別のアーカイブを目的のHTMLで出力するために使用しています。
　
###PageBute
　インデックスをページ分割するために使用しています。

---
##BEM
　HTML のスタイル管理に [BEM](http://bem.info/) の命名規則を取り入れています。CSS ファイルも合わせてリポジトリにあるので、参考になるかもしれません。

　dskd.jp の BEM はまだ発展途上です。テスト的に BEM を取り入れたため不自然な部分が多分に含まれているかと思います。今後もアップデートしていくつもりですが、疑問に思うこともあるのである日突然 BEM をやめるかもしれません。

##License
　Copyright (c) 2014 oti/dskd Licensed under the MIT license.

　MTML、および CSS ファイルは MIT License の元に公開しています。
