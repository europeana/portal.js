const path = require('path');

process.env['PORT'] = '3001';
process.env['NODE_ENV'] = 'test';
process.env['DISABLE_SSL_NEGOTIATION'] = '1';

if (Number(process.env.E2E_TEST_APICACHE)) {
  const apicacheOrigin = 'http://localhost:3002';

  const rc = {
    defaults: {
      annotation: {
        origin: apicacheOrigin
      },
      entity: {
        origin: apicacheOrigin
      },
      record: {
        origin: apicacheOrigin
      },
      thumbnail: {
        origin: apicacheOrigin
      }
    }
  };

  process.env['EUROPEANA_APIS'] = JSON.stringify(rc);
  process.env['CTF_GRAPHQL_ORIGIN'] = apicacheOrigin;
}

require(path.resolve(__dirname, '../../../../server/index.js'));
