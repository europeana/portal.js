import annotation from '../plugins/europeana/annotation';
import entity from '../plugins/europeana/entity';
// import mediaProxy from '../plugins/europeana/mediaProxy';
import record from '../plugins/europeana/record';
import { apiUrlFromRequestHeaders } from '../plugins/europeana/utils';

export const state = () => ({
  annotation: {},
  entity: {},
  // mediaProxy: mediaProxy(),
  record: {}
});

export const mutations = {
  init(state, context) {
    for (const api in state) {
      const defaults = {};
      const baseURL = apiUrlFromRequestHeaders(api, context.req.headers);
      if (baseURL) defaults.baseURL = baseURL;
      state[api] = defaults;
    }
  }
};

export const getters = {
  annotation(state) {
    return annotation(state.annotation);
  },
  entity(state) {
    return entity(state.entity);
  },
  record(state) {
    return record(state.record);
  }
};
