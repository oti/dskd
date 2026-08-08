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

const readable = async (filepath) =>
  await fs
    .stat(filepath)
    .then((stats) => stats.isFile())
    .catch(() => false);

// dist 配下の実ファイルを探す。ディレクトリなら index.html、拡張子なしなら .html / .xml を試す
const resolveFilepath = async (pathname) => {
  const filepath = path.join(ROOT, path.normalize(decodeURIComponent(pathname)));
  if (filepath !== ROOT && !filepath.startsWith(`${ROOT}${path.sep}`)) return null;

  const candidates = pathname.endsWith("/")
    ? [path.join(filepath, "index.html")]
    : [filepath, `${filepath}.html`, `${filepath}.xml`, path.join(filepath, "index.html")];

  for (const candidate of candidates) {
    if (await readable(candidate)) return candidate;
  }
  return null;
};

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const filepath = await resolveFilepath(pathname);

    if (!filepath) {
      res.writeHead(404, { "content-type": MIME[".txt"] });
      res.end("404 Not Found\n");
      console.log(`404 ${pathname}`);
      return;
    }

    res.writeHead(200, {
      "cache-control": "no-store",
      "content-type": MIME[path.extname(filepath)] ?? "application/octet-stream",
    });
    res.end(await fs.readFile(filepath));
    console.log(`200 ${pathname}`);
  })
  .listen(PORT, () => console.log(`http://localhost:${PORT}/`));
