const fs = require("fs");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const frontMatter = require("gulp-front-matter");
const listStream = require("list-stream");
const jsonPretty = require("json-pretty");
const yearsJson = require("./years");
const neighborsJson = require("./neighbors");
const tagsJson = require("./tags");

// post（post/*.md -> posts.json -> archives.json, tags.json, years.json）
const posts = () => {
  return gulp
    .src("./src/md/post/*.md")
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(
      listStream.obj((err, data) => {
        if (err) throw err;
        const posts = data
          .map((post) => post.frontMatter)
          .sort((a, b) =>
            Number(
              b.page_datetime
                .replace(/[-T:]/g, "")
                .localeCompare(Number(a.page_datetime.replace(/[-T:]/g, "")))
            )
          );
        fs.writeFileSync(
          "./src/json/data.json",
          jsonPretty({
            archives: posts,
            neighbors: neighborsJson(posts),
            tags: tagsJson(posts),
            years: yearsJson(posts),
          })
        );
      })
    );
};

module.exports = posts;
