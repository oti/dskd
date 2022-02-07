import fs from "fs";
import path from "path";
import config from "../../blogconfig.json";
import { version } from "../../package.json";

export const getCombinedData = (frontMatter) => {
  const posts = fs.readFileSync(
    path.resolve(__dirname, "../../src/json/data.json"),
    "utf8"
  );
  let parsedPost = {};

  try {
    parsedPost = JSON.parse(posts);
  } catch (e) {
    console.error(e);
  }

  return {
    ...config,
    blog_version: version,
    ...frontMatter,
    ...parsedPost,
  };
};
