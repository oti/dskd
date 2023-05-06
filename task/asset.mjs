import fs from "fs/promises";
import fg from "fast-glob";
import path from "path";
import { S_ASSET } from "../dskd.config.mjs";

const error = (error) => {
  console.error(error);
  throw error;
};

export const asset = async () =>
  (await fg(S_ASSET)).map(async (filepath) => {
    await fs
      .mkdir(path.parse(filepath).dir.replace("src", "dist"), {
        recursive: true,
      })
      .catch(error)
      .then(
        async () => await fs.copyFile(filepath, filepath.replace("src", "dist"))
      );
  });
