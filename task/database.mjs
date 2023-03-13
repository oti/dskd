import packageJson from "../package.json" assert { type: "json" };

export const database = async (matters) => {
  const posts = matters
    .filter(({ data: { type } }) => type === "post")
    // 記事は日付でソートする
    .sort((a, b) =>
      Number(
        b.data.datetime
          .replace(/[-T:]/g, "")
          .localeCompare(Number(a.data.datetime.replace(/[-T:]/g, "")))
      )
    )
    .map((post, i, sortedPosts) => {
      const older = sortedPosts[i + 1];
      const newer = sortedPosts[i - 1];
      return {
        // pug: `src/pug${post.data.dist}${post.data.id}.pug`,
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
    .filter(({ data: { type } }) => type === "page")
    .map((page) => {
      return {
        pug: `src/pug${page.data.dist}${page.data.id}.pug`,
        content: page.content,
        ...page.data,
      };
    });

  const tags = posts
    .flatMap((post) => post.tag.map((tag) => ({ [tag]: post })))
    .reduce((memo, pair) => {
      Object.keys(pair).map((key) => {
        if (!memo[key]) memo[key] = [];
        memo[key].push(pair[key]);
      });
      return memo;
    }, {});

  const years = posts.reduce((memo, post) => {
    const year = post.datetime.split("-")[0];
    if (!memo[year]) memo[year] = [];
    memo[year].push(post);
    return memo;
  }, {});

  return Promise.resolve({
    posts,
    pages,
    tags,
    years,
    version: packageJson.version,
  });
};
