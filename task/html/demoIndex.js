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


// デモインデックス作成（md/demo/index.md -> demo/index.html）
const demoIndex = () => {
  return gulp.src('./src/md/demo/index.md', {allowEmpty:true})
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const demos = require('../../src/json/demo-archives.json')
      return Object.assign(blogConfig, demos, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/demo/'))
}

module.exports = demoIndex
