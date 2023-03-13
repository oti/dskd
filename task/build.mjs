import { asset } from "./asset.mjs";
import { database } from "./database.mjs";
import { html } from "./html.mjs";
import { matters } from "./matters.mjs";

await asset()
  .then(async () => await matters())
  .then(async (matters) => await database(matters))
  .then(async (db) => await html(db));
