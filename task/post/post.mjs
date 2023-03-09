import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import pug from "pug";

import md2Pug from "markdown-to-pug";
const m2p = new md2Pug();

const postMdPath = "src/md/post/";
const postPugPath = "src/html/archives/";

const getPostMatter = async () => {
  return Promise.all(
    (await fs.readdir(postMdPath, { withFileTypes: true }))
      .filter((dirent) => dirent.isFile())
      .map(async ({ name }) => {
        const content = await fs.readFile(`${postMdPath}${name}`, "utf8");
        return matter(content);
      })
  );
};

const getPostPug = async (matters) => {
  return Promise.all(
    matters.map(async ({ content, data }) => {
      const pug = m2p.render(content, { pretty: "  " });
      const indentedPug = pug
        .split("\n")
        .map((v) => `  ${v}`)
        .join("\n");
      const formatted = `extends ${data.layout}\n\nblock contents\n${indentedPug}`;
      fs.mkdir("src/html/archives/", { recursive: true });
      await fs.writeFile(`src/html/archives/${data.page_id}.pug`, formatted);
    })
  );
};

const getPostHtml = async () => {
  return Promise.all(
    (await fs.readdir(postPugPath, { withFileTypes: true }))
      .filter((dirent) => dirent.isFile())
      .map(async ({ name }) => {
        const filename = name.split(".pug")[0].at(-1);
        const content = await fs.readFile(`${postPugPath}${name}`, "utf8");
        const compiled = pug.render(content, { filename });
        fs.mkdir("dist/archives/", { recursive: true });
        await fs.writeFile(`dist/archives/${filename}.html`, compiled);
      })
  );
};

await getPostMatter()
  .then(async (matters) => await getPostPug(matters))
  .then(async () => await getPostHtml());
