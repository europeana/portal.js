const path = require('path');

const apicacheOrigin = 'http://localhost:3002';

const rc = {
  'http://localhost:3001': {
    record: {
      origin: apicacheOrigin
    },
    entity: {
      origin: apicacheOrigin
    },
    annotation: {
      origin: apicacheOrigin
    }
  }
};

process.env['PORT'] = '3001';
process.env['NODE_ENV'] = 'test';
process.env['EUROPEANA_APIS'] = JSON.stringify(rc);
process.env['CTF_GRAPHQL_ORIGIN'] = apicacheOrigin;

require(path.resolve(__dirname, '../../../../server/index.js'));
