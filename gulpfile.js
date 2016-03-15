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
var bsServer       = browserSync.create()

// configs
var devConfig  = require('./devconfig.json', 'utf8');

// server & browser sync
gulp.task('server', function() {
  bsServer.init({
    server: {
      baseDir: devConfig.dist,
      proxy: devConfig.proxy
    }
  });
});

// imagemin:img
gulp.task('imagemin:img', function() {
  return gulp.src(devConfig.src + 'img/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(devConfig.dist + 'img'))
});

// imagemin:svg
gulp.task('imagemin:svg', function() {
  return gulp.src(devConfig.src + 'svg/**/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(devConfig.dist + 'img'))
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
});

// copy:font
gulp.task('copy:font', function() {
  return gulp.src(devConfig.src + 'font/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(devConfig.dist + 'font'))
});

// copy:misc
gulp.task('copy:misc', function() {
  return gulp.src(devConfig.src + 'misc/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(devConfig.dist + 'misc'))
});

// watch
gulp.task('watch', function() {
  watch([devConfig.src + 'scss/**/*.scss'], function(e) {
    gulp.start(['sass', bsServer.reload()]);
  });
});


// build
// - only compile
gulp.task('build', function(callback) {
  runSequence(['sass', 'imagemin:img', 'imagemin:svg', 'copy:font', 'copy:misc'], callback);
});

// default
//  - local development task
gulp.task('default', function(callback) {
  runSequence(['build', 'server', 'watch'], callback);
});
