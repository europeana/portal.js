import { defaultFacetNames } from '../search';

const fashionFacetNames = ['CREATOR', 'proxy_dc_format.en', 'proxy_dcterms_medium.en', 'proxy_dc_type.en'].concat(defaultFacetNames);
const fashionFacetParam = fashionFacetNames.join(',');

export const state = () => ({
  apiParams: {},
  enabled: false
});

export const getters = {
  apiParams: (state) => {
    const params = Object.assign({}, state.apiParams);
    params.facet = fashionFacetParam;
    return params;
  }
};

export const mutations = {
  enable(state) {
    state.enabled = true;
  },
  set(state, payload) {
    state[payload[0]] = payload[1];
  }
};
