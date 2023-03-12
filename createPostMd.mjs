import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// コマンド実行した時間を datetime とする（日本時間に合わせるため 9 時間追加）
const date = new Date(Date.now() + 9 * 60 * 60 * 1000);
const [datetime, _] = date.toISOString().split(".");

try {
  // 最新記事の id を取得する
  const { latest } = JSON.parse(
    readFileSync(resolve(__dirname, "./src/json/data.json"), "utf8")
  );
  const new_id = latest.id + 1;
  const yaml_block = `---
layout: "./src/html/post.pug"
page_type: "post"
cover: null
id: ${new_id}
datetime: "${datetime}"
title: "タイトル"
desc: "サマリー"
tag:
  - "diary"
---

最高の書き出し
`;
  writeFileSync(`./src/md/post/${new_id}.md`, yaml_block);
  console.info(`create "./src/md/post/${new_id}.md" done.`);
} catch (e) {
  console.error(e);
}
