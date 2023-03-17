// D: dist
export const D_ARCHIVE = "dist/archives/";
export const D_HOME = "dist/";
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
