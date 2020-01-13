const paths = require('./paths.json');
const axios = require('axios');
const isReachable = require('is-reachable');

const host = process.env.APICACHE_HOST || 'localhost';
const port = process.env.APICACHE_PORT || 4000;
const origin = `http://${host}:${port}`;
const maxWaitTime = 90;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function warmupCache() {
  console.log(`Waiting for API cache server ${origin}...`);
  let i = 0;
  while (!(await isReachable(origin)) && (i <= maxWaitTime)) {
    i++;
    await sleep(1000);
  }
  if (!(await isReachable(origin))) {
    throw `Unable to reach the API cache server within ${maxWaitTime} seconds!`;
  }

  for (const path of paths) {
    axios.get(`${origin}${path}`)
      .then(() => {
        // console.log(`${path} OK`);
      })
      .catch(() => {
        // Errors are to be expected for some requests
        // console.log(`${path} ERROR`, error.toString());
      });
  }
}

warmupCache();
