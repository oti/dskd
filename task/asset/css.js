const
  gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')
, postcss = require('gulp-postcss')
, autoprefixer = require('autoprefixer')
, csswring = require('csswring')
, mqpacker = require('css-mqpacker')
, sass = require('gulp-sass')

const css = () => {
  return gulp.src('./src/style/*.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({grid: true}),
      mqpacker(),
      csswring()
    ]))
    .pipe(gulp.dest('./htdocs/css/'))
    .pipe(browserSync.stream())
}

module.exports = css
