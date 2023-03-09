import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import pug from "pug";

import md2Pug from "markdown-to-pug";
const m2p = new md2Pug();

const getPostMatter = async () => {
  return Promise.all(
    (await fg("src/md/post/*.md")).map(async (filepath) => {
      const content = await fs.readFile(filepath, "utf8");
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
      fs.mkdir("src/html/pug/", { recursive: true });
      await fs.writeFile(`src/html/pug/${data.page_id}.pug`, formatted);
    })
  );
};

const getPostHtml = async () => {
  return Promise.all(
    (await fg("src/html/pug/*.pug")).map(async (filepath) => {
      const filename = filepath.split(".pug")[0].at(-1);
      const content = await fs.readFile(filepath, "utf8");
      const compiled = pug.render(content, { filename });
      fs.mkdir("dist/archives/", { recursive: true });
      await fs.writeFile(`dist/archives/${filename}.html`, compiled);
    })
  );
};

await getPostMatter()
  .then(async (matters) => await getPostPug(matters))
  .then(async () => await getPostHtml());
