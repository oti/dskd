const fs = require("fs");

// 年ごとに記事が全てぶら下がったオブジェクトを作る
const years = (posts) => {
  // {'years': {'2020': [{post1}, {post2}, ...], '2019': [{post10}, {post11}, ...]}}
  return {
    years: Object.values(posts).reduce((memo, post) => {
      const yyyy = post.page_datetime.split("-")[0];
      // タグ名に対して記事オブジェクトを配列にまとめる
      // {'2020': [{post1}, {post2}, ...], '2019': [{post10}, {post11}, ...]}
      if (!memo[yyyy]) {
        memo[yyyy] = [];
        // tags_name ごとに mdファイルを writeFile
        const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'year'\npage_title: ${yyyy}\npage_description: ${yyyy}年公開の記事一覧\n---`;
        fs.writeFileSync(`./src/md/archives/${yyyy}.md`, yaml_block);
      }
      memo[yyyy].unshift(post);
      return memo;
    }, {}),
  };
};

module.exports = years;
