import express from 'express'
import next from 'next'
import http from 'http'
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

var timeout = require('express-timeout-handler')

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 8000
const app = next({ dev, quiet: false, api: { externalResolver: true } })
const nextRequestHandler = app.getRequestHandler()

var options = {
  // Optional. This will be the default timeout for all endpoints.
  // If omitted there is no default timeout on endpoints
  timeout: 300000,

  // Optional. This function will be called on a timeout and it MUST
  // terminate the request.
  // If omitted the module will end the request with a default 503 error.
  onTimeout: function (req, res) {
    res.status(503).send('Service unavailable. Please retry.')
  },

  // Optional. Define a function to be called if an attempt to send a response
  // happens after the timeout where:
  // - method: is the method that was called on the response object
  // - args: are the arguments passed to the method
  // - requestTime: is the duration of the request
  // timeout happened
  onDelayedResponse: function (req, method, args, requestTime) {
    console.log(`Attempted to call ${method} after timeout`)
  },

  // Optional. Provide a list of which methods should be disabled on the
  // response object when a timeout happens and an error has been sent. If
  // omitted, a default list of all methods that tries to send a response
  // will be disable on the response object
  //disable: ['write', 'setHeaders', 'send', 'json', 'end'],
}

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    //server.use(timeout.handler(options))
    server.use(compression())
  }

  server.use(enforceSSL())
  server.use('/static', express.static(__dirname + '/static'))
  server.use(cookieParser())
  server.use(morgan('dev'))
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
    return app.render(req, res, req.url)
  })

  server.listen(port, (err) => {
    if (err) {
      throw err
    }

    console.log(`🚀 Running on localhost:${port}`)
  })
})
