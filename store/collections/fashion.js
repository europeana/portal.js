import { defaultFacetNames } from '../search';

const fashionFacetNames = ['CREATOR'].concat(defaultFacetNames);
const fashionFacetParam = fashionFacetNames.join(',');

export const state = () => ({
  baseParams: {},
  enabled: false
});

export const getters = {
  apiParams: (state) => {
    const params = Object.assign({}, state.baseParams);
    params.facet = fashionFacetParam;
    return params;
  }
};

export const mutations = {
  enable(state) {
    state.enabled = true;
  },
  setBaseParams(state, value) {
    state.baseParams = value;
  }
};
