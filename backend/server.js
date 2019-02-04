const app = require('./app')
const http = require('http')
const debug = require('debug')('node-angular')

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? `pipe ${port}` : `port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr}`
  debug(`Listening on ${bind}`)
}

// set port
const port = process.env.PORT || '3000'
app.set('port', port)

//start server
const server = http.createServer(app)
server.on('error', onError)
server.on('listening', onListening)
server.listen(port, () => console.log(`listening in port ${port}`))
