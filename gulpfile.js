import gulp from "gulp";

// server & browser sync
import { server } from "./task/server/server.js";

// アセット作成タスク
import { css } from "./task/asset/css.js";
import { favicon } from "./task/asset/favicon.js";
import { image } from "./task/asset/image.js";
import { misc } from "./task/asset/misc.js";

// 記事オブジェクト作成（post/*.md -> posts.json）
import { data } from "./task/json/data.js";

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
import { archives } from "./task/html/archives.js";
// RSS作成（feed.md -> feed）
import { feed } from "./task/html/feed.js";
// ブログインデックス作成（index.md -> index.html）
import { pages } from "./task/html/pages.js";
// 記事個別ページ作成（post_id.md -> post_id.html）
import { posts } from "./task/html/posts.js";

// ファイル監視
export const observe = (done) => {
  gulp.watch(["./src/image/**/*"], image);
  gulp.watch(["./src/html/**/*"], gulp.task("html"));
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
export const pug = gulp.parallel(archives, feed, pages, posts);

// 記事更新
export const md = gulp.series(
  data,
  gulp.parallel(archives, feed, pages, posts)
);

// デフォルトタスク
export default gulp.series(build, server, observe);
