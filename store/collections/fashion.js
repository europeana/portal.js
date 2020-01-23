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
  }
};

export const mutations = {
  enable(state) {
    state.enabled = true;
  },
  filterFacets(state, facets) {
    facets.forEach((facet, index) => {
      if (facet.name === 'CREATOR') {
        facets[index]['fields'] = facets[index].fields.filter(creator => creator.label.endsWith('(Designer)'));
      }
    });

    state.facets = facets;
  },
  set(state, payload) {
    state[payload[0]] = payload[1];
  }
};
