import fs from "fs/promises";
import { marked } from "marked";
import pug from "pug";
import pkg from "../package.json" assert { type: "json" };

export const html = async (database) => {
  await Promise.all(
    ["dist/archives/tags/", "dist/archives/years/"].map(
      async (dir) => await fs.mkdir(dir, { recursive: true })
    )
  );

  const getExtendsString = (type) => {
    switch (type) {
      case "post":
        return "extends ../../src/template/post\n";
      case "page":
        return "extends ../src/template/page\n";
      case "tag":
      case "year":
        return "extends ../../../src/template/index.pug\n";
      case "archives":
        return "extends ../../src/template/index.pug\n";
      case "home":
        return "extends ../src/template/index.pug\n";
      default:
        return undefined;
    }
  };

  return Promise.all([
    ...(await [...database.posts, ...database.pages].map(async (item) => {
      const filename = `dist${item.dist}${item.id}`;
      const pugCompiler = pug.compile(getExtendsString(item.type), {
        filename,
        pretty: true,
      });
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          ...item,
          marked: marked.parse(item.content),
          version: pkg.version,
        })
      );
    })),
    ...(await Object.keys(database.tags).map(async (tag) => {
      const filename = `dist/archives/tags/${tag
        .toLowerCase()
        .replace(/[ .-]/g, "_")}`;
      const pugCompiler = await pug.compile(getExtendsString("tag"), {
        filename,
        pretty: true,
      });
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
      const pugCompiler = await pug.compile(getExtendsString("year"), {
        filename,
        pretty: true,
      });
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
      const pugCompiler = await pug.compile(getExtendsString("archives"), {
        filename,
        pretty: true,
      });
      await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: "archives",
          desc: `全記事一覧`,
          ...database,
        })
      );
    })(),
    await (async () => {
      const filename = "dist/index";
      const pugCompiler = await pug.compile(getExtendsString("home"), {
        filename,
        pretty: true,
      });
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
