import { asset } from "./asset.mjs";
import { database } from "./database.mjs";
import { html } from "./html.mjs";
import { matters } from "./matters.mjs";

process.argv[2] == "--only-html"
  ? await matters().then(database).then(html)
  : await asset().then(matters).then(database).then(html);
