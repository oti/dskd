import fs from "node:fs/promises";
import { S_MD } from "../dskd.config.mjs";

// 決めうちのデータ読み込み処理
const converter = (filestring) => {
  // filestringからyamlをパースしてjson形式にする
  const data = filestring
    .match(/^---\s*([\s\S]*?)\s*---\s*/)[1]
    .replace(/"/g, "")
    .split("\n")
    .reduce((acc, str) => {
      // 値が`tag:`だったらtagフィールドに空配列を置いて返す
      if (str === "tag:") {
        return {
          ...acc,
          tag: [],
        };
      }
      // 値が`  - ` で始まる場合はacc.tag[]に追加する
      else if (/^  - /.test(str)) {
        return {
          ...acc,
          tag: acc.tag.concat(str.slice(4)),
        };
      }
      // 値がtag関連でなければパースして返す
      else {
        const tuple = str.split(": ");
        return {
          ...acc,
          // idだったらnumberにする
          [tuple[0]]: tuple[0] === "id" ? Number(tuple[1]) : tuple[1],
        };
      }
    }, {});

  // 本文を抜き出す
  const string1 = JSON.stringify(filestring).split("\\n").slice(1);
  const content = string1
    .slice(string1.findIndex((str) => str === "---") + 1)
    .join("\\n");

  // オブジェクトにして返す
  return {
    data,
    content,
  };
};

export const matters = async () =>
  Promise.all(
    [...(await Array.fromAsync(await fs.glob(S_MD)))].map(async (filepath) =>
      converter(await fs.readFile(filepath, "utf8")),
    ),
  );
