import fs from "fs/promises";
import fg from "fast-glob";

export const asset = async () =>
  (await fg("src/({image,misc,style}/**/*|favicon.svg)")).map(
    async (source) => {
      const dist = source.replace("src", "dist");
      const _ = dist.split("/");
      const distDir = `${_.slice(0, _.length - 1).join("/")}/`;
      await fs.mkdir(distDir, { recursive: true });
      return await fs.copyFile(source, dist);
    }
  );
