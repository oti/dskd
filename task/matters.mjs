import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";

export const matters = async () =>
  Promise.all(
    (await fg("src/md/**/*.md")).map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8"))
    )
  );
