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

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
const archives = () => {
  return gulp.src('./src/md/archives/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('../../src/json/archives.json')
      const years = require('../../src/json/years.json')
      const tags = require('../../src/json/tags.json')
      return Object.assign(config, archives, years, tags, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/archives/'))
}

module.exports = archives
