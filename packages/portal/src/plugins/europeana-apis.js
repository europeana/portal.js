// TODO: refactor to not be a plugin, to reduce the weight of pages not using
//       it, e.g. the homepage? consider composables, e.g. `useEuropeanaRecordAPI()`

import kebabCase from 'lodash/kebabCase.js';
import { keycloakResponseErrorHandler } from '../auth/keycloak.js';

import {
  EuropeanaAnnotationApi,
  EuropeanaApiEnvConfig,
  EuropeanaDataApi,
  EuropeanaEntityApi,
  EuropeanaEntityManagementApi,
  EuropeanaFulltextApi,
  EuropeanaIiifPresentationApi,
  EuropeanaMediaProxyApi,
  EuropeanaRecommendationApi,
  EuropeanaRecordApi,
  EuropeanaSetApi,
  EuropeanaThumbnailApi
} from '@europeana/apis';

const apis = [
  EuropeanaAnnotationApi,
  EuropeanaDataApi,
  EuropeanaEntityApi,
  EuropeanaEntityManagementApi,
  EuropeanaFulltextApi,
  EuropeanaIiifPresentationApi,
  EuropeanaMediaProxyApi,
  EuropeanaRecommendationApi,
  EuropeanaRecordApi,
  EuropeanaSetApi,
  EuropeanaThumbnailApi
];

const MODULE_NAME = 'apis';

const API_IDS = apis.map((api) => api.ID);

const apiUrlFromRequestHeaders = (headers, id) => headers?.[`x-europeana-${kebabCase(id)}-api-url`];

export const storeModule = {
  namespaced: true,

  state: () => ({
    reqHeaderUrls: {}
  }),

  mutations: {
    init(state, { req }) {
      for (const id of API_IDS) {
        state.reqHeaderUrls[id] = apiUrlFromRequestHeaders(req?.headers, id);
      }
    }
  }
};

const rewriteBaseURLToPrivate = (api) => {
  const envConfig = new EuropeanaApiEnvConfig(api.ID);
  const urlPrivate = process.server && envConfig.env('urlPrivate');

  return (requestConfig) => {
    if (urlPrivate) {
      requestConfig.baseURL = urlPrivate;
    }
    return requestConfig;
  };
};

const contextualApi = (context, api) => {
  const apiConfig = {};
  const urlFromContext = apiUrlFromRequestHeaders(context.req?.headers, api.ID) ||
    context.store?.state?.apis?.reqHeaderUrls?.[api.ID];
  if (urlFromContext) {
    apiConfig.url = urlFromContext;
  }
  const apiInstance = new api(apiConfig);

  if (api.AUTHORISING && context.$axios) {
    // Use Nuxt axios module for its auth handling
    apiInstance.createAxios(context.$axios);
    apiInstance.axios.onResponseError((error) => keycloakResponseErrorHandler(context, error));
  }

  apiInstance.axios.interceptors.request.use(rewriteBaseURLToPrivate(api));

  // NOTE: keep this AFTER the private URL interceptor, so that the private URLs
  //       are not logged
  apiInstance.axios.interceptors.request.use(context.app.$axiosLogger);

  return apiInstance;
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = apis.reduce((memo, api) => {
    memo[api.ID] = contextualApi(context, api);
    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
