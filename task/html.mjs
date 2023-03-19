import fs from "fs/promises";
import { marked } from "marked";
import pug from "pug";
import {
  D_ARCHIVE,
  D_HOME,
  D_TAG,
  D_YEAR,
  T_ARCHIVES,
  T_HOME,
  T_TAG,
  T_YEAR,
  TEMPLATE_MAP,
  T_RSS,
  D_POST,
  D_PAGE,
} from "./constant.mjs";

const error = (error) => {
  console.log(error);
  throw error;
};

export const html = async (database) => {
  await Promise.all(
    [D_TAG, D_YEAR].map(
      async (dir) => await fs.mkdir(dir, { recursive: true }).catch(error)
    )
  );

  const createIndividualHtml = async () =>
    [...database.posts, ...database.pages].map(async (item) => {
      const filename = `${item.type === "post" ? D_POST : D_PAGE}${item.id}`;
      const pugCompiler = pug.compile(`extends ${TEMPLATE_MAP[item.type]}\n`, {
        filename,
        pretty: true,
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
        {
          filename,
          pretty: true,
        }
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
        {
          filename,
          pretty: true,
        }
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
      `extends ${TEMPLATE_MAP[T_ARCHIVES]}\n`,
      {
        filename,
        pretty: true,
      }
    );
    await fs
      .writeFile(
        `${filename}.html`,
        pugCompiler({
          type: T_ARCHIVES,
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
      pretty: true,
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

  const createRss = async () => {
    const filename = `${D_HOME}rss`;
    const pugCompiler = await pug.compile(`extends ${TEMPLATE_MAP[T_RSS]}\n`, {
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
    await createRss(),
  ]);
};
