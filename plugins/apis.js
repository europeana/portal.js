import annotation from './europeana/annotation';
import entity from './europeana/entity';
import record from './europeana/record';
import recommendation from './europeana/recommendation';
import set from './europeana/set';

import { apiUrlFromRequestHeaders } from './europeana/utils';

const STORE_MODULE_NAME = 'apis';

const storeModule = {
  namespaced: true,

  state: () => ({
    urls: {
      annotation: null,
      entity: null,
      record: null
    }
  }),

  mutations: {
    init(state, { req }) {
      for (const api in state.urls) {
        state.urls[api] = apiUrlFromRequestHeaders(api, req.headers);
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(STORE_MODULE_NAME, storeModule);

  const plugin = {
    annotation: annotation(context),
    entity: entity(context),
    recommendation: recommendation(context),
    record: record(context),
    set: set(context)
  };

  inject('apis', plugin);

  if (context.$auth.loggedIn) {
    context.store.dispatch('set/setLikes')
      .then(() => context.store.dispatch('set/fetchLikes'));
  }
};
