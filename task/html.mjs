import fs from "fs/promises";
import md2Pug from "markdown-to-pug";
import pug from "pug";

import pkg from "../package.json" assert { type: "json" };

const m2p = new md2Pug();

export const html = async (database) => {
  await fs.mkdir("dist/archives/tags/", { recursive: true });
  await fs.mkdir("dist/archives/years/", { recursive: true });

  const pugString = ({ content, type }) => {
    // Pug の `block contents` に合わせてインデントを追加する
    const body = m2p
      .render(content)
      .split("\n")
      .map((v) => `  ${v}`)
      .join("\n");

    const relativePath = type === "post" ? "../../" : "../";

    return `extends ${relativePath}src/template/${type}.pug\n\nblock contents\n${body}\n`;
  };

  return Promise.all([
    ...(await [...database.posts, ...database.pages].map(async (item) => {
      const filename = `dist${item.dist}${item.id}`;
      const pugCompiler = pug.compile(
        // todo: 1.pug -> post.pug -> default.pug で入れ子なのでその度に render() してやる必要あり？
        pugString({ content: item.content, type: item.type }),
        {
          filename,
          pretty: true,
        }
      );
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          ...item,
          version: pkg.version,
        })
      );
    })),
    ...(await Object.keys(database.tags).map(async (tag) => {
      const filename = `dist/archives/tags/${tag
        .toLowerCase()
        .replace(/[ .-]/g, "_")}`;
      const pugCompiler = await pug.compile(
        `extends ../../../src/template/index.pug\n`,
        {
          filename,
          pretty: true,
        }
      );
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: "tag",
          title: tag,
          desc: `${tag}タグの記事一覧`,
          ...database,
        })
      );
    })),
    ...(await Object.keys(database.years).map(async (year) => {
      const filename = `dist/archives/years/${year}`;
      const pugCompiler = await pug.compile(
        `extends ../../../src/template/index.pug\n`,
        {
          filename,
          pretty: true,
        }
      );
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: "year",
          title: year,
          desc: `${year}タグの記事一覧`,
          ...database,
        })
      );
    })),
    await (async () => {
      const filename = "dist/archives/index";
      const pugCompiler = await pug.compile(
        `extends ../../src/template/index.pug\n`,
        {
          filename,
          pretty: true,
        }
      );
      await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: "archives",
          ...database,
        })
      );
    })(),
    await (async () => {
      const filename = "dist/index";
      const pugCompiler = await pug.compile(
        `extends ../src/template/index.pug\n`,
        {
          filename,
          pretty: true,
        }
      );
      await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: "home",
          ...database,
        })
      );
    })(),
  ]);
};
