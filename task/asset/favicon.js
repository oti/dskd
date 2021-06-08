const gulp = require("gulp");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");

const favicon = () => {
  return gulp
    .src("./src/favicon.svg")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
};

module.exports = favicon;
