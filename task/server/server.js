const browserSync = require('browser-sync')

// server & browser sync
const server = () => {
  browserSync.init({
    ui: false,
    server: {
      baseDir: './htdocs/',
      proxy: 'localhost:3000'
    }
  })
}

module.exports = server
