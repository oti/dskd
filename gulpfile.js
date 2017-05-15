'use strict';

// load plugins ====================
var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var autoprefixer   = require('gulp-autoprefixer');
var imagemin       = require('gulp-imagemin');
var plumber        = require('gulp-plumber');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var runSequence    = require('run-sequence');
var watch          = require('gulp-watch');
var cmq            = require('gulp-merge-media-queries');

// server & browser sync
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: './htdocs/',
      proxy: 'localhost:3000'
    }
  });
});

// browser sync reload
gulp.task('reload', function(){
  browserSync.reload();
});

// imagemin:img
gulp.task('image', function() {
  return gulp.src('./src/img/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./htdocs/img/'))
    .pipe(browserSync.stream());
});

// imagemin:svg
gulp.task('svg', function() {
  return gulp.src('./src/svg/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./htdocs/img/'))
});

// sass
gulp.task('css', function() {
  return gulp.src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ["last 2 versions", "ie >= 10", "iOS >= 9", "Android >= 4.4"]
    }))
    .pipe(cmq())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./htdocs/css/'))
    .pipe(browserSync.stream());
});

// copy:font
gulp.task('copy:font', function() {
  return gulp.src('./src/font/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./htdocs/font/'))
    .pipe(browserSync.stream());
});

// copy:misc
gulp.task('copy:misc', function() {
  return gulp.src('./src/misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('./htdocs/misc/'))
    .pipe(browserSync.stream());
});

// watch
gulp.task('watch', function() {
  watch(['./src/scss/**/*'], function(e) {
    gulp.start(['css']);
  });

  watch(['./src/img/**/*'], function(e) {
    gulp.start(['image']);
  });

  watch(['./src/svg/**/*'], function(e) {
    gulp.start(['svg']);
  });
});


// build
// - only compile
gulp.task('build', function(callback) {
  runSequence(['css', 'image', 'svg', 'copy:font', 'copy:misc'], callback);
});

// default
//  - local development task
gulp.task('default', function(callback) {
  runSequence(['build', 'server', 'watch'], callback);
});
