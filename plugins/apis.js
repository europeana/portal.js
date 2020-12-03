import annotation from './europeana/annotation';
import entity from './europeana/entity';
import record from './europeana/record';
import { apiUrlFromRequestHeaders } from './europeana/utils';

const STORE_MODULE_NAME = 'apis';

let axiosLogger;

const storeModule = {
  namespaced: true,

  state: () => ({
    annotation: {},
    entity: {},
    record: {}
  }),

  mutations: {
    init(state, context) {
      for (const api in state) {
        const defaults = context.$config.europeana.apis[api] || {};
        const baseURL = apiUrlFromRequestHeaders(api, context.req.headers);
        if (baseURL) defaults.baseURL = baseURL;
        state[api] = defaults;
      }
    }
  },

  getters: {
    annotation(state, getters) {
      return getters.apiWithAxiosLogger(annotation(state.annotation));
    },
    entity(state, getters) {
      return getters.apiWithAxiosLogger(entity(state.entity));
    },
    record(state, getters) {
      return getters.apiWithAxiosLogger(record(state.record));
    },
    apiWithAxiosLogger: () => (api) => {
      if (axiosLogger) api.$axios.interceptors.request.use(axiosLogger);
      return api;
    }
  }
};

export default ({ store, app }) => {
  store.registerModule(STORE_MODULE_NAME, storeModule);

  if (app.$axiosLogger) axiosLogger = app.$axiosLogger;
};
