'use strict';

// load plugins
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
  browserSupport: ['last 3 versions', 'ie >= 8']
};

// server & browser sync
gulp.task('bs', function() {
  $.browserSync({
    baseDir: config.dist
  });
});

// jade
gulp.task('jade', function () {
  gulp.src([config.src + 'jade/**/*.jade', '!' + config.src + 'jade/**/_*.jade'])
    .pipe($.plumber())
    .pipe($.data(function(file) {
      return require('./blog-conf.json');
    }))
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(config.dist))
});

// imagemin
gulp.task('imagemin', function() {
  return gulp.src(config.src + 'img/**/*')
    .pipe($.plumber())
    .pipe($.imagemin())
    .pipe(gulp.dest(config.dist + 'img'))
    .pipe($.browserSync.stream());
});

// sass
gulp.task('sass', function() {
  return gulp.src(config.src + 'sass/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: config.browserSupport
    }))
    .pipe($.cssmin())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.htdocs + 'css'))
    .pipe($.browserSync.stream());
});

// watch
gulp.task('watch', function() {
  $.watch([config.src + 'jade/**/*.jade'], function(e) {
    gulp.start(['jade']);
  });

  $.watch([config.src + 'sass/**/*.scss'], function(e) {
    gulp.start(['sass']);
  });
});

// build
// - only compile
gulp.task('build', function() {
  $.runSequence('jade', 'sass', 'imagemin', 'copy');
});

// default
//  - local development task
gulp.task('default', function() {
  $.runSequence(['build'], ['watch']);
});
