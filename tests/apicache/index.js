require('dotenv').config();

console.log('process.env.APICACHE_LOG', process.env.APICACHE_LOG);

const config = {
  duration: process.env.APICACHE_DURATION || '1 day',
  log: Number(process.env.APICACHE_LOG),
  port: process.env.APICACHE_PORT || 4000
};

const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors());
if (config.log) app.use(morgan('combined'));

// TODO: consider using Redis, then having Travis cache the db.
//       would need a way to have it clear the cache. by an env var set in Travis
//       causing a docker volume for the redis db to be recreated?
const cache = apicache.options({
  debug: config.log
}).middleware;

app.get('/', (req, res) => {
  res.type('text/plain');
  res.send('OK');
});

// TODO: handle Contentful too?
//       would need SSL, e.g. w/ package "greenlock"

// API gateway
app.use(
  ['/api/v2', '/entity', '/record'],
  cache(config.duration),
  proxy({
    target: 'https://api.europeana.eu/',
    changeOrigin: true
  })
);

// Newspaper API (not yet available via gateway)
app.use(
  ['/newspaper'],
  cache(config.duration),
  proxy({
    target: 'https://newspapers.eanadev.org',
    changeOrigin: true,
    pathRewrite: { '^/newspaper' : '' }
  })
);

const server = app.listen(config.port, () => {
  console.log('Listening on port ' + server.address().port);
});
