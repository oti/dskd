'use strict'

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
// （post/*.md -> posts.json -> archives.json, tags.json, years.json）
// （demo/*.md -> demos.json -> demo-archives.json）
, json_posts = require('./task/json/posts')
, json_demos = require('./task/json/demos')


// HTML作成タスク ====================

// 記事個別ページ作成（post_id.md -> post_id.html）
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
  gulp.watch(['./src/style/**/*'], css)
  gulp.watch(['./src/image/**/*'], image)
  gulp.watch(['./src/misc/**/*'],  misc)
  gulp.watch(['./src/html/**/*'],  gulp.task('html'))
  // gulp.watch(['./src/md/**/*'],    gulp.task('md'))
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

  server.init,
  watch
))

// テンプレート更新
gulp.task('html', gulp.parallel(
  html_posts,
  html_archives,
  html_pages,
  feed,
  server.reload
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
