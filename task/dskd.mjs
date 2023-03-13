import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import md2Pug from "markdown-to-pug";
import pug from "pug";
import { getParsedJSON } from "./utility/getParsedJSON.mjs";

const pugrc = await getParsedJSON("../../.pugrc");
const m2p = new md2Pug();

const generateMatters = async () => {
  return Promise.all(
    (await fg("src/md/**/*.md")).map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8"))
    )
  );
};

const generateLocals = () => {
  const metas = matters.map(({ data: { datetime, id, tag, title, type } }) => ({
    datetime,
    id,
    tag,
    title,
    type,
  }));

  const sortedPosts = metas
    .filter(({ type }) => type === "post")
    .sort((a, b) =>
      Number(
        b.datetime
          .replace(/[-T:]/g, "")
          .localeCompare(Number(a.datetime.replace(/[-T:]/g, "")))
      )
    );
  const posts = sortedPosts.map((post, i) => {
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
    tags,
    years,
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
      .filter(({ data: { type } }) => type === "post")
      .map(async ({ content, data: { id, type } }) => {
        return await fs.writeFile(
          `src/pug/archives/${id}.pug`,
          getFormattedPugString({ content, type })
        );
      }),
    ...matters
      .filter(({ type }) => type === "page")
      .map(async ({ content, data: { id, type } }) => {
        return await fs.writeFile(
          `src/pug/${id}.pug`,
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
  return Promise.all(
    await locals.posts.map(async ({ pug, ...local }) => {
      const distFilePath = pug
        .replace("src/pug/", "dist/")
        .replace(".pug", ".html");
      const distFileData = await getPugCompiler({ filepath: pug });
      return await fs.writeFile(
        distFilePath,
        distFileData({
          ...local,
          ...pugrc.locals,
        })
      );
    })
  );
};

// md ファイルから front-matter の配列を生成する
const matters = await generateMatters();

// 画面に必要な locals を生成する
const locals = generateLocals();

// 年別一覧・タグ別一覧・インデックスの pug ファイルを生成する
await generatePug();

await generateHTML();
