// D: dist
export const D_ARCHIVE = "dist/archives/";
export const D_HOME = "dist/";
export const D_PAGE = "dist/";
export const D_POST = "dist/archives/";
export const D_TAG = "dist/archives/tags/";
export const D_YEAR = "dist/archives/years/";

// S: src
export const S_MD = "src/md/**/*.md";

// T: type
export const T_ARCHIVES = "archives";
export const T_HOME = "home";
export const T_PAGE = "page";
export const T_POST = "post";
export const T_RSS = "rss";
export const T_TAG = "tag";
export const T_YEAR = "year";

export const TEMPLATE_MAP = {
  [T_ARCHIVES]: "../../src/template/index",
  [T_HOME]: "../src/template/index",
  [T_PAGE]: "../src/template/page",
  [T_POST]: "../../src/template/post",
  [T_RSS]: "../src/template/rss",
  [T_TAG]: "../../../src/template/index",
  [T_YEAR]: "../../../src/template/index",
};

// Pugテンプレート向け
export const CONFIGS = {
  BLOG_ADDRESS: "otiext@gmail.com",
  BLOG_AUTHOR: "越智",
  BLOG_AUTHOR_EN: "oti",
  BLOG_CONTRIBUTE: "https://github.com/oti/dskd/blob/master/src/md/post/",
  BLOG_DESC: "dskd は越智による個人ウェブサイトです。",
  BLOG_FAVICON: "/favicon.svg",
  BLOG_NAME: "dskd",
  BLOG_TOUCH_ICON: "/image/apple-touch-icon.webp",
  BLOG_URL: "https://dskd.jp",
  T_ARCHIVES,
  T_HOME,
  T_PAGE,
  T_POST,
  T_RSS,
  T_TAG,
  T_YEAR,
  // U: URL
  U_FEED: "/feed",
  U_ARCHIVE: "/archives/",
  U_PAGE: "/archives/",
  U_POST: "/archives/",
  U_TAGS: "/archives/tags/",
  U_YEARS: "/archives/years/",
};
