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
  TEMPLATE_MAP,
  D_POST,
  D_PAGE,
} from "../dskd.config.js";

const error = (error) => {
  console.log(error);
  throw error;
};

export const html = async (database) => {
  await Promise.all(
    [D_POST, D_TAG, D_YEAR].map(
      async (dir) => await fs.mkdir(dir, { recursive: true }).catch(error)
    )
  );

  const createIndividualHtml = async () =>
    [...database.posts, ...database.pages].map(async (item) => {
      const filename = `${item.type === "post" ? D_POST : D_PAGE}${item.id}`;
      const pugCompiler = pug.compile(`extends ${TEMPLATE_MAP[item.type]}\n`, {
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

  const createTagHtml = async () =>
    Object.keys(database.tags).map(async (tag) => {
      const filename = `${D_TAG}${tag.toLowerCase().replace(/[ .-]/g, "_")}`;
      const pugCompiler = await pug.compile(
        `extends ${TEMPLATE_MAP[T_TAG]}\n`,
        { filename }
      );
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

  const createYearHtml = async () =>
    Object.keys(database.years).map(async (year) => {
      const filename = `${D_YEAR}${year}`;
      const pugCompiler = await pug.compile(
        `extends ${TEMPLATE_MAP[T_YEAR]}\n`,
        { filename }
      );
      return await fs.writeFile(
        `${filename}.html`,
        pugCompiler({
          type: T_YEAR,
          title: year,
          ...database,
        })
      );
    });

  const createArchivesHtml = async () => {
    const filename = `${D_ARCHIVE}index`;
    const pugCompiler = await pug.compile(
      `extends ${TEMPLATE_MAP[T_ARCHIVE]}\n`,
      {
        filename,
      }
    );
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

  const createHomeHtml = async () => {
    const filename = `${D_HOME}index`;
    const pugCompiler = await pug.compile(`extends ${TEMPLATE_MAP[T_HOME]}\n`, {
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
    const pugCompiler = await pug.compile(`extends ${TEMPLATE_MAP[T_FEED]}\n`, {
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
    ...(await createIndividualHtml()),
    ...(await createTagHtml()),
    ...(await createYearHtml()),
    await createArchivesHtml(),
    await createHomeHtml(),
    await createFeed(),
  ]);
};
