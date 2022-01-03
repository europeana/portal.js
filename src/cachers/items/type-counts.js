const LOCALISE = false;
const PICK = false;

import { createEuropeanaApiClient } from '../utils.js';

let axiosClient;

const facetsForMediaTypes = async() => {
  const query = '*:*';
  const params = {
    profile: 'facets',
    query,
    facet: 'TYPE',
    qf: 'contentTier:(1 OR 2 OR 3 OR 4)',
    rows: 0
  };
  const response = await axiosClient.get('/search.json', { params });
  return response.data?.facets?.[0]?.fields || [];
};

const data = (config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.record);

  return facetsForMediaTypes();
};

export {
  data,
  LOCALISE,
  PICK
};
