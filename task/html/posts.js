const
  package = require('../../package.json')
, fs = require('fs')
, gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')
, jsonPretty = require('json-pretty')
, frontMatter = require('gulp-front-matter')
, prettify = require('gulp-prettify')
, layout = require('gulp-layout')
, md = require('gulp-markdown')
, config = require('../../blogconfig.json')

config.blog_version = package.version

// 全記事作成（post_id.md -> post_id.html）
const posts = () => {
  return gulp.src('./src/md/post/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const neighbors = require('../../src/json/neighbors.json')
      return Object.assign(config, neighbors, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/archives/'))
}

module.exports = posts
