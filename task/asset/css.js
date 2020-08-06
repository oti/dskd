const gulp = require("gulp");
const browserSync = require("browser-sync");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csswring = require("csswring");
const mqpacker = require("css-mqpacker");
const sass = require("gulp-sass");

const css = () => {
  return gulp
    .src("./src/style/*.sass")
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer({ grid: true }), mqpacker(), csswring()]))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
};

module.exports = css;
