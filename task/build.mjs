import { asset } from "./asset.mjs";
import { database } from "./database.mjs";
import { html } from "./html.mjs";
import { matters } from "./matters.mjs";

await asset().then(matters).then(database).then(html);
