const fs = require('fs')
, gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')
, jsonPretty = require('json-pretty')
, frontMatter = require('gulp-front-matter')
, prettify = require('gulp-prettify')
, layout = require('gulp-layout')
, md = require('gulp-markdown')
, rename = require('gulp-rename')
, blogConfig = require('../../blogconfig.json')

// RSS作成（feed.md -> feed）
const feed = () => {
  return gulp.src('./src/md/feed.md', {allowEmpty:true})
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('../../src/json/archives.json')
      return Object.assign(blogConfig, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rename({extname: '.xml'}))
    .pipe(gulp.dest('./htdocs/'))
}

module.exports = feed
