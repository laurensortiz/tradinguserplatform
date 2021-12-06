import express from 'express'
import next from 'next'
import { createServer } from 'http'
import cors from 'cors'
import morgan from 'morgan'
import url from 'url'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import setupAuth from './api/auth'
import setupApi from './api'
import enforceSSL from './common/enforce-ssl'

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 8000
const app = next({ dev, quiet: false, api: { externalResolver: true } })
const nextRequestHandler = app.getRequestHandler()

import { Server as wsServer } from 'socket.io'

app.prepare().then(() => {
  const server = express()
  const ioServer = createServer(server)

  const io = new wsServer(ioServer)
  if (!dev) {
    server.use(compression())
  }

  server.use(enforceSSL())
  server.use('/static', express.static(__dirname + '/static'))
  server.use(cookieParser())
  server.use(
    morgan('tiny', {
      skip: function (req, res) {
        return res.statusCode < 400
      },
    })
  )
  server.use(cors({ credentials: true, origin: true }))
  server.use(bodyParser.json({ limit: '50mb', extended: true }))
  server.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '50mb',
    })
  )

  setupAuth(server, passport)
  setupApi(server)

  server.get('*', async (req, res) => {
    return nextRequestHandler(req, res, req.url)
  })

  server.listen(port, (err) => {
    if (err) {
      throw err
    }

    console.log(`🚀 Running on localhost:${port}`)
  })

  io.on('connection', (socket) => {
    /* socket object may be used to send specific messages to the new connected client */

    console.log('new client connected')
  })
})
