import fs from "fs/promises";
import fg from "fast-glob";

// コマンド実行した時間を datetime とする（日本時間に合わせるため 9 時間追加）
const date = new Date(Date.now() + 9 * 60 * 60 * 1000);
const datetime = date.toISOString().split(".")[0];

const posts = (await fg("src/md/**/*.md"))
  .map((filepath) => Number(filepath.split(".md")[0].split("/").at(-1)))
  .filter((id) => !isNaN(id))
  .sort((a, b) => b - a);
const id = posts && posts[0] ? posts[0] + 1 : undefined;
const body = `---
dist: "/archives/"
type: "post"
cover: null
id: ${id}
datetime: "${datetime}"
title: "タイトル"
desc: "サマリー"
tag:
  - "diary"
---

最高の書き出し
`;

fs.writeFile(`./src/md/post/${id}.md`, body).catch((error) => {
  console.error(error);
  throw error;
});
