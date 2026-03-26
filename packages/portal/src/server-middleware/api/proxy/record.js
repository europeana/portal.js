// Proxies requests to the Record API, adding the API key

import { createProxyMiddleware as createHttpProxyMiddleware } from 'http-proxy-middleware';

export default createHttpProxyMiddleware({
  target: process.env.EUROPEANA_RECORD_API_URL_PRIVATE || 'https://api.europeana.eu/record',
  changeOrigin: true,
  headers: {
    'X-API-Key': process.env.EUROPEANA_API_KEY
  }
});
