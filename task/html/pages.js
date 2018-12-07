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


// ブログインデックス作成（index.md -> index.html）
const pages = () => {
  return gulp.src(['./src/md/index.md', './src/md/about.md'], {allowEmpty:true})
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('../../src/json/archives.json')
      return Object.assign(blogConfig, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/'))
}

module.exports = pages
