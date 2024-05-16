// TODO: refactor to not be a plugin, to reduce the weight of pages not using
//       it, e.g. the homepage? consider composables, e.g. `useEuropeanaRecordAPI()`

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

const runtimeConfig = {};

export const resetRuntimeConfig = ({ scope = 'public' }) => {
  delete runtimeConfig[scope];
};

export const nuxtRuntimeConfig = ({ scope = 'public' } = {}) => {
  if (!runtimeConfig[scope]) {
    runtimeConfig[scope] = API_IDS.reduce((memo, id) => {
      memo[id] = new EuropeanaApiEnvConfig(id, scope);
      return memo;
    }, {});
  }
  return runtimeConfig[scope];
};

export const storeModule = {
  namespaced: true,

  state: () => ({
    reqHeaderUrls: {}
  }),

  mutations: {
    init(state, { $apis, req }) {
      for (const id of API_IDS) {
        state.reqHeaderUrls[id] = $apis?.[id]?.config?.apiUrlFromRequestHeaders?.(req?.headers);
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = apis.reduce((memo, api) => {
    memo[api.ID] = new api(context);
    return memo;
  }, {});

  inject(MODULE_NAME, plugin);
};
