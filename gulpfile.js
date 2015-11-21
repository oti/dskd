'use strict';

// load plugins ====================
var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var autoprefixer   = require('gulp-autoprefixer');
var imagemin       = require('gulp-imagemin');
var plumber        = require('gulp-plumber');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var watch          = require('gulp-watch');

// configs
var devConfig  = require('./devconfig.json', 'utf8');

// server & browser sync
gulp.task('server', function() {
  browserSync({
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
  watch([devConfig.src + 'scss/**/*.scss'], function(e) {
    gulp.start(['sass']);
  });
});


// build
// - only compile
gulp.task('build', function(callback) {
  runSequence(['jade', 'sass', 'imagemin:img', 'imagemin:svg', 'copy:font', 'copy:misc'], callback);
});

// default
//  - local development task
gulp.task('default', function(callback) {
  runSequence(['build', 'server', 'watch'], callback);
});
