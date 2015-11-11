'use strict';

// load plugins ====================
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: [
    'gulp-*',
    'browser-sync',
    'run-sequence'
  ]
});

$.yargs = require('yargs').argv;
$.through = require('through2');
// $.yaml = require('js-yaml'); // yaml使わなくなったからあとで消す
$.fs = require('fs');
$._ = require('lodash');

// var blogConf = $.yaml.safeLoad($.fs.readFileSync('blog-conf.yml', 'utf8'));
var blogConf = $.fs.readFileSync('./blog-conf.json', 'utf8');

// config
var config = {
  src: './src/',
  dist: './htdocs/',
  browserSupport: ['last 3 versions', 'ie >= 8'],
  proxy: 'localhost:7002'
};


// 記事作成タスク ====================

// ブログオブジェクト作成（*.md -> blog.json）
gulp.task('build:json', function(cb) {
  return gulp.src('./src/post/**/*.md')
    //mdをまとめて読み込む奴
    .pipe($.util.buffer())
    .pipe($.markdownToJson('blog.json'))
    //mdからjsonを作り、それぞれの記事データに対して処理をする
    .pipe($.through.obj(function (file, enc, cb) {
      //バッファから文字列に変化してJSONを作成する
      var result = {};
      var json = JSON.parse(String(file.contents));
      //デフォルトの設定を継承させる
      $._.each(json, function(data, filename){
        json[filename] = $._.assign({}, blogConf, data);
      });
      result['post'] = json
      //バッファに戻す
      file.contents = new Buffer(JSON.stringify(result));
      cb(null, file);
    }))
    //jsonを配置する
    .pipe(gulp.dest('.'))
});

// 全記事作成（post_id.md -> post_id.html）
gulp.task('post', function() {
  return gulp.src(config.src + 'post/1.md')
    .pipe($.frontMatter())
    .pipe($.markdown())
    .pipe($.layout(function(file) {
      var data_pre = $._.assign({}, blogConf, file.frontMatter);
      var data = $._.assign({}, neighborConf, data_pre);
      return data;
    }))
    .pipe($.htmlPrettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest(config.dist + 'archives/'));
});


// サイト開発タスク ====================

// server & browser sync
gulp.task('server', function() {
  $.browserSync({
    baseDir: config.dist,
    proxy: config.proxy
  });
});

// jade
gulp.task('jade', function () {
  gulp.src([config.src + 'jade/**/*.jade', '!' + config.src + 'jade/**/_*.jade'])
    .pipe($.plumber())
    .pipe($.data(function(file) {
      // console.log($.frontMatter(String(file.contents)))
      return require('./blog-conf.json');
    }))
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.dist))
});

// imagemin:img
gulp.task('imagemin:img', function() {
  return gulp.src(config.src + 'img/**/*')
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe($.browserSync.stream());
});

// imagemin:svg
gulp.task('imagemin:svg', function() {
  return gulp.src(config.src + 'svg/**/*')
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe($.browserSync.stream());
});

// sass
gulp.task('sass', function() {
  return gulp.src(config.src + 'scss/style.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: config.browserSupport
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist + 'css'))
    .pipe($.browserSync.stream());
});

// copy:font
gulp.task('copy:font', function() {
  return gulp.src(config.src + 'font/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest(config.dist + 'font'))
    .pipe($.browserSync.stream());
});

// copy:misc
gulp.task('copy:misc', function() {
  return gulp.src(config.src + 'misc/**/*')
    .pipe($.plumber())
    .pipe(gulp.dest(config.dist + 'misc'))
    .pipe($.browserSync.stream());
});

// watch
gulp.task('watch', function() {
  $.watch([config.src + 'jade/**/*.jade'], function(e) {
    gulp.start(['jade']);
  });

  $.watch([config.src + 'scss/**/*.scss'], function(e) {
    gulp.start(['sass']);
  });
});

// build
// - only compile
gulp.task('build', function() {
  $.runSequence('jade', 'sass', 'imagemin:img', 'imagemin:svg', 'copy:font', 'copy:misc');
});

// default
//  - local development task
gulp.task('default', function() {
  $.runSequence(['build'], ['server'], ['watch']);
});
