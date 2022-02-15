import { writeFileSync } from "fs";

// タグごとに記事が全てぶら下がったオブジェクトを作る
// {'CSS': [{post1}, {post2}, ...], 'diary': [{post10}, {post11}, ...]}
export const tags = (posts) =>
  posts
    .map((post) => {
      // 記事のタグを key にした記事オブジェクトのペアの配列にする
      // [{'CSS': {post1}}, {'diary': {post10}}, {'CSS': {post2}}, {'diary': {post11}}, ...]
      return post.page_tag.map((tag_name) => ({ [tag_name]: post }));
    })
    .flat()
    .reduce((memo, pair) => {
      // タグ名に対して記事オブジェクトを配列にまとめる
      Object.keys(pair).map((key) => {
        if (!memo[key]) {
          memo[key] = [];
          // tags_name ごとに mdファイルを writeFile
          const yaml_block = `---
layout: "./src/html/index.pug"
page_type: "tag"
page_title: "${key}"
page_description: "${key}タグの記事一覧"
---
`;
          const safe_name = key.toLowerCase().replace(/[ .-]/g, "_");
          writeFileSync(`./src/md/archives/tags/${safe_name}.md`, yaml_block);
        }
        memo[key].push(pair[key]);
      });
      return memo;
    }, {});
