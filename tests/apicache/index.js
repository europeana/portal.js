require('dotenv').config();

const config = {
  duration: process.env.APICACHE_DURATION || '1 day',
  log: Number(process.env.APICACHE_LOG),
  port: process.env.APICACHE_PORT || 4000,
  redisUrl: process.env.APICACHE_REDIS_URL,
  contentfulCdaAccessToken: process.env.CTF_CDA_ACCESS_TOKEN
};

const apicache = require('apicache');
const cors = require('cors');
const express = require('express');
// const fs = require('fs');
const morgan = require('morgan');
// const path = require('path');
const proxy = require('http-proxy-middleware');
const redis = require('redis');
// const http2 = require('http2');

const app = express();

app.use(cors());
if (config.log) app.use(morgan('combined'));

const apicacheOptions = {};

// Use Redis cache if configured in env
//
// To create one in Docker with persistent storage:
//   docker volume create portal.js-test-apicache-redis-data
//   docker run -d -p=16379:6379 --name=portal.js-test-apicache-redis \
//     --mount source=portal.js-test-apicache-redis-data,target=/data \
//     redis redis-server --appendonly yes
if (config.redisUrl) {
  const redisOptions = {
    url: config.redisUrl
  };
  apicacheOptions.redisClient = redis.createClient(redisOptions);
}

const cache = apicache.options(apicacheOptions).middleware;

app.get('/', (req, res) => {
  res.type('text/plain');
  res.send('OK');
});

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

// Contentful Delivery API
app.use(
  '/contentful',
  cache(config.duration),
  proxy({
    target: 'https://cdn.contentful.com/',
    changeOrigin: true,
    // FIXME: why must we add this when it's in the source request?
    headers: { authorization: `Bearer ${config.contentfulCdaAccessToken}` },
    pathRewrite: { '^/contentful' : '' }
  })
);

// const sslOptions = {
//   key: fs.readFileSync(path.resolve(__dirname, '../../tmp/ssl.key')),
//   cert: fs.readFileSync(path.resolve(__dirname, '../../tmp/ssl.crt'))
// };

const server = app.listen(config.port, () => {
  console.log('Listening on port ' + server.address().port);
});
