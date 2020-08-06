const gulp = require("gulp");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");

const misc = () => {
  return gulp
    .src("./src/misc/**/*")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/misc/"))
    .pipe(browserSync.stream());
};

module.exports = misc;
