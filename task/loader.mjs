import fs from "node:fs/promises";
import { S_MD } from "../dskd.config.mjs";

// 決めうちのデータ読み込み処理
const getJsonFromMarkdown = (filestring) => {
  // filestringからyamlをパースしてjson形式にする
  const yaml = filestring
    // yamlブロック内を抽出
    .match(/^---\s*([\s\S]*?)\s*---\s*/)[1]
    // ダブルクオーテーションを除去
    .replace(/"/g, "")
    // 改行コードで分割
    .split("\n")
    // tagを整理しつつオブジェクトで返す
    .reduce((memo, str) => {
      // 値が`tag:`だったらtagフィールドに空配列を置いて返す
      if (str === "tag:") {
        return {
          ...memo,
          tag: [],
        };
      }
      // 値が`  - ` で始まる場合はmemo.tag[]に追加する
      else if (/^  - /.test(str)) {
        return {
          ...memo,
          tag: memo.tag.concat(str.slice(4)),
        };
      }
      // 値がtag関連でなければパースして返す
      else {
        const tuple = str.split(": ");
        return {
          ...memo,
          // idだったらnumberにする
          [tuple[0]]: tuple[0] === "id" ? Number(tuple[1]) : tuple[1],
        };
      }
    }, {});

  // 本文を抜き出す
  const body_tmp = JSON.stringify(filestring).split("\\n").slice(1);
  const body = body_tmp
    .slice(body_tmp.findIndex((str) => str === "---") + 1)
    .join("\\n");

  // オブジェクトにして返す
  return {
    ...yaml,
    body,
  };
};

export const loader = async () =>
  Promise.all(
    [...(await Array.fromAsync(await fs.glob(S_MD)))].map(async (filepath) =>
      getJsonFromMarkdown(await fs.readFile(filepath, "utf8")),
    ),
  );
