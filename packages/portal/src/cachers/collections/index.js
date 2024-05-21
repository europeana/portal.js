import axios from 'axios';
import { EuropeanaEntityApi } from '@europeana/apis';
import { getLabelledSlug } from '@europeana/utils';

let europeanaEntityApi;

const pageSize = 100;

export const countEntities = async(params = {}) => {
  europeanaEntityApi = new EuropeanaEntityApi;

  const response = await europeanaEntityApi.search({
    query: '*:*',
    scope: 'europeana',
    pageSize: 0,
    ...params
  });
  return response.partOf?.total;
};

const firstPageOfEntityResults = (params = {}) => europeanaEntityApi.search({
  query: '*:*',
  scope: 'europeana',
  sort: 'id',
  pageSize,
  ...params
});

const nextPageOfEntityResults = async(url) => {
  const response = await axios.get(url);
  return response.data;
};

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
    pageOfResults = (response.items || []).map(entityWithSlug);
    allResults = allResults.concat(pageOfResults);
    next = response.next;
  }

  return allResults;
};

export default (params = {}) => {
  europeanaEntityApi = new EuropeanaEntityApi;

  return allEntityResults(params);
};
