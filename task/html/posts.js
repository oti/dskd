import gulp from "gulp";
import plumber from "gulp-plumber";
import frontMatter from "gulp-front-matter";
import prettify from "gulp-prettify";
import layout from "gulp-layout";
import md from "gulp-markdown";
import { getCombinedData } from "../utility/getCombinedData";

// ブログインデックス作成（index.md -> index.html）
export const posts = () =>
  gulp
    .src("./src/md/post/*.md", { allowEmpty: true })
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(({ frontMatter }) => getCombinedData(frontMatter)))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./dist/archives/"));
