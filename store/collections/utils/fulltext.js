import { BASE_URL as FULLTEXT_BASE_URL } from '../../../plugins/europeana/newspaper';

export default (defaultApi = 'fulltext') => ({
  state: () => ({
    apiOptions: {},
    apiParams: {}
  }),

  getters: {
    apiOptions: (state, getters) => {
      const options = Object.assign({}, state.apiOptions);

      if (getters.apiParams.api === 'fulltext') options.url = FULLTEXT_BASE_URL;

      return options;
    },

    apiParams: (state) => {
      const params = Object.assign({}, state.apiParams);

      // Set default API (of fulltext or metadata), from state
      if (!params.api) params.api = defaultApi;

      if (params.api === 'fulltext') {
        // TODO: fulltext search API should be aware of contentTier, but is not.
        //       If & when it is, this can be removed.
        params.qf = ([].concat(params.qf)).filter(qf => !/^contentTier:/.test(qf));
        params.qf.push('contentTier:*');

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
