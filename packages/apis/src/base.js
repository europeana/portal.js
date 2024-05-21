import axios from 'axios';
import qs from 'qs';

import EuropeanaApiEnvConfig from './config/env.js';

export default class EuropeanaApi {
  static ID;
  // whether an API key is needed
  static AUTHENTICATING = false;
  // whether authorisation via Keycloak is used
  static AUTHORISING = false;
  static BASE_URL = 'https://api.europeana.eu/';
  #axios;

  constructor(config = {}) {
    this.config = {
      ...(new EuropeanaApiEnvConfig(this.constructor.ID)),
      ...config
    };
  }

  get axios() {
    return this.#axios || this.createAxios();
  }

  get baseURL() {
    return this.config.url || this.constructor.BASE_URL;
  }

  get key() {
    return this.config.key;
  }

  // TODO: should this be a new class extending Error?
  apiError(error) {
    error.isEuropeanaApiError = true;
    error.statusCode = 500;

    if (error.isAxiosError) {
      if (error.response) {
        error.statusCode = error.response.status;
        if (error.response.headers?.['content-type']?.startsWith('application/json') && error.response.data?.error) {
          error.message = error.response.data.error;
        }
      }
      // Too much information to pass around, dispose of it
      delete error.response;
      delete error.config;
      delete error.request;
      delete error.toJSON;
    }

    return error;
  }

  createAxios(axiosBase = axios) {
    this.#axios = axiosBase.create(this.axiosInstanceOptions);
    return this.#axios;
  }

  request(config) {
    return this.axios.request(config)
      .then((response) => response.data)
      .catch((error) => {
        throw this.apiError(error);
      });
  }

  get axiosInstanceOptions() {
    const params = {};
    if (this.constructor.AUTHENTICATING) {
      params.wskey = this.key;
    }

    return {
      baseURL: this.baseURL,
      params,
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      // TODO: make env-configurable
      timeout: 10000
    };
  }
}
