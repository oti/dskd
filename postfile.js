'use strict';

// load plugins ====================
var fs             = require('fs');
var gulp           = require('gulp');
var frontMatter    = require('gulp-front-matter');
var prettify       = require('gulp-prettify');
var imagemin       = require('gulp-imagemin');
var layout         = require('gulp-layout');
var markdown       = require('gulp-markdown');
var markdown2Json  = require('gulp-markdown-to-json');
var plumber        = require('gulp-plumber');
var rename         = require('gulp-rename');
var util           = require('gulp-util');
var _              = require('lodash');
var runSequence    = require('run-sequence');
var through        = require('through2');
var mkd            = require('marked');

// configs
var blogConfig = require('./blogconfig.json', 'utf8');
var devConfig  = require('./devconfig.json', 'utf8');


// 日付で降順ソートされたarchives.jsonを作る
var createArchivesJson = function(posts, type, callback) {
  // var posts = JSON.parse(fs.readFileSync(devConfig.src + 'json/posts.json', 'utf8'));
  var cache_arr = [];
  var posts_arr = [];
  var dist = {};
  var target_key = '';
  var file_name = '';

  if(type === 'post') {
    target_key = 'archives';
    file_name = 'archives'
  } else if(type === 'demo') {
    target_key = 'demos';
    file_name = 'demo-archives'
  }

  // ソートするためのキーを追加しつつ必要なデータだけ抽出
  _.forEach(posts, function(post, i){
    // 記事の日付を連続した数値に変換
    var sort_val = post.page_datetime.split('-').join('').split('T').join('').split(':').join('');
    var drip = {
      sort_key: sort_val,
      page_id: post.page_id,
      page_datetime: post.page_datetime,
      page_title: post.page_title,
      page_description: post.page_description,
      page_tag: post.page_tag
      // page_body: post.body
    };
    cache_arr.push(drip);
  });

  // 日付で降順ソート
  cache_arr = _.sortBy(cache_arr ,function(val){
    return -Number(val.sort_key);
  });

  // ソート用のキーを削除
  _.forEach(cache_arr, function(post, i){
    delete post.sort_key;
    posts_arr.push(post);
  });

  dist[target_key] = posts_arr;
  fs.writeFile(devConfig.src + 'json/'+file_name+'.json', JSON.stringify(dist));

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
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      };
      cache_arr.push(drip);
    });

    // 日付で降順ソート
    cache_arr = _.sortBy(cache_arr ,function(val){
      return -Number(val.sort_key);
    });

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
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      };
      cache_arr.push(drip);
    });

    // 日付で降順ソート
    cache_arr = _.sortBy(cache_arr ,function(val){
      return -Number(val.sort_key);
    });

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

// オブジェクト作成（post/*.md -> posts.json, archives.json, <tag-name>.json）
gulp.task('build:json:posts', function(callback) {
  return gulp.src(devConfig.src + 'md/post/*.md')
    .pipe(plumber())
    .pipe(util.buffer())
    .pipe(markdown2Json(mkd, 'posts.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      var posts = JSON.parse(String(file.contents));

      // いらない気がするので本文部分を削除
      // _.forEach(posts, function(v,i){
      //   delete v.body;
      // });

      createArchivesJson(posts, 'post', function(data){
        createNeighborsJson(data.archives);
      });
      createTagsJson(posts);
      createYearsJson(posts);

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(JSON.stringify(posts));
      callback(null, file);
    }))
    .pipe(gulp.dest(devConfig.src + 'json/'))
});

// オブジェクト作成（demo/*.md -> ）
gulp.task('build:json:demos', function(callback) {
  return gulp.src(devConfig.src + 'md/demo/page/*.md')
    .pipe(plumber())
    .pipe(util.buffer())
    .pipe(markdown2Json(mkd, 'demos.json'))
    .pipe(through.obj(function (file, enc, callback) {
      //バッファから文字列に変化させてJSONに戻す
      var demos = JSON.parse(String(file.contents));

      // いらない気がするので本文部分を削除
      _.forEach(demos, function(v,i){
        delete v.body;
      });

      createArchivesJson(demos, 'demo');

      // バッファに戻してpipeに渡す
      file.contents = new Buffer(JSON.stringify(demos));
      callback(null, file);
    }))
    .pipe(gulp.dest(devConfig.src + 'json/'))
});


// HTML作成タスク ====================

// 全記事作成（post_id.md -> post_id.html）
gulp.task('build:post:page', function() {
  return gulp.src(devConfig.src + 'md/post/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var neighbors = require(devConfig.src + 'json/neighbors.json');
      var data = _.assign({}, blogConfig, neighbors);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'archives/'))
});

// 記事一覧ページ作成（archives_name.md -> archives_name.html）
gulp.task('build:post:archives', function() {
  return gulp.src(devConfig.src + 'md/archives/*.md')
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
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'archives/'))
});

// ブログインデックス作成（index.md -> index.html）
gulp.task('build:post:index', function() {
  return gulp.src([devConfig.src + 'md/index.md', devConfig.src + 'md/about.md'])
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var archives  = require(devConfig.src + 'json/archives.json');
      var data = _.assign({}, blogConfig, archives);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist))
});

// デモ個別ページ作成（md/demo/pages/*.md -> demo/*.html）
gulp.task('build:demo:page', function() {
  return gulp.src(devConfig.src + 'md/demo/page/*.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var data = _.assign({}, blogConfig, file.frontMatter);
      return data;
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'demo/'))
});

// デモインデックス作成（md/demo/index.md -> demo/index.html）
gulp.task('build:demo:index', function() {
  return gulp.src(devConfig.src + 'md/demo/index.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var demos  = require(devConfig.src + 'json/demo-archives.json');
      var data = _.assign({}, blogConfig, demos);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(devConfig.dist + 'demo/'))
});

// RSS作成（feed.md -> feed）
gulp.task('build:post:feed', function() {
  return gulp.src(devConfig.src + 'md/feed.md')
    .pipe(plumber())
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(layout(function(file) {
      var archives  = require(devConfig.src + 'json/archives.json');
      var data = _.assign({}, blogConfig, archives);
      data = _.assign({}, data, file.frontMatter);
      return data;
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(rename({extname: '.xml'}))
    .pipe(gulp.dest(devConfig.dist))
});


// 全記事作成
gulp.task('build:html:post', function(callback) {
  runSequence('build:json:posts', ['build:post:page', 'build:post:archives', 'build:post:index'], 'build:post:feed', callback);
});

// 全デモ作成
gulp.task('build:html:demo', function(callback) {
  runSequence('build:json:demos', ['build:demo:page', 'build:demo:index'], callback);
});

// 全HTML作成
gulp.task('build:html', function(callback) {
  runSequence('build:html:post', 'build:html:demo', callback);
});
