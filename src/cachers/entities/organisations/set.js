const { CACHE_KEY, createAxiosClient } = require('./utils');
const { createRedisClient, errorMessage } = require('../../utils');

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

const main = async(config = {}) => {
  try {
    axiosClient = createAxiosClient(config);
    redisClient = createRedisClient(config);

    const allResults = await allOrganisationResults();
    const organisations = organisationsObject(allResults);

    return writeToRedis(organisations);
  } catch (error) {
    return Promise.reject({ body: errorMessage(error) });
  }
};

module.exports = main;
