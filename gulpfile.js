const
  gulp = require('gulp')

// server & browser sync
, server = require('./task/server/server')


// ブログアセット作成タスク ====================

// image
, image = require('./task/asset/image')

// css
, css = require('./task/asset/css')

// misc
, misc = require('./task/asset/misc')

// 記事オブジェクト作成タスク ====================
, json_posts = require('./task/json/posts')
, json_demos = require('./task/json/demos')


// HTML作成タスク ====================

// 記事個別ページ作成（post/*.md -> posts.json -> archives.json, tags.json, years.json）
, html_posts = require('./task/html/posts')

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
, html_archives = require('./task/html/archives')

// ブログインデックス作成（index.md -> index.html）
, html_pages = require('./task/html/pages')

// デモ個別ページ作成（md/demo/pages/*.md -> demo/*.html）
, html_demos = require('./task/html/demos')

// デモインデックス作成（md/demo/index.md -> demo/index.html）
, html_demoIndex = require('./task/html/demoIndex')

// RSS作成（feed.md -> feed）
, feed = require('./task/html/feed')

// watch
, watch = done => {
  const options = {
    delay: 50,
  }

  gulp.watch('./src/style/**/*', options, css)
  gulp.watch('./src/image/**/*', options, image)
  gulp.watch('./src/misc/**/*',  options, misc)
  gulp.watch('./src/html/**/*',  options, gulp.task('html'))
  gulp.watch('./src/md/**/*',    options, gulp.task('md'))
  done()
}


// Gulpタスク ====================

// 初回起動
gulp.task('default', gulp.series(
  gulp.parallel(
    css,
    image,
    misc
  ),

  json_posts,
  gulp.parallel(
    html_posts,
    html_archives,
    html_pages,
    feed
  ),

  json_demos,
  gulp.parallel(
    html_demos,
    html_demoIndex
  ),

  server,
  watch
))

// テンプレート更新
gulp.task('html', gulp.parallel(
  html_posts,
  html_archives,
  html_pages,
  feed
))

// 記事更新
gulp.task('md', gulp.series(
  gulp.parallel(
    json_posts,
    json_demos
  ),

  gulp.parallel(
    html_posts,
    html_archives,
    html_pages,
    feed
  )
))

