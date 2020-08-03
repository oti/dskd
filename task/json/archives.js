// 日付で降順ソートされたarchives.jsonを作る
const arthives = (posts, type) => {
  const dripped = [];

  // 必要なデータだけ抽出
  for (let key of Object.keys(posts)) {
    dripped.push({
      page_id: posts[key].page_id,
      page_datetime: posts[key].page_datetime,
      page_title: posts[key].page_title,
      page_description: posts[key].page_description,
      page_tag: posts[key].page_tag,
    });
  }

  // 日付で降順ソート
  dripped.sort((a, b) => {
    const date_a = Number(a.page_datetime.replace(/[-T:]/g, ""));
    const date_b = Number(b.page_datetime.replace(/[-T:]/g, ""));
    if (date_a > date_b) return -1;
    if (date_a < date_b) return 1;
    return 0;
  });

  // json = {'arthives': [{post}, {post}, {post}...]}
  // json = {'demos': [{post}, {post}, {post}...]}
  return { [type]: dripped };
};

module.exports = arthives;
