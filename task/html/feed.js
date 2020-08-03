const package = require('../../package.json')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const frontMatter = require('gulp-front-matter')
const prettify = require('gulp-prettify')
const layout = require('gulp-layout')
const md = require('gulp-markdown')
const rename = require('gulp-rename')
const config = require('../../blogconfig.json')

config.blog_version = package.version

// RSS作成（feed.md -> feed）
const feed = () => {
  return gulp.src('./src/md/feed.md', {allowEmpty:true})
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('../../src/json/archives.json')
      return Object.assign(config, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rename({extname: '.xml'}))
    .pipe(gulp.dest('./htdocs/'))
}

module.exports = feed
