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

// configs
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
  // let posts = require('./src/json/posts.json')
  let cache_arr = []
  let posts_arr = []
  let dist = {}
  let target_key = ''

  if(type === 'post') {
    target_key = 'archives'
  } else if(type === 'demo') {
    target_key = 'demos'
  }

  // ソートするためのキーを追加しつつ必要なデータだけ抽出
  _.forEach(posts, function(post, i){
    // 記事の日付を連続した数値に変換
    let sort_val = post.page_datetime.split('-').join('').split('T').join('').split(':').join('')
    let drip = {
      sort_key: sort_val,
      page_id: post.page_id,
      page_datetime: post.page_datetime,
      page_title: post.page_title,
      page_description: post.page_description,
      page_tag: post.page_tag
      // page_body: post.body
    }
    cache_arr.push(drip)
  })

  // 日付で降順ソート
  cache_arr = _.sortBy(cache_arr ,function(val){
    return -Number(val.sort_key)
  })

  // ソート用のキーを削除
  _.forEach(cache_arr, function(post, i){
    delete post.sort_key
    posts_arr.push(post)
  })

  dist[target_key] = posts_arr

  return dist
}

// タグごとのjsonを作る
const createTagsJson = (posts) => {
  // let posts = require('./src/json/posts.json')
  let tags_post_map = []
  let tags_post_list = {}

  let dist = {tags: {}}

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  _.forEach(posts, function(post, i){
    var post_tag_arr = post.page_tag
    _.forEach(post_tag_arr, function(tag_name, i){
      var set = {}
      set[tag_name] = post.page_id
      tags_post_map.push(set)
      // あとで使うので空の配列をキーごとに持たせる
      tags_post_list[tag_name] = []
    })
  })

  // タグごとに該当するpage_idを配列に入れる
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': ['12', '1'], note: ['1'],...}
  _.forEach(tags_post_map, function(set, i){
    var tag_name = _.keys(set)
    tags_post_list[tag_name].push(set[tag_name])
  })

  // タグ別に記事が配列になったjsonを作る
  _.forEach(tags_post_list, function(id_arr, i){
    var tag_name = i
    var cache_arr = []
    var posts_arr = []
    _.forEach(id_arr, function(id, i){
      // 記事の日付を連続した数値に変換
      var sort_val = posts[id].page_datetime.split('-').join('').split('T').join('').split(':').join('')
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      var drip = {
        sort_key: sort_val,
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
      cache_arr.push(drip)
    })

    // 日付で降順ソート
    cache_arr = _.sortBy(cache_arr ,function(val){
      return -Number(val.sort_key)
    })

    // ソート用のキーを削除
    _.forEach(cache_arr, function(post, i){
      delete post.sort_key
      posts_arr.push(post)
    })

    // 対応するタグネームに入れる
    dist.tags[tag_name] = posts_arr

    // tags_nameごとにmdファイルをwriteFile
    var tag_yaml = `---\nlayout: ./src/html/index.pug\npage_type: 'tag'\npage_title: '${tag_name}'\n---`
    var safe_tag_name = tag_name.toLowerCase().replace(' ', '_').replace(' ', '_').replace(' ', '_')
    safe_tag_name = safe_tag_name.replace('.', '_').replace('.', '_').replace('.', '_')
    fs.writeFile('./src/md/archives/'+safe_tag_name+'.md', tag_yaml)
  })

  return dist
}

// 年ごとのjsonを作る
const createYearsJson = (posts) => {
  var years_post_map = []
  var years_post_list = {}

  var dist = {years: {}}

  // 年とpage_idの対応オブジェクトを抽出
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  _.forEach(posts, function(post, i){
    var yyyy = post.page_datetime.split('-')[0]
    var set = {}
    set[yyyy] = post.page_id
    years_post_map.push(set)
    // あとで使うので空の配列をキーごとに持たせる
    years_post_list[yyyy] = []
  })

  // 年ごとに該当するpage_idを配列に入れる
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  _.forEach(years_post_map, function(set, i){
    var yyyy = _.keys(set)
    years_post_list[yyyy].push(set[yyyy])
  })

  // 年別に記事が配列になったjsonを作る
  _.forEach(years_post_list, function(id_arr, i){
    var yyyy = i
    var cache_arr = []
    var posts_arr = []
    _.forEach(id_arr, function(id, i){
      // 記事の日付を連続した数値に変換
      var sort_val = posts[id].page_datetime.split('-').join('').split('T').join('').split(':').join('')
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      var drip = {
        sort_key: sort_val,
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
      cache_arr.push(drip)
    })

    // 日付で降順ソート
    cache_arr = _.sortBy(cache_arr ,function(val){
      return -Number(val.sort_key)
    })

    // ソート用のキーを削除
    _.forEach(cache_arr, function(post, i){
      delete post.sort_key
      posts_arr.push(post)
    })

    // 対応する年キーに入れる
    dist.years[yyyy] = posts_arr

    // yearごとにmdファイルをwriteFile
    var year_yaml = `---\nlayout: ./src/html/index.pug\npage_type: 'year'\npage_title: '${yyyy}'\n---`
    fs.writeFile('./src/md/archives/'+yyyy+'.md', year_yaml)
  })

  return dist
}

// 記事ごとに前後の記事情報をもったjsonを作る
const createNeighborsJson = (archives) => {
  // var data = require('./src/json/archives.json')
  // var archives = data.archives
  var neighbors_arr = []

  var dist = {neighbors: {}}

  _.forEach(archives, function(post, i){
    var old_set = {}
    var new_set = {}

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
    dist.neighbors[post.page_id] = {
      older: old_set,
      newer: new_set
    }
  })

  return dist
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
      var posts = JSON.parse(String(file.contents))

      var archives_json = createArchivesJson(posts, 'post')

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
      var demos = JSON.parse(String(file.contents))

      // いらない気がするので本文部分を削除
      _.forEach(demos, function(v,i){
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
  // buld asset
  css,
  image,
  misc,
  // buld post
  json_post,
  gulp.parallel(
    html_post,
    html_archives,
    html_page
  ),
  feed,
  // build demo
  json_demo,
  gulp.parallel(
    html_demo,
    html_demo_index
  ),
  // local server
  server,
  // file watcher
  watch
))
