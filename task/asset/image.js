const gulp = require("gulp");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");

const image = () => {
  return gulp
    .src("./src/image/**/*")
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: true }],
        }),
      ])
    )
    .pipe(gulp.dest("./dist/img/"))
    .pipe(browserSync.stream());
};

module.exports = image;
