// Always use HTTP adapter to prevent XHR weirdness during testing
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;

import sinon from 'sinon';

import '@/plugins/vue-filters';

global.localStorage = {
  getItem: () => sinon.spy(),
  setItem: () => sinon.spy()
};
