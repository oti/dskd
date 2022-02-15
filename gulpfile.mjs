import gulp from "gulp";

import { server } from "./task/server/server.mjs";

import { css } from "./task/asset/css.mjs";
import { favicon } from "./task/asset/favicon.mjs";
import { image } from "./task/asset/image.mjs";
import { misc } from "./task/asset/misc.mjs";

import { data } from "./task/json/data.mjs";

import { html } from "./task/html/html.mjs";

export const archives = () =>
  html({ src: "./src/md/archives/**/*.md", dest: "./dist/archives/" });
export const feed = () =>
  html({ src: "./src/md/feed.md", dest: "./dist/", extname: ".xml" });
export const pages = () =>
  html({ src: "./src/md/{*, !feed}.md", dest: "./dist/" });
export const posts = () =>
  html({ src: "./src/md/post/*.md", dest: "./dist/archives/" });

// アセット更新
export const asset = gulp.parallel(favicon, image, css, misc);

// テンプレート更新
export const template = gulp.parallel(archives, feed, pages, posts);

// 記事更新
export const md = gulp.series(data, posts);

// ビルド
export const build = gulp.series(asset, data, template);

// ファイル監視
export const observe = (done) => {
  gulp.watch(["./src/html/**/*"], template);
  gulp.watch(["./src/image/**/*"], image);
  gulp.watch(["./src/misc/**/*"], misc);
  gulp.watch(["./src/style/**/*"], css);
  done();
};

// デフォルトタスク
export default gulp.series(build, server, observe);
