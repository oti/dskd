import fs from "node:fs/promises";
import { S_MD } from "../src/config.mjs";

// 決め打ちの読み込み処理
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
      // 値が`  - `で始まる場合はmemo.tag[]に追加する
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
          [tuple[0]]: tuple[1],
        };
      }
    }, {});

  // 本文を抜き出す
  const body_tmp = JSON.stringify(filestring)
    // 改行コードで分割する
    .split("\\n")
    // 先頭は`---`決め打ちなので配列を1つ詰める
    .slice(1);
  const body = body_tmp
    // 最初の`---`がyamlブロックの終わりなので詰める
    .slice(body_tmp.findIndex((str) => str === "---") + 1)
    // ダブルクオーテーションのみの行を配列時点で取り除く
    .filter((str) => str !== '"')
    // 改行コードを戻して文字列化する
    .join("\n")
    // バックスラッシュが混じってしまうので取り除く
    .replace(/\\/g, "")
    // タブを戻す
    .replace(/\\t/g, "	");

  // オブジェクトにして返す
  return {
    ...yaml,
    body,
  };
};

export const loader = async () =>
  Promise.all(
    (await Array.fromAsync(await fs.glob(S_MD))).map(async (filepath) =>
      getJsonFromMarkdown(await fs.readFile(filepath, "utf8")),
    ),
  );
