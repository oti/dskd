import gulp from "gulp";
import frontMatter from "gulp-front-matter";
import layout from "gulp-layout";
import md from "gulp-markdown";
import plumber from "gulp-plumber";
import prettify from "gulp-prettify";
import { getCombinedData } from "../utility/getCombinedData.js";

// ブログインデックス作成（index.md -> index.html）
export const pages = () =>
  gulp
    .src(["./src/md/index.md", "./src/md/about.md"], { allowEmpty: true })
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(({ frontMatter }) => getCombinedData(frontMatter)))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./dist/"));
