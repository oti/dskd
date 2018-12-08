const
  gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')

const misc = () => {
  return gulp.src('./src/misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./htdocs/misc/'))
    .pipe(browserSync.stream())
}

module.exports = misc
