import annotation from './europeana/annotation';
import entity from './europeana/entity';
import record from './europeana/record';
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
    init(state, context) {
      for (const api in state.urls) {
        state.urls[api] = apiUrlFromRequestHeaders(api, context.req.headers);
      }
    }
  }
};

export default (context, inject) => {
  context.store.registerModule(STORE_MODULE_NAME, storeModule);

  const plugin = {
    annotation: annotation(context),
    entity: entity(context),
    record: record(context)
  };

  inject('apis', plugin);
};
