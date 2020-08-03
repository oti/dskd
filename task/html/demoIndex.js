const package = require("../../package.json");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const frontMatter = require("gulp-front-matter");
const prettify = require("gulp-prettify");
const layout = require("gulp-layout");
const md = require("gulp-markdown");
const config = require("../../blogconfig.json");

config.blog_version = package.version;

// デモインデックス作成（md/demo/index.md -> demo/index.html）
const demoIndex = () => {
  return gulp
    .src("./src/md/demo/index.md", { allowEmpty: true })
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(
      layout(function (file) {
        const demos = require("../../src/json/demo-archives.json");
        return Object.assign(config, demos, file.frontMatter);
      })
    )
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(gulp.dest("./htdocs/demo/"));
};

module.exports = demoIndex;
