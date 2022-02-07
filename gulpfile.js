import gulp from "gulp";

// server & browser sync
import { server } from "./task/server/server.js";

// ブログアセット作成タスク ====================
import { css } from "./task/asset/css.js";
import { favicon } from "./task/asset/favicon.js";
import { image } from "./task/asset/image.js";
import { misc } from "./task/asset/misc.js";

// 記事オブジェクト作成タスク ====================
// （post/*.md -> posts.json）
import { data } from "./task/json/data.js";

// HTML作成タスク ====================
// 記事一覧ページ作成（archives_name.md -> archives_name.html）
import { archives } from "./task/html/archives.js";
// RSS作成（feed.md -> feed）
import { feed } from "./task/html/feed.js";
// ブログインデックス作成（index.md -> index.html）
import { pages } from "./task/html/pages.js";
// 記事個別ページ作成（post_id.md -> post_id.html）
import { posts } from "./task/html/posts.js";

const watch = (done) => {
  gulp.watch(["./src/image/**/*"], image);
  gulp.watch(["./src/html/**/*"], gulp.task("html"));
  gulp.watch(["./src/misc/**/*"], misc);
  gulp.watch(["./src/style/**/*"], css);
  done();
};

// Gulpタスク ====================
// 初回起動
gulp.task(
  "default",
  gulp.series(
    gulp.parallel(favicon, image, css, misc),
    data,
    gulp.parallel(archives, feed, pages, posts),
    server,
    watch
  )
);

// テンプレート更新
gulp.task("html", gulp.parallel(archives, feed, pages, posts));

// 記事更新
gulp.task("md", gulp.series(data, gulp.parallel(archives, feed, pages, posts)));

// ビルド
gulp.task(
  "build",
  gulp.series(
    gulp.parallel(favicon, image, css, misc),
    data,
    gulp.parallel(archives, feed, pages, posts)
  )
);
