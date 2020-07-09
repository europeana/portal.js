const rc = {
  '/annotation/': 'https://api.europeana.eu',
  '/api/v2/thumbnail-by-url.json': 'https://api.europeana.eu',
  '/entity/': 'https://api.europeana.eu',
  '/record/': 'https://api.europeana.eu',
  '/content/v1/spaces/': 'https://graphql.contentful.com'
};
process.env['PORT'] = '3002';
process.env['PROXY_RC'] = JSON.stringify(rc);
process.env['CACHE_DURATION'] = '1 hour';
process.env['DISABLE_LOGGING'] = '1';

require('@europeana/api-proxy-cache/index.js');
