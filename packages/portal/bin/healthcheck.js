// Healthcheck for web app, used by Docker image with distroless nodejs base
// image which does not have (or want) curl/wget/etc installed.

import http from 'http';

const options = {
  host: process.env.HEALTHCHECK_HOST || 'localhost',
  path: process.env.HEALTHCHECK_PATH || '/_api/version',
  port: process.env.HEALTHCHECK_PORT || process.env.PORT || 3000,
  timeout: process.env.HEALTHCHECK_TIMEOUT || 1000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', (err) => {
  console.error('ERROR', err.message);
  process.exit(1);
});

request.end();
