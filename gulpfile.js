import gulp from "gulp";

import { server } from "./task/server/server.js";

import { css } from "./task/asset/css.js";
import { favicon } from "./task/asset/favicon.js";
import { image } from "./task/asset/image.js";
import { misc } from "./task/asset/misc.js";

import { data } from "./task/json/data.js";

import { archives } from "./task/html/archives.js";
import { feed } from "./task/html/feed.js";
import { pages } from "./task/html/pages.js";
import { posts } from "./task/html/posts.js";

// ファイル監視
export const observe = (done) => {
  gulp.watch(["./src/image/**/*"], image);
  gulp.watch(["./src/html/**/*"], template);
  gulp.watch(["./src/misc/**/*"], misc);
  gulp.watch(["./src/style/**/*"], css);
  done();
};

// ビルド
export const build = gulp.series(
  gulp.parallel(favicon, image, css, misc),
  data,
  gulp.parallel(archives, feed, pages, posts)
);

// テンプレート更新
export const template = gulp.parallel(archives, feed, pages, posts);

// 記事更新
export const md = gulp.series(
  data,
  gulp.parallel(archives, feed, pages, posts)
);

// デフォルトタスク
export default gulp.series(build, server, observe);
