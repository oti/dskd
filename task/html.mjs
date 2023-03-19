import fs from "fs/promises";
import { marked } from "marked";
import pug from "pug";
import {
  D_ARCHIVE,
  D_HOME,
  D_TAG,
  D_YEAR,
  T_ARCHIVE,
  T_HOME,
  T_TAG,
  T_YEAR,
  T_FEED,
  TEMPLATE,
  D_POST,
  D_PAGE,
} from "../dskd.config.mjs";

const error = (error) => {
  console.log(error);
  throw error;
};

export const html = async (database) => {
  // 必要なディレクトリをあらかじめ作る
  await Promise.all(
    [D_POST, D_TAG, D_YEAR].map(
      async (dir) => await fs.mkdir(dir, { recursive: true }).catch(error)
    )
  );

  const createIndividual = async () =>
    [...database.posts, ...database.pages].map(async (item) => {
      const filename = `${item.type === "post" ? D_POST : D_PAGE}${item.id}`;
      /**
       * fs.readFile() で src/template/post.pug を読み出してもよいが、
       * pug で多重継承させるための extends 文を介してビルドした方が多少高速に処理される
       */
      const pugCompiler = pug.compile(`extends ${TEMPLATE[item.type]}`, {
        filename,
      });
      return await fs
        .writeFile(
          `${filename}.html`,
          pugCompiler({
            marked: marked.parse(item.content),
            ...item,
            ...database,
          })
        )
        .catch(error);
    });

  const createTag = async () =>
    Object.keys(database.tags).map(async (tag) => {
      const filename = `${D_TAG}${tag.toLowerCase().replace(/[ .-]/g, "_")}`;
      const pugCompiler = await pug.compile(`extends ${TEMPLATE[T_TAG]}`, {
        filename,
      });
      return await fs
        .writeFile(
          `${filename}.html`,
          pugCompiler({
            type: T_TAG,
            title: tag,
            ...database,
          })
        )
        .catch(error);
    });

  const createYear = async () =>
    Object.keys(database.years).map(async (year) => {
      const filename = `${D_YEAR}${year}`;
      const pugCompiler = await pug.compile(`extends ${TEMPLATE[T_YEAR]}`, {
        filename,
      });
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: T_YEAR,
          title: year,
          ...database,
        })
      );
    });

  const createArchives = async () => {
    const filename = `${D_ARCHIVE}index`;
    const pugCompiler = await pug.compile(`extends ${TEMPLATE[T_ARCHIVE]}`, {
      filename,
    });
    await fs
      .writeFile(
        `${filename}.html`,
        pugCompiler({
          type: T_ARCHIVE,
          title: "Archives",
          ...database,
        })
      )
      .catch(error);
  };

  const createHome = async () => {
    const filename = `${D_HOME}index`;
    const pugCompiler = await pug.compile(`extends ${TEMPLATE[T_HOME]}`, {
      filename,
    });
    await fs
      .writeFile(
        `${filename}.html`,
        pugCompiler({
          type: T_HOME,
          ...database,
        })
      )
      .catch(error);
  };

  const createFeed = async () => {
    const filename = `${D_HOME}feed`;
    const pugCompiler = await pug.compile(`extends ${TEMPLATE[T_FEED]}`, {
      filename,
      pretty: true,
    });
    await fs
      .writeFile(
        `${filename}.xml`,
        pugCompiler({
          ...database,
        })
      )
      .catch(error);
  };

  return Promise.all([
    ...(await createIndividual()),
    ...(await createTag()),
    ...(await createYear()),
    await createArchives(),
    await createHome(),
    await createFeed(),
  ]);
};
