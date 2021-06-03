const package = require("../../package.json");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const frontMatter = require("gulp-front-matter");
const prettify = require("gulp-prettify");
const layout = require("gulp-layout");
const md = require("gulp-markdown");
const config = require("../../blogconfig.json");

config.blog_version = package.version;

// 全記事作成（post_id.md -> post_id.html）
const posts = () => {
  return gulp
    .src("./src/md/post/*.md")
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(
      layout((file) => ({
        ...config,
        ...file.frontMatter,
        ...require("../../src/json/posts.json"),
      }))
    )
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./dist/archives/"));
};

module.exports = posts;
