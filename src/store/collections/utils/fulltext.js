import { BASE_URL as FULLTEXT_BASE_URL } from '../../../plugins/europeana/newspaper';

export default (defaultApi = 'fulltext') => ({
  state: () => ({
    apiOptions: {},
    apiParams: {}
  }),

  getters: {
    apiOptions: (state, getters) => {
      const options = Object.assign({}, state.apiOptions);

      if (getters.apiParams.api === 'fulltext') {
        options.url = FULLTEXT_BASE_URL;
      }

      return options;
    },

    apiParams: (state) => {
      const params = Object.assign({}, state.apiParams);

      // Set default API (of fulltext or metadata), from state
      if (!params.api) {
        params.api = defaultApi;
      }

      if (params.api === 'fulltext') {
        params.profile = 'minimal,hits';
      }

      return params;
    }
  },

  mutations: {
    set(state, payload) {
      state[payload[0]] = payload[1];
    }
  }
});
