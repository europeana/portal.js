import defu from 'defu';
import nock from 'nock';

import authAxios from '../../../plugins/authAxios';
import config from '../../../modules/apis/defaults';
const apiUrl = `${config.set.origin}${config.set.path}`;

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');

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
    options: {
      redirect: {
        login: 'http://redirect.url.for.login'
      }
    }
  },
  $axios: createAxiosInstance({})
};

const mockInject = (key, method) => {
  mockContext['$' + key] = method;
};

describe('authAxios plugin', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  context('there is a user logged in', () => {
    it('puts the keycloak token in requests ',  async() => {
      authAxios(mockContext, mockInject);
      nock(apiUrl)
        .matchHeader('Authorization', 'keycloak-mocked-token')
        .post('/')
        .reply(200, {
          id: 1234
        });
      await mockContext.$sets.createLikes();
      nock.isDone().should.be.true;
    });
  }),

  context('there is no user logged in', () => {
    it('it redirects to login ',  async() => {
      mockContext.redirect = function(param) {
        mockContext.redirected = param;
      };
      mockContext.$auth.loggedIn = false;
      authAxios(mockContext, mockInject);
      nock(apiUrl)
        .post('/')
        .reply(200, {
          id: 1234
        });

      await mockContext.$sets.createLikes();
      mockContext.redirected.should.equal('http://redirect.url.for.login');
    });
  });
});

