import gulp from "gulp";
import autoprefixer from "autoprefixer";
import { stream } from "browser-sync";
import mqpacker from "css-mqpacker";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";

export const css = () =>
  gulp
    .src("./src/style/*.css")
    .pipe(plumber())
    .pipe(postcss([autoprefixer({ grid: true }), mqpacker()]))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(stream());
