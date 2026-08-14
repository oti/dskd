import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { D_HOME } from "../src/config.mjs";

const PORT = Number(process.argv[2]) || 3000;
const ROOT = path.resolve(D_HOME);

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

// リクエストパスを取り出す。壊れた URL やパーセントエンコードはサーバーを落とさず 404 に倒す
const toPathname = (url) => {
  try {
    return decodeURIComponent(new URL(url, "http://localhost").pathname);
  } catch {
    return null;
  }
};

// dist 配下の実ファイルを探す。ディレクトリなら index.html、拡張子なしなら .html / .xml を試す
const candidates = (pathname) => {
  const filepath = path.join(ROOT, pathname);
  if (filepath !== ROOT && !filepath.startsWith(`${ROOT}${path.sep}`)) return [];

  return pathname.endsWith("/")
    ? [path.join(filepath, "index.html")]
    : [filepath, `${filepath}.html`, `${filepath}.xml`, path.join(filepath, "index.html")];
};

// 候補を順に読んで最初に読めたものを返す。stat を挟まないのでディレクトリは EISDIR で自然に外れる
const readFirst = async (pathname) => {
  for (const filepath of candidates(pathname)) {
    const body = await fs.readFile(filepath).catch(() => null);
    if (body !== null) return { filepath, body };
  }
  return null;
};

http
  .createServer(async (req, res) => {
    const pathname = toPathname(req.url);
    const file = pathname === null ? null : await readFirst(pathname);

    if (file) {
      res.writeHead(200, {
        "cache-control": "no-store",
        "content-type": MIME[path.extname(file.filepath)] ?? "application/octet-stream",
      });
      res.end(file.body);
    } else {
      res.writeHead(404, { "content-type": MIME[".txt"] });
      res.end("404 Not Found\n");
    }

    console.log(`${res.statusCode} ${pathname ?? req.url}`);
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}/`));
