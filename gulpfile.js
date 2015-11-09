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

// config
var config = {
  src: './src/',
  dist: './htdocs/',
  browserSupport: ['last 3 versions', 'ie >= 8'],
  proxy: 'localhost:7002'
};

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
