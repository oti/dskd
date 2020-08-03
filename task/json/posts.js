const fs = require("fs");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const frontMatter = require("gulp-front-matter");
const listStream = require("list-stream");
const jsonPretty = require("json-pretty");
const formatJson = {
  archives: require("./archives"),
  years: require("./years"),
  neighbors: require("./neighbors"),
  tags: require("./tags"),
};

// post（post/*.md -> posts.json -> archives.json, tags.json, years.json）
const posts = () => {
  return gulp
    .src("./src/md/post/*.md")
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(
      listStream.obj((err, data) => {
        const json = {};
        data.forEach((post) => {
          json[post.frontMatter.page_id] = post.frontMatter;
        });

        fs.writeFileSync("./src/json/posts.json", jsonPretty(json));
        fs.writeFileSync(
          "./src/json/archives.json",
          jsonPretty(formatJson.archives(json, "archives"))
        );
        fs.writeFileSync(
          "./src/json/neighbors.json",
          jsonPretty(
            formatJson.neighbors(formatJson.archives(json, "archives").archives)
          )
        );
        fs.writeFileSync(
          "./src/json/tags.json",
          jsonPretty(formatJson.tags(json))
        );
        fs.writeFileSync(
          "./src/json/years.json",
          jsonPretty(formatJson.years(json))
        );
      })
    );
};

module.exports = posts;
