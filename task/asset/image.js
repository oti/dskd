import gulp from "gulp";
import browserSync from "browser-sync";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";

export const image = () =>
  gulp
    .src("./src/image/**/*.{gif,jpg,png,svg}")
    .pipe(changed("./dist/img"))
    .pipe(gulp.dest("./dist/img"))
    .pipe(
      imagemin(
        [
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [
              {
                name: "removeViewBox",
                active: false,
              },
              {
                name: "cleanupIDs",
                active: true,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(browserSync.stream());
