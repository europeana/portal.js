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

// Allow using client-only in component tests.
// https://dev.to/alousilva/how-to-mock-nuxt-client-only-component-with-jest-47da
import { config } from '@vue/test-utils';
import clientOnlyMock from './clientOnlyMock';

// Mock Nuxt client-side component
config.stubs['client-only'] = clientOnlyMock;
