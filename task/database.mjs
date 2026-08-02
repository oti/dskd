import { CONFIGS } from "../src/config.mjs";

export const database = async (jsons) => {
  const posts = jsons
    .filter((item) => item.type === "post")
    // 記事は日付で降順ソートする（datetime は桁数固定の ISO 形式なので文字列比較でよい）
    .sort((a, b) => b.datetime.localeCompare(a.datetime))
    .map((post, i, sorted) => {
      const older = sorted[i + 1];
      const newer = sorted[i - 1];
      return {
        ...post,
        older: older
          ? {
              id: older.id,
              title: older.title,
            }
          : undefined,
        newer: newer
          ? {
              id: newer.id,
              title: newer.title,
            }
          : undefined,
      };
    });

  const pages = jsons.filter((item) => item.type === "page");

  // { タグ名: [記事, ...] }
  const tags = Object.fromEntries(
    [...new Set(posts.flatMap((post) => post.tag))].map((tag) => [
      tag,
      posts.filter((post) => post.tag.includes(tag)),
    ]),
  );

  // { 年: [記事, ...] }
  const years = Object.groupBy(posts, (post) => post.datetime.split("-")[0]);

  return {
    posts,
    pages,
    tags,
    years,
    ...CONFIGS,
  };
};
