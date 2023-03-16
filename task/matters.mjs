import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import { S_MD } from "./constants.mjs";

export const matters = async () =>
  Promise.all(
    (await fg(S_MD)).map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8"))
    )
  );
