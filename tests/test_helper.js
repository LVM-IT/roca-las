process.env.BACKEND_PORT = 5200

const Browser = require('zombie')

const backend = require('lasrest')
const app = require('..')

let backendServer
let appServer

exports.setup = (cb) => {
  backendServer = backend.listen(5200, () => {
    appServer = app.listen(8090, () => {
      const browser = new Browser({
        site: 'http://127.0.0.1:8090',
        runScripts: false
      })

      cb(browser)
    })
  })
}

exports.teardown = () => {
  backendServer.close()
  appServer.close()
}
