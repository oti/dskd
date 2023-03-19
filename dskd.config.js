import pkg from "./package.json" assert { type: "json" };

// D: dist
export const D_ARCHIVE = "dist/archives/";
export const D_HOME = "dist/";
export const D_PAGE = "dist/";
export const D_POST = "dist/archives/";
export const D_TAG = "dist/archives/tags/";
export const D_YEAR = "dist/archives/years/";

// S: src
export const S_MD = "src/md/**/*.md";
export const S_ASSET = "src/({image,misc,style}/**/*|favicon.*)";

// T: type
export const T_ARCHIVE = "archives";
export const T_HOME = "home";
export const T_PAGE = "page";
export const T_POST = "post";
export const T_FEED = "feed";
export const T_TAG = "tag";
export const T_YEAR = "year";

// pug string が dist/* に書き出されたとした場合のテンプレートへの相対パス。pwd や __direname ではないので注意
export const TEMPLATE_MAP = {
  [T_ARCHIVE]: "../../src/template/index",
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
  BLOG_AUTHOR: "越智",
  BLOG_AUTHOR_EN: "oti",
  BLOG_CONTRIBUTE: "https://github.com/oti/dskd/blob/master/src/md/post/",
  BLOG_DESC: "dskd は越智による個人ウェブサイトです。",
  BLOG_FAVICON: "/favicon.svg",
  BLOG_NAME: "dskd",
  BLOG_OGP: "/image/og-image.webp",
  BLOG_TOUCH_ICON: "/image/apple-touch-icon.webp",
  BLOG_TWITTER: "dskd_jp",
  BLOG_URL: "https://dskd.jp",
  T_ARCHIVE,
  T_HOME,
  T_PAGE,
  T_POST,
  T_FEED,
  T_TAG,
  T_YEAR,
  // U: URL
  U_FEED: "/feed",
  U_PAGE: "/",
  U_POST: "/archives/",
  U_TAG: "/archives/tags/",
  U_YEAR: "/archives/years/",
  version: pkg.version,
};
