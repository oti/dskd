import fs from "fs/promises";
import fg from "fast-glob";
import path from "path";
import { S_ASSET } from "./constant.mjs";

export const asset = async () =>
  (await fg(S_ASSET)).map(async (source) => {
    await fs.mkdir(path.parse(source).dir.replace("src", "dist"), {
      recursive: true,
    });
    return await fs.copyFile(source, source.replace("src", "dist"));
  });
