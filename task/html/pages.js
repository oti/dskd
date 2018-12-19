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

// ブログインデックス作成（index.md -> index.html）
const pages = () => {
  return gulp.src(['./src/md/index.md', './src/md/about.md'], {allowEmpty:true})
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('../../src/json/archives.json')
      return Object.assign(config, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/'))
}

module.exports = pages
