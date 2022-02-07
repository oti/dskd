import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getCombinedData = (frontMatter) => {
  const _config = readFileSync(
    resolve(__dirname, "../../blogconfig.json"),
    "utf8"
  );
  const _data = readFileSync(
    resolve(__dirname, "../../src/json/data.json"),
    "utf8"
  );
  const _package = readFileSync(
    resolve(__dirname, "../../package.json"),
    "utf8"
  );

  let parsedData = {};
  let parsedConfig = {};
  let parsedPackage = {};

  try {
    parsedPackage = JSON.parse(_package);
    parsedData = JSON.parse(_data);
    parsedConfig = JSON.parse(_config);
  } catch (e) {
    console.error(e);
  }

  return {
    ...parsedConfig,
    blog_version: parsedPackage.version,
    ...frontMatter,
    ...parsedData,
  };
};
