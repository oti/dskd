import fs from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getParsedJSON = async (filepath) => {
  try {
    return JSON.parse(await fs.readFile(resolve(__dirname, filepath), "utf8"));
  } catch (e) {
    console.error(e);
  }
};
