import gulp from "gulp";
import plumber from "gulp-plumber";
import frontMatter from "gulp-front-matter";
import prettify from "gulp-prettify";
import layout from "gulp-layout";
import md from "gulp-markdown";
import { getCombinedData } from "../utility/getCombinedData";

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
export const archives = () =>
  gulp
    .src("./src/md/archives/*.md")
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(({ frontMatter }) => getCombinedData(frontMatter)))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./dist/archives/"));
