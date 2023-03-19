import fs from "fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import { S_MD } from "../dskd.config.js";

export const matters = async () =>
  Promise.all(
    (await fg(S_MD)).map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8"))
    )
  );
