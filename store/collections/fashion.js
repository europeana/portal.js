import { defaultFacetNames } from '../search';

const fashionFacetNames = [
  'CREATOR', 'proxy_dc_format.en', 'proxy_dcterms_medium.en', 'proxy_dc_type.en'
].concat(defaultFacetNames);
const fashionFacetParam = fashionFacetNames.join(',');

const facetFieldFilters = {
  'CREATOR': (field) => field.label.endsWith(' (Designer)"'),
  'proxy_dc_type.en': (field) => field.label.startsWith('"Object Type: '),
  'proxy_dc_format.en': (field) => field.label.startsWith('"Technique: '),
  'proxy_dcterms_medium.en': (field) => field.label.startsWith('"Material: ')
};

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
    return state.facets.map((facet) => {
      return {
        name: facet.name,
        fields: facet.fields.filter(facetFieldFilters[facet.name] || (() => true))
      };
    });
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
