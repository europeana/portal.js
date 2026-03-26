import { Readable } from 'stream';

const APIS = [
  'annotation',
  'entity',
  'recommend',
  'record',
  'set'
];

const createProxy = (api) => {
  const baseUrl = process.env[`EUROPEANA_${api.toUpperCase()}_API_URL_PRIVATE`] ||
    process.env[`EUROPEANA_${api.toUpperCase()}_API_URL`] ||
    `https://api.europeana.eu/${api}`;

  const apiKey = process.env[`EUROPEANA_${api.toUpperCase()}_API_KEY`] || process.env.EUROPEANA_API_KEY;

  return (req, res, next) => {
    return fetch(`${baseUrl}${req.url}`, {
      headers: {
        'X-API-Key': apiKey,
        'User-Agent': 'Europeana.eu (https://www.europeana.eu)'
      }
    })
      .then((response) => {
        Readable.fromWeb(response.body)
          .pipe(res)
          .on('error', next);
      }, next);
  };
};

export default (app) => {
  for (const api of APIS) {
    app.use(`/${api}`, createProxy(api));
  }
};
