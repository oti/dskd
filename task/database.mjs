import { CONFIGS } from "../src/config.mjs";

export const database = async (jsons) => {
  const posts = jsons
    .filter((item) => item.type === "post")
    // 記事は日付で降順ソートする
    .sort(
      (a, b) => Number(b.datetime.replace(/[-T:]/g, "")) - Number(a.datetime.replace(/[-T:]/g, "")),
    )
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

  const tags = posts
    .flatMap((post) => post.tag.map((tag) => ({ [tag]: post })))
    .reduce((memo, pair) => {
      Object.keys(pair).map((key) => {
        memo[key] = memo[key] ? memo[key] : [];
        memo[key].push(pair[key]);
      });
      return memo;
    }, {});

  const years = posts.reduce((memo, post) => {
    const year = post.datetime.split("-")[0];
    memo[year] = memo[year] ? memo[year] : [];
    memo[year].push(post);
    return memo;
  }, {});

  return {
    posts,
    pages,
    tags,
    years,
    ...CONFIGS,
  };
};
