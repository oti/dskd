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

export const CONFIGS = {
  D_ARCHIVE,
  D_HOME,
  D_PAGE,
  D_POST,
  D_TAG,
  D_YEAR,
  T_ARCHIVES,
  T_HOME,
  T_PAGE,
  T_POST,
  T_RSS,
  T_TAG,
  T_YEAR,
};
