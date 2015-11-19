'use strict';

// load plugins ====================
var fs             = require('fs');
var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var autoprefixer   = require('gulp-autoprefixer');
var data           = require('gulp-data');
var frontMatter    = require('gulp-front-matter');
var htmlPrettify   = require('gulp-html-prettify');
var imagemin       = require('gulp-imagemin');
var jade           = require('gulp-jade');
var layout         = require('gulp-layout');
var markdown       = require('gulp-markdown');
var markdown2Json  = require('gulp-markdown-to-json');
var plumber        = require('gulp-plumber');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var util           = require('gulp-util');
var watch          = require('gulp-watch');
var _              = require('lodash');
var runSequence    = require('run-sequence');
var through        = require('through2');
var yargs          = require('yargs').argv;

// configs
var blogConfig = require('./blogconfig.json', 'utf8');
var devConfig  = require('./devconfig.json', 'utf8');


// 日付で降順ソートされたarchives.jsonを作る
var createArchivesJson = function(posts, callback) {
  // var posts = JSON.parse(fs.readFileSync(devConfig.src + 'json/posts.json', 'utf8'));
  var cache_arr = [];
  var posts_arr = [];

  var dist = {archives: []};

  // ソートするためのキーを追加しつつ必要なデータだけ抽出
  _.forEach(posts, function(post, i){
    // 記事の日付を連続した数値に変換
    var sort_val = post.page_datetime.split('-').join('').split('T').join('').split(':').join('');
    var drip = {
      sort_key: sort_val,
      page_id: post.page_id,
      page_datetime: post.page_datetime,
      page_title: post.page_title,
      page_tag: post.page_tag,
      page_title: post.page_title
    };
    cache_arr.push(drip);
  });

  // 日付で降順ソート
  cache_arr = _.sortByAll(cache_arr, cache_arr.sort_key, function(val){return -val});

  // ソート用のキーを削除
  _.forEach(cache_arr, function(post, i){
    delete post.sort_key;
    posts_arr.push(post);
  });

  dist.archives = posts_arr;
  fs.writeFile(devConfig.src + 'json/archives.json', JSON.stringify(dist));

  if(callback) {
    callback(dist);
  }
};

// タグごとのjsonを作る
var createTagsJson = function(posts) {
  // var posts = JSON.parse(fs.readFileSync(devConfig.src + 'json/posts.json', 'utf8'));
  var tags_post_map = [];
  var tags_post_list = {};

  var dist = {tags: {}};

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  _.forEach(posts, function(post, i){
    var post_tag_arr = post.page_tag;
    _.forEach(post_tag_arr, function(tag_name, i){
      var set = {};
      set[tag_name] = post.page_id;
      tags_post_map.push(set);
      // あとで使うので空の配列をキーごとに持たせる
      tags_post_list[tag_name] = [];
    });
  });

  // タグごとに該当するpage_idを配列に入れる
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': ['12', '1'], note: ['1'],...}
  _.forEach(tags_post_map, function(set, i){
    var tag_name = _.keys(set);
    tags_post_list[tag_name].push(set[tag_name]);
  });

  // タグ別に記事が配列になったjsonを作る
  _.forEach(tags_post_list, function(id_arr, i){
    var tag_name = i;
    var cache_arr = [];
    var posts_arr = [];
    _.forEach(id_arr, function(id, i){
      // 記事の日付を連続した数値に変換
      var sort_val = posts[id].page_datetime.split('-').join('').split('T').join('').split(':').join('');
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      var drip = {
        sort_key: sort_val,
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_tag: posts[id].page_tag,
        page_title: posts[id].page_title
      };
      cache_arr.push(drip);
    });

    // 日付で降順ソート
    cache_arr = _.sortByAll(cache_arr, cache_arr.sort_key, function(val){return -val});

    // ソート用のキーを削除
    _.forEach(cache_arr, function(post, i){
      delete post.sort_key;
      posts_arr.push(post);
    });

    // 対応するタグネームに入れる
    dist.tags[tag_name] = posts_arr;

    // tags_name（tags_post_listのキー）ごとにwriteFile
    // fs.writeFile(devConfig.src + 'json/'+tag_name.toLowerCase().replace(' ', '_')+'.json', JSON.stringify(dist));
  });

  fs.writeFile(devConfig.src + 'json/tags.json', JSON.stringify(dist));

  return;
};

// 年ごとのjsonを作る
var createYearsJson = function(posts) {
  var years_post_map = [];
  var years_post_list = {};

  var dist = {years: {}};

  // 年とpage_idの対応オブジェクトを抽出
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  _.forEach(posts, function(post, i){
    var yyyy = post.page_datetime.split('-')[0];
    var set = {};
    set[yyyy] = post.page_id;
    years_post_map.push(set);
    // あとで使うので空の配列をキーごとに持たせる
    years_post_list[yyyy] = [];
  });

  // 年ごとに該当するpage_idを配列に入れる
  // years_post_map = [{'2010': '1'}, {'2011': '7'}, {'2011': '11'},...]
  // years_post_list = {'2010': [], '2011': [],...}
  _.forEach(years_post_map, function(set, i){
    var yyyy = _.keys(set);
    years_post_list[yyyy].push(set[yyyy]);
  });

  // 年別に記事が配列になったjsonを作る
  _.forEach(years_post_list, function(id_arr, i){
    var yyyy = i;
    var cache_arr = [];
    var posts_arr = [];
    _.forEach(id_arr, function(id, i){
      // 記事の日付を連続した数値に変換
      var sort_val = posts[id].page_datetime.split('-').join('').split('T').join('').split(':').join('');
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      var drip = {
        sort_key: sort_val,
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_tag: posts[id].page_tag,
        page_title: posts[id].page_title
      };
      cache_arr.push(drip);
    });

    // 日付で降順ソート
    cache_arr = _.sortByAll(cache_arr, cache_arr.sort_key, function(val){return -val});

    // ソート用のキーを削除
    _.forEach(cache_arr, function(post, i){
      delete post.sort_key;
      posts_arr.push(post);
    });

    // 対応する年キーに入れる
    dist.years[yyyy] = posts_arr;
  });

  fs.writeFile(devConfig.src + 'json/years.json', JSON.stringify(dist));

  return;
};

// 記事ごとに前後の記事情報をもったjsonを作る
var createNeighborsJson = function(archives) {
  // var data = JSON.parse(fs.readFileSync(devConfig.src + 'json/archives.json', 'utf8'));
  // var archives = data.archives;
  var neighbors_arr = [];

  var dist = {neighbors: {}};

  _.forEach(archives, function(post, i){
    var old_set = {};
    var new_set = {};

    // olderがあれば作る
    if(archives[i+1]) {
      old_set = {
        page_id: archives[i+1].page_id,
        page_title: archives[i+1].page_title
      };
    }

    // newerがあれば作る
    if(archives[i-1]) {
      new_set = {
        page_id: archives[i-1].page_id,
        page_title: archives[i-1].page_title
      };
    }

    // postごとに持つ
    dist.neighbors[post.page_id] = {
      older: old_set,
      newer: new_set
    }
  });

  fs.writeFile(devConfig.src + 'json/neighbors.json', JSON.stringify(dist));
  return dist;
};


// 記事オブジェクト作成タスク ====================

// オブジェクト作成（*.md -> posts.json, archives.json, <tag-name>.json）
gulp.task('build:json', function(callback) {
  return gulp.src(devConfig.src + 'md/post/**/*.md')
    .pipe(plumber())
    .pipe(util.buffer())
    .pipe(markdown2Json('posts.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      var posts = JSON.parse(String(file.contents));

      createArchivesJson(posts, function(data){
        createNeighborsJson(data.archives);
      });
      createTagsJson(posts);
      createYearsJson(posts);

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(JSON.stringify(posts));
      callback(null, file);
    }))
    .pipe(gulp.dest(devConfig.src + 'json/'))
    .pipe(browserSync.stream());
});


// HTML作成タスク ====================

// 全記事作成（post_id.md -> post_id.html）
gulp.task('build:html:post', function() {
  return gulp.src(devConfig.src + 'md/post/**/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var neighbors = require(devConfig.src + 'json/neighbors.json');
      var data = _.assign({}, blogConfig, neighbors);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'archives/'))
    .pipe(browserSync.stream());;
});

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
gulp.task('build:html:archives', function() {
  return gulp.src(devConfig.src + 'md/archives/**/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var data;
      var archives  = require(devConfig.src + 'json/archives.json');
      var years  = require(devConfig.src + 'json/years.json');
      var tags  = require(devConfig.src + 'json/tags.json');
      data = _.assign({}, blogConfig, archives);
      data = _.assign({}, data, years);
      data = _.assign({}, data, tags);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'archives/'))
    .pipe(browserSync.stream());;
});

// ブログインデックス作成（index.md -> index.html）
gulp.task('build:html:index', function() {
  return gulp.src(devConfig.src + 'md/index.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var archives  = require(devConfig.src + 'json/archives.json');
      var data = _.assign({}, blogConfig, archives);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist))
    .pipe(browserSync.stream());;
});


// サイト開発タスク ====================

// server & browser sync
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: devConfig.dist,
      proxy: devConfig.proxy
    }
  });
});

// jade
gulp.task('jade', function () {
  return gulp.src([devConfig.src + 'jade/**/*.jade', '!' + devConfig.src + 'jade/**/_*.jade'])
    .pipe(plumber())
    .pipe(data(function(file) {
      var blog_conf = require('./blogconfig.json');
      var archives = require(devConfig.src + 'json/archives.json');
      var data = _.assign({}, blog_conf, archives);
      return data;
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(devConfig.dist))
    .pipe(browserSync.stream());
});

// imagemin:img
gulp.task('imagemin:img', function() {
  return gulp.src(devConfig.src + 'img/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(devConfig.dist + 'img'))
    .pipe(browserSync.stream());
});

// imagemin:svg
gulp.task('imagemin:svg', function() {
  return gulp.src(devConfig.src + 'svg/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(devConfig.dist + 'img'))
    .pipe(browserSync.stream());
});

// sass
gulp.task('sass', function() {
  return gulp.src(devConfig.src + 'scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: devConfig.browserSupport
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(devConfig.dist + 'css'))
    .pipe(browserSync.stream());
});

// copy:font
gulp.task('copy:font', function() {
  return gulp.src(devConfig.src + 'font/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(devConfig.dist + 'font'))
    .pipe(browserSync.stream());
});

// copy:misc
gulp.task('copy:misc', function() {
  return gulp.src(devConfig.src + 'misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(devConfig.dist + 'misc'))
    .pipe(browserSync.stream());
});

// watch
gulp.task('watch', function() {
  watch([devConfig.src + 'jade/**/*.jade'], function(e) {
    gulp.start(['jade'], function(e){
      browserSync.reload();
    });
  });

  watch([devConfig.src + 'scss/**/*.scss'], function(e) {
    gulp.start(['sass']);
  });

  watch([devConfig.src + 'md/**/*.md'], function(e) {
    gulp.start(['build:html'], function(e){
      browserSync.reload();
    });
  });
});

gulp.task('test', function() {
  runSequence('build:html', 'server', 'watch');
});


// build:static
// - only compile
gulp.task('build:blog', function(callback) {
  runSequence(['jade', 'sass', 'imagemin:img', 'imagemin:svg', 'copy:font', 'copy:misc'], callback);
});

// dev
//  - local development task
gulp.task('dev', function(callback) {
  runSequence(['build:blog', 'server', 'watch'], callback);
});
