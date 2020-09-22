import baseConfig from '../plugins/europeana';
import { apiUrlFromRequestHeaders } from '../plugins/europeana/utils';

export const state = () => Object.assign({}, baseConfig);

export const mutations = {
  readUrlsFromRequestHeaders(state, headers) {
    for (const api in state) {
      state[api].url = apiUrlFromRequestHeaders(api, headers) || baseConfig[api].url;
    }
  }
};
