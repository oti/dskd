import fs from "node:fs/promises";
import matter from "gray-matter";
import { S_MD } from "../dskd.config.mjs";

export const matters = async () =>
  Promise.all(
    [...(await Array.fromAsync(await fs.glob(S_MD)))].map(async (filepath) =>
      matter(await fs.readFile(filepath, "utf8")),
    ),
  );
