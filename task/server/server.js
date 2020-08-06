const browserSync = require("browser-sync");

// server & browser sync
const server = (done) => {
  browserSync.init(
    {
      ui: false,
      server: {
        baseDir: "./dist/",
        proxy: "localhost:3000",
      },
    },
    done
  );
};

module.exports = server;
