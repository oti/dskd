import gulp from "gulp";
import frontMatter from "gulp-front-matter";
import gulpIf from "gulp-if";
import layout from "gulp-layout";
import md from "gulp-markdown";
import plumber from "gulp-plumber";
import prettify from "gulp-prettify";
import rename from "gulp-rename";
import { getCombinedData } from "../utility/getCombinedData.mjs";

export const html = ({ src, dest, extname }) =>
  gulp
    .src(src, { allowEmpty: true })
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(({ frontMatter }) => getCombinedData(frontMatter)))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulpIf(() => extname === ".xml", rename({ extname: ".xml" })))
    .pipe(gulp.dest(dest));
