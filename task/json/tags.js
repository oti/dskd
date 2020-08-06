const fs = require("fs");

// タグごとに記事が全てぶら下がったオブジェクトを作る
const tags = (posts) => {
  // {'tags': {'CSS': [{post1}, {post2}, ...], 'note': [{post10}, {post11}, ...]}}
  return {
    tags: Object.values(posts)
      .sort((a, b) => {
        const date_a = Number(a.page_datetime.replace(/[-T:]/g, ""));
        const date_b = Number(b.page_datetime.replace(/[-T:]/g, ""));
        if (date_a > date_b) return -1;
        if (date_a < date_b) return 1;
        return 0;
      })
      .map((post) => {
        // 記事のタグを key にした記事オブジェクトのペアの配列にする
        // [{'CSS': {post1}}, {'note': {post10}}, {'CSS': {post2}}, {'note': {post11}}, ...]
        return post.page_tag.map((tag_name) => ({ [tag_name]: post }));
      })
      .flat()
      .reduce((memo, pair) => {
        // タグ名に対して記事オブジェクトを配列にまとめる
        // {'CSS': [{post1}, {post2}, ...], 'note': [{post10}, {post11}, ...]}
        Object.keys(pair).map((key) => {
          if (!memo[key]) {
            memo[key] = [];
            // tags_name ごとに mdファイルを writeFile
            const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: tag\npage_title: ${key}\npage_description: ${key}カテゴリの記事一覧\n---`;
            const safe_name = key.toLowerCase().replace(/[ .-]/g, "_");
            fs.writeFileSync(`./src/md/archives/${safe_name}.md`, yaml_block);
          }
          memo[key].push(pair[key]);
        });
        return memo;
      }, {}),
  };
};

module.exports = tags;
