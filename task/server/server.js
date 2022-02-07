import browserSync from "browser-sync";

// server & browser sync
export const server = (done) =>
  browserSync.init(
    {
      ui: false,
      server: {
        baseDir: "./dist/",
      },
    },
    done
  );
