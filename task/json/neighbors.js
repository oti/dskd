// 記事ごとに前後の記事情報をもったjsonを作る
const neighbors = (posts) => {
  return posts.reduce((memo, post, i) => {
    const _old = posts[i + 1] || false;
    const _new = posts[i - 1] || false;
    // olderがあれば作る
    const older = _old
      ? {
          page_id: _old.page_id,
          page_title: _old.page_title,
        }
      : {};

    // newerがあれば作る
    const newer = _new
      ? {
          page_id: _new.page_id,
          page_title: _new.page_title,
        }
      : {};

    return {
      ...memo,
      [post.page_id]: { older, newer },
    };
  }, {});
};

module.exports = neighbors;
