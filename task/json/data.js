import fs from "fs";
import path from "path";
import url from "url";
import gulp from "gulp";
import plumber from "gulp-plumber";
import frontMatter from "gulp-front-matter";
import listStream from "list-stream";
import jsonPretty from "json-pretty";
import { years } from "./years.js";
import { neighbors } from "./neighbors.js";
import { tags } from "./tags.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const data = () =>
  gulp
    .src("./src/md/post/*.md")
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(
      listStream.obj((err, data) => {
        if (err) throw err;
        const md = data
          .map((post) => post.frontMatter)
          .sort((a, b) =>
            Number(
              b.page_datetime
                .replace(/[-T:]/g, "")
                .localeCompare(Number(a.page_datetime.replace(/[-T:]/g, "")))
            )
          );
        if (!fs.existsSync(path.resolve(__dirname, "../../src/json/"))) {
          fs.mkdirSync(path.resolve(__dirname, "../../src/json/"));
        }
        fs.writeFileSync(
          path.resolve(__dirname, "../../src/json/data.json"),
          jsonPretty({
            archives: md,
            neighbors: neighbors(md),
            tags: tags(md),
            years: years(md),
          })
        );
      })
    );
