import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import md2Pug from "markdown-to-pug";
import pug from "pug";
import { asset } from "./asset.mjs";
import packageJson from "../package.json" assert { type: "json" };

const m2p = new md2Pug();

const generateMatters = async () => {
  return Promise.all(
    (await fg("src/md/**/*.md")).map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8"))
    )
  );
};

const generateDB = (matters) => {
  const posts = matters
    .filter(({ data: { type } }) => type === "post")
    .sort((a, b) =>
      Number(
        b.data.datetime
          .replace(/[-T:]/g, "")
          .localeCompare(Number(a.data.datetime.replace(/[-T:]/g, "")))
      )
    )
    .map((post, i, sortedPosts) => {
      const older = sortedPosts[i + 1];
      const newer = sortedPosts[i - 1];
      return {
        // pug: `src/pug${post.data.dist}${post.data.id}.pug`,
        content: post.content,
        ...post.data,
        older: older
          ? {
              id: older.data.id,
              title: older.data.title,
            }
          : undefined,
        newer: newer
          ? {
              id: newer.data.id,
              title: newer.data.title,
            }
          : undefined,
      };
    });

  const pages = matters
    .filter(({ data: { type } }) => type === "page")
    .map((page) => {
      return {
        pug: `src/pug${page.data.dist}${page.data.id}.pug`,
        content: page.content,
        ...page.data,
      };
    });

  const tags = posts
    .flatMap((post) => post.tag.map((tag) => ({ [tag]: post })))
    .reduce((memo, pair) => {
      Object.keys(pair).map((key) => {
        if (!memo[key]) memo[key] = [];
        memo[key].push(pair[key]);
      });
      return memo;
    }, {});

  const years = posts.reduce((memo, post) => {
    const year = post.datetime.split("-")[0];
    if (!memo[year]) memo[year] = [];
    memo[year].push(post);
    return memo;
  }, {});

  return {
    posts,
    pages,
    tags,
    years,
    version: packageJson.version,
  };
};

const getFormattedPugString = ({ content, type }) => {
  // Pug の `block contents` に合わせてインデントを追加する
  const body = m2p
    .render(content)
    .split("\n")
    .map((v) => `  ${v}`)
    .join("\n");

  const relativePath = type === "post" ? "../../" : "../";

  return `extends ${relativePath}src/template/${type}.pug\n\nblock contents\n${body}\n`;
};

const generateHTML = async (db) => {
  await fs.mkdir("dist/archives/tags/", { recursive: true });
  await fs.mkdir("dist/archives/years/", { recursive: true });

  return Promise.all([
    ...(await db.posts.map(async (post) => {
      const distPath = `dist${post.dist}${post.id}.html`;
      const distFile = await pug.compile(
        getFormattedPugString({ content: post.content, type: post.type }),
        {
          filename: `dist${post.dist}${post.id}`,
          pretty: true,
        }
      );
      return await fs.writeFile(
        distPath,
        distFile({
          ...post,
          version: packageJson.version,
        })
      );
    })),
    // ...(await db.pages.map(async ({ pug, ...yaml }) => {
    //   const distFilePath = pug
    //     .replace("src/pug/", "dist/")
    //     .replace(".pug", ".html");
    //   const distFileData = await getPugCompiler({ filepath: pug });
    //   return await fs.writeFile(
    //     distFilePath,
    //     distFileData({
    //       ...yaml,
    //       version: packageJson.version,
    //     })
    //   );
    // })),
    // ...(await Object.keys(db.tags).map(async (tag) => {
    //   const safeTag = tag.toLowerCase().replace(/[ .-]/g, "_");
    //   const distFilePath = `dist/archives/tags/${safeTag}.html`;
    //   const distFileData = await getPugCompiler({
    //     filepath: `src/pug/archives/tags/${safeTag}.pug`,
    //   });
    //   return await fs.writeFile(
    //     distFilePath,
    //     distFileData({
    //       type: "tag",
    //       title: tag,
    //       desc: `${tag}タグの記事一覧`,
    //       ...db,
    //     })
    //   );
    // })),
    // ...(await Object.keys(db.years).map(async (year) => {
    //   const distFilePath = `dist/archives/years/${year}.html`;
    //   const distFileData = await getPugCompiler({
    //     filepath: `src/pug/archives/years/${year}.pug`,
    //   });
    //   return await fs.writeFile(
    //     distFilePath,
    //     distFileData({
    //       type: "year",
    //       title: year,
    //       desc: `${year}年の記事一覧`,
    //       ...db,
    //     })
    //   );
    // })),
    // await (async () => {
    //   const distFileData = await getPugCompiler({
    //     filepath: `src/pug/archives/index.pug`,
    //   });
    //   await fs.writeFile(
    //     "dist/archives/index.html",
    //     distFileData({
    //       type: "archives",
    //       ...db,
    //     })
    //   );
    // })(),
    // await (async () => {
    //   const distFileData = await getPugCompiler({
    //     filepath: `src/pug/index.pug`,
    //   });
    //   await fs.writeFile(
    //     "dist/index.html",
    //     distFileData({
    //       type: "index",
    //       ...db,
    //     })
    //   );
    // })(),
  ]);
};

// await asset();
await generateMatters()
  .then((matters) => generateDB(matters))
  .then(async (db) => await generateHTML(db));
