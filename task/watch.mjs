import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";

// どこから実行されても動くように、リポジトリルートを基準にする
const ROOT = path.resolve(import.meta.dirname, "..");

const buildTask = () => {
  return new Promise((resolve) => {
    // ビルドは子プロセスで実行する。ビルド側は cwd 基準のパスを使うので ROOT を渡す
    const child = spawn(process.execPath, [path.join(ROOT, "task/build.mjs")], { cwd: ROOT, stdio: "inherit" });

    child.on("exit", resolve);

    // 子プロセスが失敗しても watch を止めないように resolve する
    child.on("error", (error) => {
      console.error(`build の起動に失敗しました: ${error.message}`);
      resolve();
    });
  })
};

export const watcher = () => {
  let timer = null;
  // ビルドは dist/ を書き換えるので、前のビルドが終わってから次を始める
  let builds = Promise.resolve();

  const rebuild = () => {
    // 連続して保存した場合に少し待ってビルド回数を減らす
    clearTimeout(timer);
    timer = setTimeout(() => {
      builds = builds.then(buildTask);
    }, 50);
  };

  watch(path.join(ROOT, "src"), { recursive: true }, rebuild);
  watch(path.join(ROOT, "task"), { recursive: true }, rebuild);
};
