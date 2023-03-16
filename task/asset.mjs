import fs from "fs/promises";
import fg from "fast-glob";
import path from "path";

export const asset = async () =>
  (await fg("src/({image,misc,style}/**/*|favicon.*)")).map(async (source) => {
    await fs.mkdir(path.parse(source).dir.replace("src", "dist"), {
      recursive: true,
    });
    return await fs.copyFile(source, source.replace("src", "dist"));
  });
