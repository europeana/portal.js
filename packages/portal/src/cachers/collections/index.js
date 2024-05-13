import axios from 'axios';
import { createEuropeanaApiClient } from '../utils.js';
import { getLabelledSlug } from '@europeana/utils';

let axiosClient;

const pageSize = 100;

export const countEntities = async(params = {}, config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  const response = await axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.config,
      query: '*:*',
      scope: 'europeana',
      pageSize: 0,
      ...params
    }
  });
  return response.data?.partOf?.total;
};

const firstPageOfEntityResults = (params = {}) => axiosClient.get('/search', {
  params: {
    ...axiosClient.defaults.config,
    query: '*:*',
    scope: 'europeana',
    sort: 'id',
    pageSize,
    ...params
  }
});

const nextPageOfEntityResults = (url) => axios.get(url);

const entityWithSlug = (entity) => ({
  ...entity,
  slug: getLabelledSlug(entity.id, entity.prefLabel?.en)
});

const allEntityResults = async(params) => {
  let allResults = [];
  let pageOfResults;
  let next;

  // the API allows 100 entities per request. Loop until all entities are retrieved.
  while (!Array.isArray(pageOfResults) || next) {
    const response = await (next ? nextPageOfEntityResults(next) : firstPageOfEntityResults(params));
    pageOfResults = (response.data.items || []).map(entityWithSlug);
    allResults = allResults.concat(pageOfResults);
    next = response.data.next;
  }

  return allResults;
};

export default (params = {}, config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  return allEntityResults(params);
};
