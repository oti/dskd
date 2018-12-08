const browserSync = require('browser-sync')

// server & browser sync
const server = (done) => {
  browserSync.init({
    ui: false,
    server: {
      baseDir: './htdocs/',
      proxy: 'localhost:3000'
    }
  }, done)
}

module.exports = server
