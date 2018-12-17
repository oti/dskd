const browserSync = require('browser-sync')

// server & browser sync
const init = (done) => {
  browserSync.init({
    ui: false,
    server: {
      baseDir: './htdocs/',
      proxy: 'localhost:3000'
    }
  }, done)
}

module.exports = init
