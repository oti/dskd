import { init } from "browser-sync";

// server & browser sync
export const server = (done) =>
  init(
    {
      ui: false,
      server: {
        baseDir: "./dist/",
      },
    },
    done
  );
