import fs from "fs/promises";
import matter from "gray-matter";
import pug from "pug";
import md2Pug from "markdown-to-pug";

import { getFileList } from "../utility/getFileList.mjs";

const PUG_INDENT = "  ";
const PUG_DELIMITER = "\n";
const SRC_POST_MD = "src/md/post/";
const SRC_POST_PUG = "src/pug/archives/";
const DIST_POST_HTML = "dist/archives/";

const m2p = new md2Pug();

const getFormattedPugString = ({ content, layout }) => {
  // Pug の `block contents` に合わせてインデントを追加する
  const value = m2p
    .render(content, { pretty: true })
    .split(PUG_DELIMITER)
    .map((v) => `${PUG_INDENT}${v}`)
    .join(PUG_DELIMITER);
  return `extends ${layout}\n\nblock contents\n${value}`;
};

const getPostMatter = async () => {
  return Promise.all(
    (await getFileList(SRC_POST_MD)).map(async ({ name }) =>
      matter(await fs.readFile(`${SRC_POST_MD}${name}`, "utf8"))
    )
  );
};

const getPostPug = async (matters) => {
  await fs.mkdir(SRC_POST_PUG, { recursive: true });
  return Promise.all(
    matters.map(
      async ({ content, data: { layout, page_id } }) =>
        await fs.writeFile(
          `${SRC_POST_PUG}${page_id}.pug`,
          getFormattedPugString({ content, layout })
        )
    )
  );
};

const getPugCompiledHtml = async ({ name, path }) => {
  const filename = name.split(".pug")[0];
  const content = await fs.readFile(`${path}${name}`, "utf8");
  return pug.render(content, { filename });
};

const generatePostHtml = async () => {
  await fs.mkdir(DIST_POST_HTML, { recursive: true });
  return Promise.all(
    (await getFileList(SRC_POST_PUG)).map(
      async ({ name }) =>
        await fs.writeFile(
          `${DIST_POST_HTML}${name.split(".pug")[0]}.html`,
          await getPugCompiledHtml({
            name,
            path: SRC_POST_PUG,
          })
        )
    )
  );
};

await getPostMatter().then(async (matters) => await getPostPug(matters));
await generatePostHtml();
