const PICK = ['title', 'id', 'description', 'items'];
const LOCALISE = ['title', 'description'];

import { createEuropeanaApiClient } from '../utils.js';
let axiosClient;

const recentlyPublishedSets = async(lang) => {
  const params = {
    query: 'visibility:published',
    pageSize: 4,
    profile: 'itemDescriptions',
    qf: `lang:${lang}`
  };
  const response = await axiosClient.get('/search.json', { params });
  return response.data.items || [];
};

const data = async(config = {}, localeCodes = []) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.set);

  const recentlyPublishedSetsPerLocale = {};
  for (const locale of localeCodes) {
    recentlyPublishedSetsPerLocale[locale] = await recentlyPublishedSets(locale);
  }
  return recentlyPublishedSetsPerLocale;
};

export {
  data,
  LOCALISE,
  PICK
};
