import fs from "fs";

// 年ごとに記事が全てぶら下がったオブジェクトを作る
// {'2020': [{post1}, {post2}, ...], '2019': [{post10}, {post11}, ...]}
export const years = (posts) =>
  posts.reduce((memo, post) => {
    const yyyy = post.page_datetime.split("-")[0];
    // タグ名に対して記事オブジェクトを配列にまとめる
    if (!memo[yyyy]) {
      memo[yyyy] = [];
      // tags_name ごとに mdファイルを writeFile
      const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: year\npage_title: ${yyyy}\npage_description: ${yyyy}年公開の記事一覧\n---\n`;
      fs.writeFileSync(`./src/md/archives/${yyyy}.md`, yaml_block);
    }
    memo[yyyy].push(post);
    return memo;
  }, {});
