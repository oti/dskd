// load plugins
const fs = require('fs')
const gulp = require('gulp')
const browserSync = require('browser-sync')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const cmq = require('gulp-merge-media-queries')
const frontMatter = require('gulp-front-matter')
const prettify = require('gulp-prettify')
const layout = require('gulp-layout')
const markdown = require('gulp-markdown')
const markdown2Json = require('gulp-markdown-to-json')
const rename = require('gulp-rename')
const util = require('gulp-util')
const _ = require('lodash')
const through = require('through2')
const mkd = require('marked')
const jsonStringify = require('json-pretty')
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
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 10", "iOS >= 9", "Android >= 4.4"]
    }))
    .pipe(cmq())
    .pipe(sourcemaps.write('./'))
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
  const obj = {}
  const key = (type === 'post') ? 'archives' : (type === 'demo') ? 'demos' : null
  if (!key) {
    new Error('unexpected arg. `type` is', type)
    return
  }

  // 必要なデータだけ抽出
  const drip = posts.map((post) => {
    return {
      page_id: post.page_id,
      page_datetime: post.page_datetime,
      page_title: post.page_title,
      page_description: post.page_description,
      page_tag: post.page_tag
      // page_body: post.body
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

  // obj = {'arthives': [{post}, {post}, {post}...]}
  obj[key] = drip

  return obj
}

// タグごとのjsonを作る
const createTagsJson = (posts) => {
  const tags_post_map = []
  const tags_post_list = {}

  const obj = {tags: {}}

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  posts.forEach((post, i) => {
    post.page_tag.forEach((tag_name, i) => {
      const set = {}
      set[tag_name] = post.page_id
      tags_post_map.push(set)
      // あとで使うので空の配列をキーごとに持たせる
      tags_post_list[tag_name] = []
    })
  })

  // タグごとに該当するpage_idを配列に入れる
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': ['1', '12'], note: ['7'],...}
  tags_post_map.forEach((set, i) => {
    const tag_name = Object.keys(set)[0]
    tags_post_list[tag_name].push(set[tag_name])
  })

  // タグ別に記事が配列になったjsonを作る
  for(let key of Object.keys(tags_post_list)) {

    const drip = tags_post_list[key].map((id) => {
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
    drip.sort((a, b) => {
      const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
      const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
      if (date_a > date_b) return -1
      if (date_a < date_b) return 1
      return 0
    })

    // 対応するタグネームに入れる
    // obj = {'tags': {'CSS': [{post}, {post}...], 'note': [{post}, {post}...]}}
    obj.tags[key] = drip

    // tags_nameごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'tag'\npage_title: '${key}'\n---`
    const safe_tag_name = key.toLowerCase().replace(/[ .-]/g, '_')
    fs.writeFile('./src/md/archives/'+safe_tag_name+'.md', yaml_block)
  }

  return obj
}

// 年ごとのjsonを作る
const createYearsJson = (posts) => {
  const years_post_map = []
  const years_post_list = {}

  const obj = {years: {}}

  // 年とpage_idの対応オブジェクトを抽出
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  posts.forEach((post, i) => {
    const yyyy = post.page_datetime.split('-')[0]
    const set = {}
    set[yyyy] = post.page_id
    years_post_map.push(set)
    // あとで使うので空の配列をキーごとに持たせる
    years_post_list[yyyy] = []
  })

  // 年ごとに該当するpage_idを配列に入れる
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  years_post_map.forEach((set, i) => {
    const yyyy = Object.keys(set)[0]
    years_post_list[yyyy].push(set[yyyy])
  })

  // 年別に記事が配列になったjsonを作る
  for(let key of Object.keys(years_post_list)) {
    const drip = years_post_list[key].map(id => {
      return {
        sort_key: sort_val,
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
    // obj = {'years': {'2010': [{post}, {post}...], '2011': [{post}, {post}...], '2012': [{post}, {post}...]}}
    obj.years[key] = drip

    // yearごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'year'\npage_title: '${key}'\n---`
    fs.writeFile('./src/md/archives/'+key+'.md', yaml_block)
  }

  return obj
}

// 記事ごとに前後の記事情報をもったjsonを作る
const createNeighborsJson = (archives) => {
  const obj = {neighbors: {}}

  archives.forEach((post, i) => {
    const old_set = {}
    const new_set = {}

    // olderがあれば作る
    if(archives[i+1]) {
      old_set = {
        page_id: archives[i+1].page_id,
        page_title: archives[i+1].page_title
      }
    }

    // newerがあれば作る
    if(archives[i-1]) {
      new_set = {
        page_id: archives[i-1].page_id,
        page_title: archives[i-1].page_title
      }
    }

    // postごとに持つ
    obj.neighbors[post.page_id] = {
      older: old_set,
      newer: new_set
    }
  })

  return obj
}


// 記事オブジェクト作成タスク ====================

// post（post/*.md -> posts.json -> archives.json, tags.json, years.json）
const json_post = (callback) => {
  return gulp.src('./src/md/post/*.md')
    .pipe(plumber())
    .pipe(listStream.obj())
    .pipe(markdown2Json(mkd, 'posts.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      const posts = JSON.parse(String(file.contents))

      const archives_json = createArchivesJson(posts, 'post')

      fs.writeFile('./src/json/archives.json', jsonStringify(archives_json))
      fs.writeFile('./src/json/neighbors.json', jsonStringify(createNeighborsJson(archives_json.archives)))
      fs.writeFile('./src/json/tags.json', jsonStringify(createTagsJson(posts)))
      fs.writeFile('./src/json/years.json', jsonStringify(createYearsJson(posts)))

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(jsonStringify(posts))
      callback(null, file)
    }))
    .pipe(gulp.dest('./src/json/'))
}

// demo（demo/*.md -> demos.json -> demos-archives.json）
const json_demo = (callback) => {
  return gulp.src('./src/md/demo/page/*.md')
    .pipe(plumber())
    .pipe(listStream.obj())
    .pipe(markdown2Json(mkd, 'demos.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      const demos = JSON.parse(String(file.contents))

      // いらない気がするので本文部分を削除
      demos.forEach(v => {
        delete v.body
      })

      fs.writeFile('./src/json/demo-archives.json', jsonStringify(createArchivesJson(demos, 'demo')))

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(jsonStringify(demos))
      callback(null, file)
    }))
    .pipe(gulp.dest('./src/json/'))
}


// HTML作成タスク ====================

// 全記事作成（post_id.md -> post_id.html）
const html_post = () => {
  return gulp.src('./src/md/post/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
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
    .pipe(markdown())
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
    .pipe(markdown())
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
    .pipe(markdown())
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
    .pipe(markdown())
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
    .pipe(markdown())
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
