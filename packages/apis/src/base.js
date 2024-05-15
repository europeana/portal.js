import axios from 'axios';
import qs from 'qs';

import { keycloakResponseErrorHandler } from './utils/auth.js';
import EuropeanaApiContextConfig from './config/context.js';

export default class EuropeanaApi {
  static ID;
  // whether an API key is needed
  static AUTHENTICATING = false;
  // whether authorisation via Keycloak is used
  static AUTHORISING = false;
  static BASE_URL = 'https://api.europeana.eu/';
  #axios;

  constructor(context) {
    this.context = context;
    this.config = new EuropeanaApiContextConfig(this.constructor.ID, context);
  }

  get axios() {
    if (!this.#axios) {
      this.#axios = this.createAxios();
    }
    return this.#axios;
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

  createAxios() {
    const axiosBase = (this.constructor.AUTHORISING && this.context?.$axios) ? this.context?.$axios : axios;
    const axiosInstance = axiosBase.create(this.axiosInstanceOptions);

    axiosInstance.interceptors.request.use(this.rewriteAxiosRequestUrl.bind(this));

    const app = this.context?.app;
    if (app?.$axiosLogger) {
      axiosInstance.interceptors.request.use(app.$axiosLogger);
    }

    if (this.constructor.AUTHORISING && (typeof axiosInstance.onResponseError === 'function')) {
      axiosInstance.onResponseError(error => keycloakResponseErrorHandler(this.context, error));
    }

    return axiosInstance;
  }

  request(config) {
    return this.axios.request(config)
      .then((response) => response.data)
      .catch((error) => {
        throw this.apiError(error);
      });
  }

  rewriteAxiosRequestUrl(requestConfig) {
    if (this.config.urlRewrite) {
      requestConfig.baseURL = this.config.urlRewrite;
    }
    return requestConfig;
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
      timeout: 10000
    };
  }
}
