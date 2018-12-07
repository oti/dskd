const
  gulp = require('gulp')
, browserSync = require('browser-sync')
, plumber = require('gulp-plumber')
, imagemin = require('gulp-imagemin')

const image = () => {
  return gulp.src('./src/image/**/*')
    .pipe(plumber())
    // .pipe(imagemin([
    //   imagemin.gifsicle({interlaced: true}),
    //   imagemin.jpegtran({progressive: true}),
    //   imagemin.optipng({optimizationLevel: 5}),
    //   imagemin.svgo({
    //     plugins: [
    //       {removeViewBox: false},
    //       {cleanupIDs: true}
    //     ]
    //   })
    // ]))
    .pipe(gulp.dest('./htdocs/img/'))
    .pipe(browserSync.stream())
}

module.exports = image
