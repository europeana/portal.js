const PICK = ['title', 'id', 'description', 'items'];

const LOCALISE = false;

import { createEuropeanaApiClient } from '../utils.js';

let axiosClient;

const recentlyPublishedSets = async() => {
  const params = {
    query: 'visibility:published',
    pageSize: 4,
    profile: 'itemDescriptions'
  };
  const response = await axiosClient.get('/search.json', { params });
  return response.data.items;
};

const data = (config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.set);

  return recentlyPublishedSets();
};

export {
  data,
  LOCALISE,
  PICK
};
