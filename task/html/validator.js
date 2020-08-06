const gulp = require("gulp");
const plumber = require("gulp-plumber");
const htmlValidator = require("gulp-w3c-html-validator");

const validator = () => {
  return gulp
    .src("dist/**/*.html")
    .pipe(plumber())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
};

module.exports = validator;
