import gulp from "gulp";
import { stream } from "browser-sync";
import plumber from "gulp-plumber";

export const misc = () =>
  gulp
    .src("./src/misc/**/*")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/misc/"))
    .pipe(stream());
