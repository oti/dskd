// 日付で降順ソートされたarchives.jsonを作る
const arthives = (posts, type) => {
  // 必要なデータだけ抽出して日付で降順ソート
  // json = {'arthives': [{post}, {post}, {post}...]}
  // json = {'demos': [{post}, {post}, {post}...]}
  return {
    [type]: Object.values(posts)
      .map((post) => post)
      .sort((a, b) => {
        const date_a = Number(a.page_datetime.replace(/[-T:]/g, ""));
        const date_b = Number(b.page_datetime.replace(/[-T:]/g, ""));
        if (date_a > date_b) return -1;
        if (date_a < date_b) return 1;
        return 0;
      }),
  };
};

module.exports = arthives;
