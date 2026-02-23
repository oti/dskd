import pkg from "./package.json" with { type: "json" };

// D: dist
export const D_POST_INDEX = "dist/posts/";
export const D_HOME = "dist/";
export const D_PAGE = "dist/";
export const D_POST = "dist/posts/";
export const D_TAG = "dist/posts/tags/";
export const D_YEAR = "dist/posts/years/";

// S: src
export const S_MD = "src/md/**/*.md";
export const S_ASSET = [
  "src/image/**/*.*",
  "src/misc/**/*.*",
  "src/style/**/*.*",
  "src/favicon.*",
];

// T: type
export const T_POST_INDEX = "posts";
export const T_HOME = "home";
export const T_PAGE = "page";
export const T_POST = "post";
export const T_FEED = "feed";
export const T_TAG = "tag";
export const T_YEAR = "year";

// pug string が dist/* に書き出されたとした場合のテンプレートへの相対パス。pwd や __direname ではないので注意
export const TEMPLATE = {
  [T_POST_INDEX]: "../../src/template/index",
  [T_HOME]: "../src/template/index",
  [T_PAGE]: "../src/template/page",
  [T_POST]: "../../src/template/post",
  [T_FEED]: "../src/template/feed",
  [T_TAG]: "../../../src/template/index",
  [T_YEAR]: "../../../src/template/index",
};

// Pugテンプレートから参照する設定
export const CONFIGS = {
  BLOG_ADDRESS: "otiext@gmail.com",
  BLOG_AUTHOR: "oti",
  BLOG_AUTHOR_EN: "oti",
  BLOG_CONTRIBUTE: "https://github.com/oti/dskd/blob/master/src/md/post/",
  BLOG_DESC: "dskd は oti による個人ウェブサイトです。",
  BLOG_FAVICON: "/favicon.svg",
  BLOG_NAME: "dskd",
  BLOG_OGP: "/image/og-image.webp",
  BLOG_TOUCH_ICON: "/image/apple-touch-icon.webp",
  BLOG_TWITTER: "dskd_jp",
  BLOG_URL: "https://dskd.jp",
  T_POST_INDEX,
  T_HOME,
  T_PAGE,
  T_POST,
  T_FEED,
  T_TAG,
  T_YEAR,
  // U: URL
  U_FEED: "/feed",
  U_PAGE: "/",
  U_POST: "/posts/",
  U_TAG: "/posts/tags/",
  U_YEAR: "/posts/years/",
  version:
    pkg && pkg.version
      ? pkg.version
      : new Date().getTime().toString().substr(0, 9),
};
