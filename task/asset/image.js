import gulp from "gulp";
import browserSync from "browser-sync";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";

export const image = () =>
  gulp
    .src("./src/image/**/*.{gif,jpg,png,svg}")
    .pipe(changed("./dist/img"))
    .pipe(gulp.dest("./dist/img"))
    .pipe(
      imagemin(
        [
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 3 }),
          svgo({
            plugins: [
              { name: "removeViewBox", active: false },
              { name: "cleanupIDs", active: true },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(browserSync.stream());
