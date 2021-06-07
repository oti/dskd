const gulp = require("gulp");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const mqpacker = require("css-mqpacker");

const css = () => {
  return gulp
    .src("./src/style/*.css")
    .pipe(plumber())
    .pipe(postcss([autoprefixer({ grid: true }), mqpacker()]))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
};

module.exports = css;
