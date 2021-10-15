import * as utils from '../utils.js';

let axiosClient;
let redisClient;

const pageSize = 100;

const pageOfEntityResults = (page, entityType) => {
  return axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.config,
      query: '*:*',
      type: entityType,
      scope: 'europeana',
      page,
      pageSize
    }
  })
    .then(response => response.data.items || [])
    .then(items => items.map(persistableFields));
};

const persistableFields = ({ id, prefLabel, isShownBy, logo }) => ({
  id,
  prefLabel,
  isShownBy,
  logo
});

const allEntityResults = async(entityType) => {
  let allResults = [];
  let page = 0; // Yes, the Entity API pagination starts at page 0. ¯\_(ツ)_/¯
  let pageOfResults;

  // the API allows 100 entities per request. Loop until all entities are retrieved.
  while (!Array.isArray(pageOfResults) || pageOfResults.length > 0) {
    pageOfResults = await pageOfEntityResults(page, entityType);
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

export default async(cacheKey, entityType, config = {}) => {
  try {
    axiosClient = utils.createEuropeanaApiClient(config.europeana?.apis?.entity);
    redisClient = utils.createRedisClient(config.redis);

    const entities = await allEntityResults(entityType);

    return utils.writeToRedis(redisClient, cacheKey, sortResults(entities));
  } catch (error) {
    return Promise.reject(utils.errorMessage(error));
  }
};
