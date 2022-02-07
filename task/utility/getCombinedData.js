import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getCombinedData = (frontMatter) => {
  try {
    const data = {
      ...JSON.parse(
        readFileSync(resolve(__dirname, "../../blogconfig.json"), "utf8")
      ),
      version: JSON.parse(
        readFileSync(resolve(__dirname, "../../package.json"), "utf8")
      ).version,
      ...frontMatter,
      ...JSON.parse(
        readFileSync(resolve(__dirname, "../../src/json/data.json"), "utf8")
      ),
    };

    // for Debug
    // writeFileSync(
    //   resolve(__dirname, `../../src/json/${frontMatter.page_id}.json`),
    //   JSON.stringify(data, null, 2)
    // );

    return data;
  } catch (e) {
    console.error(e);
  }
};
