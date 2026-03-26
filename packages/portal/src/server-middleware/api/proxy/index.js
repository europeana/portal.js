import { Readable } from 'stream';

export const APIS = [
  'annotation',
  'entity',
  // FIXME: uses differently named env vars, w/ "RECOMMENDATION"
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
      method: req.method,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
      headers: {
        'content-type': req.headers['content-type'],
        'x-api-key': apiKey,
        'user-agent': 'Europeana.eu (https://www.europeana.eu)'
      }
    })
      .then((response) => {
        res.status(response.status);

        const forwardHeaders = new Headers(response.headers);
        forwardHeaders.delete('content-length');
        forwardHeaders.delete('content-encoding');
        res.setHeaders(forwardHeaders);

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
