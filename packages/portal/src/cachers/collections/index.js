import { createEuropeanaApiClient } from '../utils.js';
import { getLabelledSlug } from '../../plugins/europeana/utils.js';

let entityApiClient;
let recordApiClient;

const pageSize = 100;

export const countEntities = async(params = {}, config = {}) => {
  entityApiClient = createEuropeanaApiClient(config.europeana?.apis?.entity);

  const response = await entityApiClient.get('/search', {
    params: {
      ...entityApiClient.defaults.config,
      query: '*:*',
      scope: 'europeana',
      pageSize: 0,
      ...params
    }
  });
  return response.data?.partOf?.total;
};

const pageOfEntityResults = (page, params = {}) => {
  return entityApiClient.get('/search', {
    params: {
      ...entityApiClient.defaults.config,
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

const getRecordCounts = async(recordLinkField) => {
  const params = {
    profile: 'facets',
    query: `${recordLinkField}:*data.europeana.eu*`,
    facet: recordLinkField,
    [`f.${recordLinkField}.facet.limit`]: 10000,
    rows: 0
  };
  const response = await recordApiClient.get('/search.json', { params });
  return response.data?.facets?.[0]?.fields || [];
};

const withRecordCounts = async(entities, recordLinkField) => {
  const recordCounts = await getRecordCounts(recordLinkField);

  for (const entity of entities) {
    // Add recordCount
    const entityId = entity.id;
    const entityWithCount = recordCounts.find(facet => facet.label === entityId);
    const recordCount = entityWithCount?.count || 0;
    entity.recordCount = recordCount;
  }

  return entities;
};

export default async(params = {}, config = {}, options = {}) => {
  entityApiClient = createEuropeanaApiClient(config.europeana?.apis?.entity);
  recordApiClient = createEuropeanaApiClient(config.europeana?.apis?.record);

  let results = await allEntityResults(params);
  if (options.recordCounts) {
    results = await withRecordCounts(results, options.recordCounts);
  }
  return results;
};
