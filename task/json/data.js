import { existsSync, mkdirSync, writeFileSync } from "fs";
import gulp from "gulp";
import plumber from "gulp-plumber";
import frontMatter from "gulp-front-matter";
import listStream from "list-stream";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { neighbors } from "./neighbors.js";
import { tags } from "./tags.js";
import { years } from "./years.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        if (!existsSync(resolve(__dirname, "../../src/json/"))) {
          mkdirSync(resolve(__dirname, "../../src/json/"));
        }
        writeFileSync(
          resolve(__dirname, "../../src/json/data.json"),
          JSON.stringify(
            {
              archives: md,
              neighbors: neighbors(md),
              tags: tags(md),
              years: years(md),
            },
            null,
            2
          )
        );
      })
    );
