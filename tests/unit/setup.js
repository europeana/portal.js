// Always use HTTP adapter to prevent XHR weirdness during testing
const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

const sinon = require('sinon');

import '@/plugins/vue-filters';

global.localStorage = {
  getItem: () => sinon.spy(),
  setItem: () => sinon.spy()
};
