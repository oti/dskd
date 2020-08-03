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
      layout(function (file) {
        const neighbors = require("../../src/json/neighbors.json");
        return Object.assign(config, neighbors, file.frontMatter);
      })
    )
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./htdocs/archives/"));
};

module.exports = posts;
