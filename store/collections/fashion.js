import { defaultFacetNames } from '../search';

const fashionFacetNames = ['CREATOR'].concat(defaultFacetNames);
const fashionFacetParam = fashionFacetNames.join(',');

export const state = () => ({
  apiParams: {},
  enabled: false,
  facets: []
});

export const getters = {
  apiParams: (state) => {
    const params = Object.assign({}, state.apiParams);
    params.facet = fashionFacetParam;
    return params;
  },
  facets: (state) => {
    return state.facets;
  }
};

export const mutations = {
  enable(state) {
    state.enabled = true;
  },
  filter(state, payload) {
    const facets = payload[1];

    facets.forEach((facet, index) => {
      facets[index] = facet;
      if (facet.name === 'CREATOR') {
        facets[index]['fields'] = facets[index].fields.filter(creator => creator.label.indexOf('(Designer)') !== -1);
      }
    });

    state[payload[0]] = facets;
  },
  set(state, payload) {
    state[payload[0]] = payload[1];
  }
};
