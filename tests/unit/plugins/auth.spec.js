import defu from 'defu';
import nock from 'nock';

import auth from '../../../plugins/auth';
import { BASE_URL } from '../../../plugins/europeana/set';
import sinon from 'sinon';

const axios = require('axios');

const createAxiosInstance = axiosOptions => {
  const myaxios = axios.create(axiosOptions);

  myaxios.create = function(options) {
    return createAxiosInstance(defu(options, this.defaults));
  };
  myaxios.onRequest = function(fn) {
    this.interceptors.request.use(config => fn(config) || config);
  };
  myaxios.onRequestError = function(fn) {
    this.interceptors.request.use(undefined, error => fn(error) || Promise.reject(error));
  };
  myaxios.onError = function(fn) {
    this.onRequestError(fn);
    this.onResponseError(fn);
  };
  myaxios.onResponseError = function(fn) {
    this.interceptors.response.use(undefined, error => fn(error) || Promise.reject(error));
  };
  return myaxios;
};

let mockContext = {
  $auth: {
    loggedIn: true,
    getToken() {
      return 'keycloak-mocked-token';
    },
    ctx: {
      app: {
        $axios: createAxiosInstance({ headers: { Authorization: 'keycloak-mocked-token' } })
      }
    },
    options: {
      redirect: {
        login: 'http://redirect.url.for.login'
      }
    }
  },
  store: {
    dispatch: sinon.stub().resolves({})
  }
};

const mockInject = (key, method) => {
  mockContext['$' + key] = method;
};

describe('auth plugin', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  context('there is a user logged in', () => {
    it('puts the keycloak token in requests ', async() => {
      auth(mockContext, mockInject);
      nock(BASE_URL)
        .matchHeader('Authorization', 'keycloak-mocked-token')
        .post('/')
        .reply(200, {
          id: 1234
        });
      await mockContext.$sets.createLikes();
      nock.isDone().should.be.true;
    });
  });
});
