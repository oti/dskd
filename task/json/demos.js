const
  fs = require('fs')
, gulp = require('gulp')
, plumber = require('gulp-plumber')
, frontMatter = require('gulp-front-matter')
, listStream = require('list-stream')
, jsonPretty = require('json-pretty')
, formatJson = {
  archives: require('./archives')
}

// demo（demo/*.md -> demos.json -> demos-archives.json）
const demos = () => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(listStream.obj((err, data) => {
      const json = {}
      data.forEach(demo => {
        json[demo.frontMatter.page_id] = demo.frontMatter
      })

      fs.writeFileSync('./src/json/demos.json', jsonPretty(json))
      fs.writeFileSync('./src/json/demo-archives.json', jsonPretty(formatJson.archives(json, 'demos')))
    }))
}

module.exports = demos
