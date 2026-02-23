import { asset } from "./asset.mjs";
import { database } from "./database.mjs";
import { html } from "./html.mjs";
import { loader } from "./loader.mjs";

process.argv[2] == "--only-html"
  ? await loader().then(database).then(html)
  : await asset().then(loader).then(database).then(html);
