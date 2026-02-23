import fs from "node:fs/promises";
import { S_ASSET } from "./config.mjs";

export const asset = async () =>
  [...(await Array.fromAsync(await fs.glob(S_ASSET)))].map(
    async (filepath) => await fs.cp(filepath, filepath.replace("src", "dist")),
  );
