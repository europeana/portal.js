import { apiUrlFromRequestHeaders } from './utils.js';

const MODULE_NAME = 'apis';

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      entityManagement: null,
      recommendation: null,
      record: null,
      set: null,
      thumbnail: null
    }
  }),

  mutations: {
    init(state, { req }) {
      for (const api in state.urls) {
        const apiBaseURL = apiUrlFromRequestHeaders(api, req.headers);

        if (apiBaseURL && this.$apis?.[api]?.$axios) {
          this.$apis[api].$axios.defaults.baseURL = apiBaseURL;
        }
        state.urls[api] = apiBaseURL;
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(MODULE_NAME, storeModule);

  const plugin = {
    annotation: annotation.default(context),
    entity: entity.default(context),
    entityManagement: entityManagement.default(context),
    recommendation: recommendation.default(context),
    record: record.default(context),
    set: set.default(context),
    thumbnail: thumbnail.default(context)
  };

  inject(MODULE_NAME, plugin);
};
