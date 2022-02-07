import gulp from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";

export const favicon = () =>
  gulp
    .src("./src/favicon.svg")
    .pipe(plumber())
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream());
