const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.use(require('sinon-chai'));
chai.should();
global.should = chai.should;

// Always use HTTP adapter to prevent XHR weirdness during testing
const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const sinon = require('sinon');

// FIXME: breaks running individual unit tests w/ e.g. `npm run test:unit tests/unit/some.spec.js`
// import('../../src/plugins/vue-filters');

global.localStorage = {
  getItem: () => sinon.spy(),
  setItem: () => sinon.spy()
};
