require('dotenv').config();

const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors());
app.use(morgan('combined'));

const cache = apicache.options({
  // debug: true
}).middleware;

app.use(
  ['/api/v2', '/entity'],
  cache(process.env.CACHE_DURATION || '1 day'),
  proxy({
    target: 'https://api.europeana.eu/',
    changeOrigin: true
  })
);

const server = app.listen(process.env.APICACHE_PORT || 4000, () => {
  console.log('Listening on port ' + server.address().port);
});
