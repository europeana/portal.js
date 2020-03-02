require('dotenv').config();

const config = {
  duration: process.env.APICACHE_DURATION || '1 day',
  log: Number(process.env.APICACHE_LOG),
  port: process.env.PORT || 80
};

const apicache = require('apicache');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());
if (config.log) app.use(morgan('combined'));

const cache = apicache.options().middleware;

app.get('/', (req, res) => {
  res.type('text/plain');
  res.send('OK');
});

// API gateway
app.use(
  ['/api/v2', '/entity', '/record'],
  cache(config.duration),
  createProxyMiddleware({
    target: 'https://api.europeana.eu/',
    changeOrigin: true
  })
);

// Newspaper API (not yet available via gateway)
app.use(
  ['/newspaper'],
  cache(config.duration),
  createProxyMiddleware({
    target: 'https://newspapers.eanadev.org',
    changeOrigin: true,
    pathRewrite: { '^/newspaper' : '' }
  })
);

// Contentful Delivery API
app.use(
  '/contentful',
  cache(config.duration),
  createProxyMiddleware({
    target: 'https://cdn.contentful.com/',
    changeOrigin: true,
    pathRewrite: { '^/contentful' : '' }
  })
);

const server = app.listen(config.port, () => {
  console.log('Listening on port ' + server.address().port);
});
