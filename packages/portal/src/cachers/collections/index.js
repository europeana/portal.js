import { createEuropeanaApiClient } from '../utils.js';
import { getLabelledSlug } from '../../plugins/europeana/utils.js';

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

const pageOfEntityResults = (page, params = {}) => {
  return axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.config,
      query: '*:*',
      scope: 'europeana',
      sort: 'id',
      page,
      pageSize,
      ...params
    }
  })
    .then(response => response.data.items || [])
    .then(items => items.map(entityWithSlug));
};

const entityWithSlug = (entity) => ({
  ...entity,
  slug: getLabelledSlug(entity.id, entity.prefLabel?.en)
});

const allEntityResults = async(params) => {
  let allResults = [];
  let page = 0; // Yes, the Entity API pagination starts at page 0. ¯\_(ツ)_/¯
  let pageOfResults;

  // the API allows 100 entities per request. Loop until all entities are retrieved.
  while (!Array.isArray(pageOfResults) || pageOfResults.length > 0) {
    pageOfResults = await pageOfEntityResults(page, params);
    allResults = allResults.concat(pageOfResults);
    page = page + 1;
  }

  return allResults;
};

export default (params = {}, config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  return allEntityResults(params);
};
