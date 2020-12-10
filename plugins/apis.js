import annotation from './europeana/annotation';
import entity from './europeana/entity';
import recommendation from './europeana/recommendation';
import record from './europeana/record';
import set from './europeana/set';

import { apiUrlFromRequestHeaders } from './europeana/utils';

const MODULE_NAME = 'apis';

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      recommendation: null,
      record: null,
      set: null
    }
  }),

  mutations: {
    init(state, { req }) {
      for (const api in state.urls) {
        const apiBaseURL = apiUrlFromRequestHeaders(api, req.headers);

        if (apiBaseURL && this.$apis) this.$apis[api].$axios.defaults.baseURL = apiBaseURL;
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
    set: set(context)
  };

  inject(MODULE_NAME, plugin);

  if (context.$auth && context.$auth.loggedIn) {
    context.store.dispatch('set/setLikes')
      .then(() => context.store.dispatch('set/fetchLikes'));
  }
};
