import express from 'express';
import next from 'next';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import url from 'url';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import setupAuth from './api/auth';
import setupApi from './api';
import enforceSSL from './common/enforce-ssl';

import {userQuery} from './api/queries';
import { User, Role, Account } from './api/models';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 8000;
const app = next({ dev, quiet: false });
const nextRequestHandler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  if (!dev) {
    server.use(compression());
  }
  server.use(enforceSSL());
  server.use('/static', express.static(__dirname + '/static'));
  server.use(cookieParser());
  server.use(morgan('dev'));
  server.use(cors({ credentials: true, origin: true }));
  server.use(bodyParser.json());
  server.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  setupAuth(server, passport);
  setupApi(server);

  server.get('*', async (req, res) => {
    return app.render(req, res, req.url);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`🚀 Running on localhost:${port}`);
  });
});
