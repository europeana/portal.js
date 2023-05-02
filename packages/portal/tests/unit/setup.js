// Always use HTTP adapter to prevent XHR weirdness during testing
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
axios.defaults.adapter = httpAdapter;

import sinon from 'sinon';

import '@/plugins/vue-filters';

if (!global.localStorage) {
  global.localStorage = {
    getItem: () => sinon.spy(),
    setItem: () => sinon.spy()
  };
} else {
  sinon.spy(global.localStorage, 'getItem');
  sinon.spy(global.localStorage, 'setItem');
}

if (!global.navigator) {
  global.navigator = {};
}
if (!global.navigator.clipboard) {
  global.navigator.clipboard = {
    writeText: sinon.spy()
  };
} else {
  sinon.spy(global.navigator, 'clipboard');
}

// Allow using client-only in component tests.
// https://dev.to/alousilva/how-to-mock-nuxt-client-only-component-with-jest-47da
import { config } from '@vue/test-utils';
import clientOnlyMock from './clientOnlyMock';

// Mock Nuxt client-side component
config.stubs['client-only'] = clientOnlyMock;
