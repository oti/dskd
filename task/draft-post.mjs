import fs from "fs/promises";
import fg from "fast-glob";
import path from "path";

// コマンド実行した時間を datetime とする（日本時間に合わせるため 9 時間追加）
const date = new Date(Date.now() + 9 * 60 * 60 * 1000);
const datetime = date.toISOString().split(".")[0];

const id =
  (await fg("src/md/post/*.md"))
    .map((filepath) => Number(path.parse(filepath).name))
    .reduce((a, b) => Math.max(a, b)) + 1;
const body = `---
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

fs.writeFile(`./src/md/post/${id}.md`, body)
  .then(() => {
    console.log(`create: src/md/post/${id}.md`);
  })
  .catch((error) => {
    console.error(error);
    throw error;
  });
