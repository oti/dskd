import gulp from "gulp";
import frontMatter from "gulp-front-matter";
import layout from "gulp-layout";
import md from "gulp-markdown";
import plumber from "gulp-plumber";
import prettify from "gulp-prettify";
import rename from "gulp-rename";
import { getCombinedData } from "../utility/getCombinedData.js";

// RSS作成（feed.md -> feed）
export const feed = () =>
  gulp
    .src("./src/md/feed.md", { allowEmpty: true })
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(({ frontMatter }) => getCombinedData(frontMatter)))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(rename({ extname: ".xml" }))
    .pipe(gulp.dest("./dist/"));
