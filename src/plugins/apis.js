import annotation from './europeana/annotation.js';
import entity from './europeana/entity.js';
import recommendation from './europeana/recommendation.js';
import record from './europeana/record.js';
import set from './europeana/set.js';
import entityManagement from './europeana/entity-management.js';
import thumbnail from './europeana/thumbnail.js';

import { apiUrlFromRequestHeaders } from './europeana/utils.js';

const MODULE_NAME = 'apis';

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      recommendation: null,
      record: null,
      set: null,
      entityManagement: null,
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
    annotation: annotation(context),
    entity: entity(context),
    recommendation: recommendation(context),
    record: record(context),
    set: set(context),
    entityManagement: entityManagement(context),
    thumbnail: thumbnail(context)
  };

  inject(MODULE_NAME, plugin);

  if (context.$auth && context.$auth.loggedIn) {
    context.store.dispatch('set/setLikes')
      .then(() => context.store.dispatch('set/fetchLikes'));
  }
};
