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

const generateLocals = () => {
  const metas = matters.map(
    ({ data: { datetime, desc, dist, id, tag, title, type } }) => ({
      datetime,
      desc,
      dist,
      id,
      tag,
      title,
      type,
    })
  );
  const posts = metas
    .filter(({ type }) => type === "post")
    .sort((a, b) =>
      Number(
        b.datetime
          .replace(/[-T:]/g, "")
          .localeCompare(Number(a.datetime.replace(/[-T:]/g, "")))
      )
    )
    .map((post, i, sortedPosts) => {
      const older = sortedPosts[i + 1];
      const newer = sortedPosts[i - 1];
      return {
        pug: `src/pug/archives/${post.id}.pug`,
        ...post,
        older: older
          ? {
              id: older.id,
              title: older.title,
            }
          : undefined,
        newer: newer
          ? {
              id: newer.id,
              title: newer.title,
            }
          : undefined,
      };
    });

  const pages = metas
    .filter(({ type }) => type === "page")
    .map((page) => {
      return {
        pug: `src/pug${page.dist}${page.id}.pug`,
        ...page,
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

  return `extends ${relativePath}template/${type}.pug\n\nblock contents\n${body}\n`;
};

const generatePug = async () => {
  await fs.mkdir("src/pug/archives/tags/", { recursive: true });
  await fs.mkdir("src/pug/archives/years/", { recursive: true });
  return Promise.all([
    ...matters
      .filter(({ data: { type } }) => type === "post" || type === "page")
      .map(async ({ content, data: { dist, id, type } }) => {
        return await fs.writeFile(
          `src/pug${dist}${id}.pug`,
          getFormattedPugString({ content, type })
        );
      }),
    ...Object.keys(locals.tags).map(async (tag) => {
      return await fs.writeFile(
        `src/pug/archives/tags/${tag.toLowerCase().replace(/[ .-]/g, "_")}.pug`,
        `extends ../../../template/index.pug\n`
      );
    }),
    ...Object.keys(locals.years).map(async (year) => {
      return await fs.writeFile(
        `src/pug/archives/years/${year}.pug`,
        `extends ../../../template/index.pug\n`
      );
    }),
    await fs.writeFile(
      `src/pug/archives/index.pug`,
      `extends ../../template/index.pug\n`
    ),
    await fs.writeFile(`src/pug/index.pug`, `extends ../template/index.pug\n`),
  ]);
};

const getPugCompiler = async ({ filepath }) => {
  const sorce = await fs.readFile(filepath, "utf8");
  const options = {
    filename: filepath.split(".pug")[0],
    pretty: true,
  };
  return pug.compile(sorce, options);
};

const generateHTML = async () => {
  await fs.mkdir("dist/archives/tags/", { recursive: true });
  await fs.mkdir("dist/archives/years/", { recursive: true });
  return Promise.all([
    ...(await locals.posts.map(async ({ pug, ...yaml }) => {
      const distFilePath = pug
        .replace("src/pug/", "dist/")
        .replace(".pug", ".html");
      const distFileData = await getPugCompiler({ filepath: pug });
      return await fs.writeFile(
        distFilePath,
        distFileData({
          ...yaml,
          version: packageJson.version,
        })
      );
    })),
    ...(await locals.pages.map(async ({ pug, ...yaml }) => {
      const distFilePath = pug
        .replace("src/pug/", "dist/")
        .replace(".pug", ".html");
      const distFileData = await getPugCompiler({ filepath: pug });
      return await fs.writeFile(
        distFilePath,
        distFileData({
          ...yaml,
          version: packageJson.version,
        })
      );
    })),
    ...(await Object.keys(locals.tags).map(async (tag) => {
      const safeTag = tag.toLowerCase().replace(/[ .-]/g, "_");
      const distFilePath = `dist/archives/tags/${safeTag}.html`;
      const distFileData = await getPugCompiler({
        filepath: `src/pug/archives/tags/${safeTag}.pug`,
      });
      return await fs.writeFile(
        distFilePath,
        distFileData({
          type: "tag",
          title: tag,
          desc: `${tag}タグの記事一覧`,
          ...locals,
        })
      );
    })),
    ...(await Object.keys(locals.years).map(async (year) => {
      const distFilePath = `dist/archives/years/${year}.html`;
      const distFileData = await getPugCompiler({
        filepath: `src/pug/archives/years/${year}.pug`,
      });
      return await fs.writeFile(
        distFilePath,
        distFileData({
          type: "year",
          title: year,
          desc: `${year}年の記事一覧`,
          ...locals,
        })
      );
    })),
    await (async () => {
      const distFileData = await getPugCompiler({
        filepath: `src/pug/archives/index.pug`,
      });
      await fs.writeFile(
        "dist/archives/index.html",
        distFileData({
          type: "archives",
          ...locals,
        })
      );
    })(),
    await (async () => {
      const distFileData = await getPugCompiler({
        filepath: `src/pug/index.pug`,
      });
      await fs.writeFile(
        "dist/index.html",
        distFileData({
          type: "index",
          ...locals,
        })
      );
    })(),
  ]);
};

// md ファイルから front-matter の配列を生成する
const matters = await generateMatters();

// 画面に必要な locals を生成する
const locals = generateLocals();

// 年別一覧・タグ別一覧・インデックスの pug ファイルを生成する
await generatePug();

await generateHTML();

await asset();
