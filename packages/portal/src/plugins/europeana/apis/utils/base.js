import axios from 'axios';
import qs from 'qs';

import { keycloakResponseErrorHandler } from '../../auth.js';
import EuropeanaApiContextConfig from '../config/context.js';

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

  get baseUrl() {
    return this.config.url || this.constructor.BASE_URL;
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

    const app = this.context?.app;
    if (app?.$axiosLogger) {
      axiosInstance.interceptors.request.use(app.$axiosLogger);
    }

    if (this.constructor.AUTHORISING && (typeof axiosInstance.onResponseError === 'function')) {
      axiosInstance.onResponseError(error => keycloakResponseErrorHandler(this.context, error));
    }

    return axiosInstance;
  }

  get axiosInstanceOptions() {
    const params = {};
    if (this.constructor.AUTHENTICATING) {
      params.wskey = this.config.key;
    }

    return {
      baseURL: this.baseUrl,
      params,
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      timeout: 10000
    };
  }
}
