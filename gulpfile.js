'use strict'

const gulp = require('gulp')

// server & browser sync
const server = require('./task/server/server')


// ブログアセット作成タスク ====================

// image
const image = require('./task/asset/image')

// css
const css = require('./task/asset/css')

// misc
const misc = require('./task/asset/misc')

// 記事オブジェクト作成タスク ====================
// （post/*.md -> posts.json -> archives.json, tags.json, years.json）
// （demo/*.md -> demos.json -> demo-archives.json）
const json_posts = require('./task/json/posts')
const json_demos = require('./task/json/demos')


// HTML作成タスク ====================

// 記事個別ページ作成（post_id.md -> post_id.html）
const html_posts = require('./task/html/posts')

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
const html_archives = require('./task/html/archives')

// ブログインデックス作成（index.md -> index.html）
const html_pages = require('./task/html/pages')

// デモ個別ページ作成（md/demo/*.md -> archives/*.html）
const html_demos = require('./task/html/demos')

// RSS作成（feed.md -> feed）
const feed = require('./task/html/feed')

// watch
const watch = done => {
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
  html_demos,

  server,
  watch
))

// テンプレート更新
gulp.task('html', gulp.series(
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
    html_demos,
    feed
  )
))

// ビルド
gulp.task('build', gulp.series(
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
  html_demos
))
