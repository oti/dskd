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

const reload = () => {
  browserSync.reload()
}

module.exports = {
  init: init,
  reload: reload
}
