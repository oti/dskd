const fs = require('fs')
const gulp = require('gulp')
const plumber = require('gulp-plumber')
const frontMatter = require('gulp-front-matter')
const listStream = require('list-stream')
const jsonPretty = require('json-pretty')
const formatJson = {archives: require('./archives')}

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
