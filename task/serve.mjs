import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { D_HOME } from "../src/config.mjs";
import { watcher } from "./watch.mjs";

// watchはデフォで起動しちゃえ〜
watcher();

const PORT = Number(process.env.PORT) || 3000;
const ROOT = path.resolve(import.meta.dirname, "..", D_HOME);
const MIME = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

// ファイルを dist から探す
const readSource = async (pathname) => {
  const filepath = path.join(ROOT, pathname);

  // パストラバーサルを許可しない
  if (path.relative(ROOT, filepath).split(path.sep)[0] === "..") return null;

  const candidates = pathname.endsWith("/")
    // ディレクトリなら `/index.html` を見る
    ? [path.join(filepath, "index.html")]
    // 拡張子がなければ `hoge.html` → `hoge.xml` → `hoge/index.html` の順で試す
    : [filepath, `${filepath}.html`, `${filepath}.xml`, path.join(filepath, "index.html")];


  for (const candidate of candidates) {
    // 存在しない・ディレクトリだった場合は null になるので、次の候補を試す
    const body = await fs.readFile(candidate).catch(() => null);

    if (body) return { body, ext: path.extname(candidate) };
  }

  return null;
};

const send = (response, status, { body, ext }) => {
  response.writeHead(status, {
    "cache-control": "no-store",
    "content-type": MIME[ext] ?? "application/octet-stream",
  });
  response.end(body);
};

const server = http.createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, `http://localhost:${PORT}`);
    const decoded = decodeURIComponent(pathname);
    const source = await readSource(decoded);

    source
      ? send(response, 200, source)
      : send(response, 404, { body: "404 Not Found\n", ext: ".txt" })

    console.log(`${response.statusCode} ${decoded}`);
  } catch (error) {
    // 壊れた URL（/% など）でサーバーを落とさない
    const status = error instanceof URIError ? 400 : 500;

    console.error(`${status} ${request.url}: ${error.message}`);
    send(response, status, { body: `${status} ${status === 400 ? "Bad Request" : "Internal Server Error"}\n`, ext: ".txt" });
  }
});

server.on("error", (error) => {
  if (error.code !== "EADDRINUSE") throw error;
  console.error(`ポート ${PORT} は使用中です。PORT=1234 npm start のように別のポートで実行しください。`);
  process.exit(1);
});

// IPv4 で起動する
server.listen(PORT, "127.0.0.1", () => console.log(`http://localhost:${PORT}/`));
