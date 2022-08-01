import { createEuropeanaApiClient, getLabelledSlug } from '../utils.js';

let axiosClient;

const pageSize = 100;

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

const sortResults = results => results.sort((a, b) =>
  a.prefLabel.en?.localeCompare(b.prefLabel?.en, undefined, {
    numeric: true,
    sensitivity: 'base'
  }));

export default (params = {}, config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  return allEntityResults(params)
    .then(entities => sortResults(entities));
};
