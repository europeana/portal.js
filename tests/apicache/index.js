require('dotenv').config();

const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const morgan = require('morgan');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors());
app.use(morgan('combined'));

// TODO: consider using Redis, then having Travis cache the db.
//       would need a way to have it clear the cache. by an env var set in Travis
//       causing a docker volume for the redis db to be recreated?
const cache = apicache.options({
  // debug: true
}).middleware;

app.get('/', (req, res) => {
  res.type('text/plain');
  res.send('OK');
});

// TODO: handle newspapers API too. As a separate server? Or wait til it is
//       available via API gateway at /newspaper or similar.
// TODO: handle Contentful too?
app.use(
  ['/api/v2', '/entity', '/record'],
  cache(process.env.CACHE_DURATION || '1 day'),
  proxy({
    target: 'https://api.europeana.eu/',
    changeOrigin: true
  })
);

const server = app.listen(process.env.APICACHE_PORT || 4000, () => {
  console.log('Listening on port ' + server.address().port);
});
