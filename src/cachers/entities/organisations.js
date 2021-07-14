const axios = require('axios');
const utils = require('../utils');

const CACHE_KEY = '@europeana:portal.js:entity:organizations';

const axiosConfig = (params = {}) => {
  return {
    baseURL: params.europeanaEntityApiBaseUrl || 'https://api.europeana.eu/entity',
    params: {
      wskey: params.europeanaEntityApiKey
    }
  };
};

const createAxiosClient = (params = {}) => axios.create(axiosConfig(params));

let axiosClient;
let redisClient;

const pageSize = 100;

const pageOfOrganisationResults = page => {
  return axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.params,
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

const writeToRedis = (organisations) => {
  return redisClient.setAsync(CACHE_KEY, JSON.stringify(organisations))
    .then(() => redisClient.quitAsync())
    .then(() => ({
      body: `Wrote ${Object.keys(organisations).length} organisations to Redis "${CACHE_KEY}".`
    }));
};

const set = async(params = {}) => {
  try {
    axiosClient = createAxiosClient(params);
    redisClient = utils.createRedisClient(params);

    const allResults = await allOrganisationResults();
    const organisations = organisationsObject(allResults);

    return writeToRedis(organisations);
  } catch (error) {
    return Promise.reject({ body: utils.errorMessage(error) });
  }
};

const get = (params = {}) => {
  try {
    redisClient = utils.createRedisClient(params);
    return redisClient.getAsync(CACHE_KEY)
      .then(organisations => redisClient.quitAsync()
        .then(() => ({ body: JSON.parse(organisations) || {} })));
  } catch (error) {
    return Promise.reject({ statusCode: 500, body: utils.errorMessage(error) });
  }
};

function cli(command) {
  const params = {
    europeanaEntityApiBaseUrl: process.env.EUROPEANA_ENTITY_API_URL,
    europeanaEntityApiKey: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY,
    redisUrl: process.env.REDIS_URL,
    redisTlsCa: process.env.REDIS_TLS_CA
  };

  return this[command](params);
}

module.exports = {
  CACHE_KEY,
  cli,
  get,
  set
};
