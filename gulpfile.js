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

// var blogConf = $.yaml.safeLoad($.fs.readFileSync('blog-conf.yml', 'utf8'));
var blogConf = fs.readFileSync('./blog-conf.json', 'utf8');

// config
var config = {
  src: './src/',
  dist: './htdocs/',
  browserSupport: ['last 3 versions', 'ie >= 8'],
  proxy: 'localhost:7002'
};

// 日付で降順ソートされたarchives.jsonを作る
var createArchivesJson = function(posts) {
  // var posts = JSON.parse(fs.readFileSync(config.src + 'json/posts.json', 'utf8'));
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

  fs.writeFile(config.src + 'json/archives.json', JSON.stringify(dist));
};

// タグごとのjsonを作る
var createTagsJson = function(posts) {
  // var posts = JSON.parse(fs.readFileSync(config.src + 'json/posts.json', 'utf8'));
  // var archives = JSON.parse(fs.readFileSync(config.src + 'json/archives.json', 'utf8'));
  var tags_post_map = [];
  var tags_post_list = {};

  var dist = {tags: []};

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  _.forEach(posts, function(post, i){
    // postsをeachしても同じデータは作れるけど、archivesは降順ソートされているのでこっちを使う
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
  // tags_post_list = {'CSS': ['12', '1'], note: ['1'],...}
  _.forEach(tags_post_map, function(set, i){
    var tag_name = _.keys(set);
    tags_post_list[tag_name].push(set[tag_name]);
  });

  // タグごとにjsonを作る
  _.forEach(tags_post_list, function(id_arr, i){
    var tag_name = i;
    var post_arr = [];
    _.forEach(id_arr, function(id, i){
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      var post_data = {
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_tag: posts[id].page_tag,
        page_title: posts[id].page_title
      };
      post_arr.push(post_data);
    });

    dist.tags = post_arr;

    // tags_name（tags_post_listのキー）ごとにwriteFile
    fs.writeFile(config.src + 'json/'+tag_name+'.json', JSON.stringify(dist));
  });
};


// 記事作成タスク ====================

// 　オブジェクト作成（*.md -> posts.json, archives.json, <tag-name>.json）
gulp.task('build:json', function(callback) {
  return gulp.src(config.src + 'post/**/*.md')
    .pipe(util.buffer())
    .pipe(markdown2Json('posts.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      var posts = JSON.parse(String(file.contents));

      createArchivesJson(posts);
      createTagsJson(posts);

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(JSON.stringify(posts));
      callback(null, file);
    }))
    .pipe(gulp.dest(config.src + 'json/'))
});

// 全記事作成（post_id.md -> post_id.html）
gulp.task('build:post', function() {
  return gulp.src(config.src + 'post/**/*.md')
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var data = _.assign({}, blogConf, file.frontMatter);
      return data;
    }))
    .pipe(htmlPrettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(config.dist + 'archives/'));
});


// サイト開発タスク ====================

// server & browser sync
gulp.task('server', function() {
  browserSync({
    baseDir: config.dist,
    proxy: config.proxy
  });
});

// jade
gulp.task('jade', function () {
  gulp.src([config.src + 'jade/**/*.jade', '!' + config.src + 'jade/**/_*.jade'])
    .pipe(plumber())
    .pipe(data(function(file) {
      // console.log(frontMatter(String(file.contents)))
      return require('./blog-conf.json');
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.dist))
});

// imagemin:img
gulp.task('imagemin:img', function() {
  return gulp.src(config.src + 'img/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe(browserSync.stream());
});

// imagemin:svg
gulp.task('imagemin:svg', function() {
  return gulp.src(config.src + 'svg/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe(browserSync.stream());
});

// sass
gulp.task('sass', function() {
  return gulp.src(config.src + 'scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: config.browserSupport
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist + 'css'))
    .pipe(browserSync.stream());
});

// copy:font
gulp.task('copy:font', function() {
  return gulp.src(config.src + 'font/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.dist + 'font'))
    .pipe(browserSync.stream());
});

// copy:misc
gulp.task('copy:misc', function() {
  return gulp.src(config.src + 'misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(config.dist + 'misc'))
    .pipe(browserSync.stream());
});

// watch
gulp.task('watch', function() {
  watch([config.src + 'jade/**/*.jade'], function(e) {
    gulp.start(['jade']);
  });

  watch([config.src + 'scss/**/*.scss'], function(e) {
    gulp.start(['sass']);
  });
});

// dev
// - only compile
gulp.task('dev', function() {
  runSequence(/*'jade', */'sass', 'imagemin:img', 'imagemin:svg', 'copy:font', 'copy:misc');
});

// default
//  - local development task
gulp.task('default', function() {
  runSequence(['dev'], ['server'], ['watch']);
});
