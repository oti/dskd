const fs = require('fs')
, gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')
, jsonPretty = require('json-pretty')
, frontMatter = require('gulp-front-matter')
, prettify = require('gulp-prettify')
, layout = require('gulp-layout')
, md = require('gulp-markdown')
, blogConfig = require('../../blogconfig.json')


// デモ個別ページ作成（md/demo/pages/*.md -> demo/*.html）
const demos = () => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      return Object.assign(blogConfig, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/demo/'))
}

module.exports = demos
