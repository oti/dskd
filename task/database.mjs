import pkg from "../package.json" assert { type: "json" };

export const database = async (matters) => {
  const posts = matters
    .filter((item) => item.data.type === "post")
    // 記事は日付で降順ソートする
    .sort(
      (a, b) =>
        Number(b.data.datetime.replace(/[-T:]/g, "")) -
        Number(a.data.datetime.replace(/[-T:]/g, ""))
    )
    .map((post, i, sorted) => {
      const older = sorted[i + 1];
      const newer = sorted[i - 1];
      return {
        content: post.content,
        ...post.data,
        older: older
          ? {
              id: older.data.id,
              title: older.data.title,
            }
          : undefined,
        newer: newer
          ? {
              id: newer.data.id,
              title: newer.data.title,
            }
          : undefined,
      };
    });

  const pages = matters
    .filter((item) => item.data.type === "page")
    .map((page) => {
      return {
        content: page.content,
        ...page.data,
      };
    });

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

  return Promise.resolve({
    posts,
    pages,
    tags,
    years,
    version: pkg.version,
  });
};
