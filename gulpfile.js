// load plugins
const fs = require('fs')
const gulp = require('gulp')
const browserSync = require('browser-sync')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const csswring = require('csswring')
const mqpacker = require('css-mqpacker')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const frontMatter = require('gulp-front-matter')
const prettify = require('gulp-prettify')
const layout = require('gulp-layout')
const md = require('gulp-markdown')
const rename = require('gulp-rename')
const jsonPretty = require('json-pretty')
const listStream = require('list-stream');

// config
const blogConfig = require('./blogconfig.json')

// server & browser sync
const server = () => {
  browserSync.init({
    ui: false,
    server: {
      baseDir: './htdocs/',
      proxy: 'localhost:3000'
    }
  })
}

// browser sync reload
const reload = () => {
  browserSync.reload()
}

// imagemin:img
const image = () => {
  return gulp.src('./src/image/**/*')
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: true}
        ]
      })
    ]))
    .pipe(gulp.dest('./htdocs/img/'))
    .pipe(browserSync.stream())
}

// sass
const css = () => {
  return gulp.src('./src/style/style.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({grid: true}),
      mqpacker(),
      csswring()
    ]))
    .pipe(gulp.dest('./htdocs/css/'))
    .pipe(browserSync.stream())
}

// misc
const misc = () => {
  return gulp.src('./src/misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./htdocs/misc/'))
    .pipe(browserSync.stream())
}


// 日付で降順ソートされたarchives.jsonを作る
const createArchivesJson = (posts, type) => {
  const dripped = []

  // 必要なデータだけ抽出
  for(let key of Object.keys(posts)) {
    dripped.push({
      page_id: posts[key].page_id,
      page_datetime: posts[key].page_datetime,
      page_title: posts[key].page_title,
      page_description: posts[key].page_description,
      page_tag: posts[key].page_tag
    })
  }

  // 日付で降順ソート
  dripped.sort((a, b) => {
    const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
    const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
    if (date_a > date_b) return -1
    if (date_a < date_b) return 1
    return 0
  })

  // json = {'arthives': [{post}, {post}, {post}...]}
  // json = {'demos': [{post}, {post}, {post}...]}
  return {[type]: dripped}
}

// タグごとのjsonを作る
const createTagsJson = (posts) => {
  const tags_post_map = []
  const tags_post_list = {}
  const json = {tags: {}}

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  for(let key of Object.keys(posts)) {
    posts[key].page_tag.forEach(tag_name => {
      tags_post_map.push({[tag_name]: posts[key].page_id})
      // あとで使うので空の配列をキーごとに持たせる
      tags_post_list[tag_name] = []
    })
  }

  // タグごとに該当するpage_idを配列に入れる
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': ['1', '12'], note: ['7'],...}
  tags_post_map.forEach(set => {
    const tag_name = Object.keys(set)[0]
    tags_post_list[tag_name].push(set[tag_name])
  })

  // タグ別に記事が配列になったjsonを作る
  for(let key of Object.keys(tags_post_list)) {
    let dripped = tags_post_list[key].map(id => {
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      return {
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
    })

    // 日付で降順ソート
    dripped.sort((a, b) => {
      const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
      const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
      if (date_a > date_b) return -1
      if (date_a < date_b) return 1
      return 0
    })

    // 対応するタグネームに入れる
    // json = {'tags': {'CSS': [{post}, {post}...], 'note': [{post}, {post}...]}}
    json.tags[key] = dripped

    // tags_nameごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'tag'\npage_title: '${key}'\n---`
    const safe_tag_name = key.toLowerCase().replace(/[ .-]/g, '_')
    fs.writeFileSync('./src/md/archives/'+safe_tag_name+'.md', yaml_block)
  }

  return json
}

// 年ごとのjsonを作る
const createYearsJson = (posts) => {
  const years_post_map = []
  const years_post_list = {}
  const json = {years: {}}

  // 年とpage_idの対応オブジェクトを抽出
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  for(let key of Object.keys(posts)) {
    const yyyy = posts[key].page_datetime.split('-')[0]

    years_post_map.push({[yyyy]: posts[key].page_id})
    // あとで使うので空の配列をキーごとに持たせる
    years_post_list[yyyy] = []
  }

  // 年ごとに該当するpage_idを配列に入れる
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  years_post_map.forEach(set => {
    const yyyy = Object.keys(set)[0]
    years_post_list[yyyy].push(set[yyyy])
  })

  // 年別に記事が配列になったjsonを作る
  for(let key of Object.keys(years_post_list)) {
    const drip = years_post_list[key].map(id => {
      return {
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
    })

    // 日付で降順ソート
    drip.sort((a, b) => {
      const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
      const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
      if (date_a > date_b) return -1
      if (date_a < date_b) return 1
      return 0
    })

    // 対応する年キーに入れる
    // json = {'years': {'2010': [{post}, {post}...], '2011': [{post}, {post}...], '2012': [{post}, {post}...]}}
    json.years[key] = drip

    // yearごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'year'\npage_title: '${key}'\n---`
    fs.writeFileSync('./src/md/archives/'+key+'.md', yaml_block)
  }

  return json
}

// 記事ごとに前後の記事情報をもったjsonを作る
const createNeighborsJson = (archives) => {
  const json = {neighbors: {}}

  archives.forEach((post, i) => {
    const old_set = {}
    const new_set = {}

    // olderがあれば作る
    if(archives[i+1]) {
      old_set.page_id    = archives[i+1].page_id
      old_set.page_title = archives[i+1].page_title
    }

    // newerがあれば作る
    if(archives[i-1]) {
      new_set.page_id    = archives[i-1].page_id,
      new_set.page_title = archives[i-1].page_title
    }

    // postごとに持つ
    json.neighbors[post.page_id] = {
      older: old_set,
      newer: new_set
    }
  })

  return json
}


// 記事オブジェクト作成タスク ====================

// post（post/*.md -> posts.json -> archives.json, tags.json, years.json）
const json_post = (callback) => {
  return gulp.src('./src/md/post/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(listStream.obj((err, data) => {
      const posts_json = {}
      data.forEach(post => {
        posts_json[post.frontMatter.page_id] = post.frontMatter
      })

      fs.writeFileSync('./src/json/posts.json', jsonPretty(posts_json))

      const archives_json = createArchivesJson(posts_json, 'archives')

      fs.writeFileSync('./src/json/archives.json', jsonPretty(archives_json))
      fs.writeFileSync('./src/json/neighbors.json', jsonPretty(createNeighborsJson(archives_json.archives)))
      fs.writeFileSync('./src/json/tags.json', jsonPretty(createTagsJson(posts_json)))
      fs.writeFileSync('./src/json/years.json', jsonPretty(createYearsJson(posts_json)))
    }))
}

// demo（demo/*.md -> demos.json -> demos-archives.json）
const json_demo = (callback) => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(listStream.obj((err, data) => {
      const demos_json = {}
      data.forEach(demo => {
        demos_json[demo.frontMatter.page_id] = demo.frontMatter
      })

      fs.writeFileSync('./src/json/demos.json', jsonPretty(demos_json))
      fs.writeFileSync('./src/json/demo-archives.json', jsonPretty(createArchivesJson(demos_json, 'demos')))
    }))
}


// HTML作成タスク ====================

// 全記事作成（post_id.md -> post_id.html）
const html_post = () => {
  return gulp.src('./src/md/post/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const neighbors = require('./src/json/neighbors.json')
      return Object.assign(blogConfig, neighbors, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/archives/'))
}

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
const html_archives = () => {
  return gulp.src('./src/md/archives/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('./src/json/archives.json')
      const years = require('./src/json/years.json')
      const tags = require('./src/json/tags.json')
      return Object.assign(blogConfig, archives, years, tags, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/archives/'))
}

// ブログインデックス作成（index.md -> index.html）
const html_page = () => {
  return gulp.src(['./src/md/index.md', './src/md/about.md'])
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('./src/json/archives.json')
      return Object.assign(blogConfig, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/'))
}

// デモ個別ページ作成（md/demo/pages/*.md -> demo/*.html）
const html_demo = () => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      return Object.assign(blogConfig, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/demo/'))
}

// デモインデックス作成（md/demo/index.md -> demo/index.html）
const html_demo_index = () => {
  return gulp.src('./src/md/demo/index.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const demos = require('./src/json/demo-archives.json')
      return Object.assign(blogConfig, demos, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./htdocs/demo/'))
}

// RSS作成（feed.md -> feed）
const feed = () => {
  return gulp.src('./src/md/feed.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(md())
    .pipe(layout(function(file) {
      const archives = require('./src/json/archives.json')
      return Object.assign(blogConfig, archives, file.frontMatter)
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rename({extname: '.xml'}))
    .pipe(gulp.dest('./htdocs/'))
}

// watch
const watch = () => {
  const options = {
    delay: 50,
  }

  gulp.watch('./src/style/**/*', options, css)
  gulp.watch('./src/image/**/*', options, image)
  gulp.watch('./src/misc/**/*',  options, misc)
  gulp.watch('./src/html/**/*',  options, build_html)
}


gulp.task('default', gulp.series(
  gulp.parallel(
    css,
    image,
    misc
  ),

  gulp.parallel(
    json_post,
    json_demo
  ),

  gulp.parallel(
    html_post,
    html_archives,
    html_page,
    feed
  ),

  gulp.parallel(
    html_demo,
    html_demo_index
  ),

  server,
  watch
))
