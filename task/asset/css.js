import gulp from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import mqpacker from "css-mqpacker";

export const css = () =>
  gulp
    .src("./src/style/*.css")
    .pipe(plumber())
    .pipe(postcss([autoprefixer({ grid: true }), mqpacker()]))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
