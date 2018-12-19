const package = require('../../package.json')
const fs = require('fs')
const gulp = require('gulp')
const browserSync = require('browser-sync')
const plumber = require('gulp-plumber')
const jsonPretty = require('json-pretty')
const frontMatter = require('gulp-front-matter')
const prettify = require('gulp-prettify')
const layout = require('gulp-layout')
const md = require('gulp-markdown')
const config = require('../../blogconfig.json')

config.blog_version = package.version

// デモ個別ページ作成（md/demo/pages/*.md -> demo/*.html）
const demos = () => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      return Object.assign(config, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/demo/'))
}

module.exports = demos
