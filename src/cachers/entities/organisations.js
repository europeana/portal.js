import * as utils from '../utils.js';

const CACHE_KEY = '@europeana:portal.js:entity:organizations';

let axiosClient;
let redisClient;

const pageSize = 100;

const pageOfOrganisationResults = page => {
  return axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.config,
      query: '*:*',
      type: 'organization',
      page,
      pageSize
    }
  })
    .then(response => response.data.items)
    .then(items => items ? items.map(persistableFields) : []);
};

const allOrganisationResults = async() => {
  let allResults = [];
  let page = 0; // Yes, the Entity API pagination starts at page 0. ¯\_(ツ)_/¯
  let pageOfResults;

  // the API allows 100 entities per request. Loop until all organisations are retrieved.
  while (!Array.isArray(pageOfResults) || pageOfResults.length > 0) {
    pageOfResults = await pageOfOrganisationResults(page);
    allResults = allResults.concat(pageOfResults);
    page = page + 1;
  }

  return allResults;
};

const organisationsObject = results => results
  .reduce((memo, { identifier, prefLabel }) => {
    memo[identifier[0]] = { prefLabel };
    return memo;
  }, {});

const persistableFields = ({ identifier, prefLabel }) => {
  return {
    identifier,
    prefLabel
  };
};

const cache = async(config = {}) => {
  try {
    axiosClient = utils.createEuropeanaApiClient(config.europeana?.apis?.entity);
    redisClient = utils.createRedisClient(config.redis);

    const allResults = await allOrganisationResults();
    const organisations = organisationsObject(allResults);

    return utils.writeToRedis(redisClient, CACHE_KEY, organisations);
  } catch (error) {
    return Promise.reject(utils.errorMessage(error));
  }
};

export {
  cache,
  CACHE_KEY
};
