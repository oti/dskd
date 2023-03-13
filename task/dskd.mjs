import { asset } from "./asset.mjs";
import { generateDataBase } from "./database.mjs";
import { generateHTML } from "./html.mjs";
import { generateMatters } from "./matters.mjs";

await asset()
  .then(async () => await generateMatters())
  .then(async (matters) => await generateDataBase(matters))
  .then(async (db) => await generateHTML(db));
