const axios = require('axios');
const redis = require('redis');

const BASE_URL = process.env.EUROPEANA_ENTITY_API_URL || 'https://api.europeana.eu/entity';
const EUROPEANA_API_KEY = process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY;

const axiosConfig = {
  id: 'entity',
  baseURL: BASE_URL,
  params: {
    wskey: EUROPEANA_API_KEY
  }
};

const redisConfig = () => {
  const redisOptions = {};

  if (process.env.REDIS_URL) {
    redisOptions.url = process.env.REDIS_URL;

    // is tls cert required?
    if (process.env.REDIS_TLS_CA) {
      redisOptions.tls = {
        ca: [Buffer.from(process.env.REDIS_TLS_CA, 'base64')]
      };
    }
  }
  // FIXME: else what?

  return redisOptions;
};

const $axios = axios.create(axiosConfig);
const client = redis.createClient(redisConfig());
const pageSize = 100;

const getEntitySearchPage = page => {
  return $axios.get('/search', {
    params: {
      ...$axios.defaults.params,
      query: '*:*',
      type: 'organization',
      page,
      pageSize
    }
  })
    .then(response => response.data.items)
    .then(items => {
      return items ? items.map(persistableFields) : [];
    })
    .catch((error) => {
      const message = error.response ? error.response.data.error : error.message;
      throw new Error(message);
    });
};

const persistableFields = ({ identifier, prefLabel }) => {
  return {
    identifier,
    prefLabel
  };
};

const main = async() => {
  let allResults = [];
  let page = 31;
  let pageOfResults;

  // the API allows 100 entities per request. Loop until all organisations are retrieved.
  while (!Array.isArray(pageOfResults) || pageOfResults.length > 0) {
    console.log(`Page ${page}`);
    pageOfResults = await getEntitySearchPage(page);
    allResults = allResults.concat(pageOfResults);
    page = page + 1;
  }

  const organisations = allResults.reduce((memo, { identifier, prefLabel }) => {
    memo[identifier[0]] = { prefLabel };
    return memo;
  }, {});

  const key = '/entity/organizations';
  console.log(`Writing ${Object.keys(organisations).length} organisations to Redis @ ${key}`);
  // client.hmset('organisations', organisations.map((org) => {
  //   return stringifyOrganisation(org);
  // }));
  // client.set('organisations', stringifyOrganisation(organisations));
  client.set(key, JSON.stringify(organisations, null, 2));
};

module.exports = {
  main
};
