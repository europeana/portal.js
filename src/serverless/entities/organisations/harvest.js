const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

const errorMessage = (error) => {
  let message;
  if (error.response) {
    if (error.response.data.error) {
      message = error.response.data.error;
    } else {
      message = `${error.response.status} ${error.response.statusText}`;
    }
  } else {
    message = error.message;
  }
  return message;
};

const axiosConfig = (params = {}) => {
  return {
    id: 'entity',
    baseURL: params.europeanaEntityApiBaseUrl || 'https://api.europeana.eu/entity',
    params: {
      wskey: params.europeanaEntityApiKey
    }
  };
};

const redisConfig = (params = {}) => {
  const redisOptions = {};

  redisOptions.url = params.redisUrl;

  if (params.redisTlsCa) {
    redisOptions.tls = {
      ca: [Buffer.from(params.redisTlsCa, 'base64')]
    };
  }

  return redisOptions;
};

let axiosInstance;
let redisClient;

const pageSize = 100;

const getEntitySearchPage = page => {
  return axiosInstance.get('/search', {
    params: {
      ...axiosInstance.defaults.params,
      query: '*:*',
      type: 'organization',
      page,
      pageSize
    }
  })
    .then(response => response.data.items)
    .then(items => items ? items.map(persistableFields) : []);
};

const persistableFields = ({ identifier, prefLabel }) => {
  return {
    identifier,
    prefLabel
  };
};

const main = async(params = {}) => {
  try {
    axiosInstance = axios.create(axiosConfig(params));
    redisClient = redis.createClient(redisConfig(params));

    const redisSetAsync = promisify(redisClient.set).bind(redisClient);

    let allResults = [];
    let page = 0; // Yes, the Entity API pagination starts at page 0. ¯\_(ツ)_/¯
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

    const key = '/@europeana/portal.js/entity/organizations';
    return redisSetAsync(key, JSON.stringify(organisations, null, 2))
      .then(() => ({
        body: `Wrote ${Object.keys(organisations).length} organisations to Redis "${key}".`
      }));
  } catch (error) {
    return new Promise((resolve, reject) => reject({ body: errorMessage(error) }));
  }
};

const cli = () => {
  const params = {
    europeanaEntityApiBaseUrl: process.env.EUROPEANA_ENTITY_API_URL,
    europeanaEntityApiKey: process.env.EUROPEANA_ENTITY_API_KEY || process.env.EUROPEANA_API_KEY,
    redisUrl: process.env.REDIS_URL,
    redisTlsCa: process.env.REDIS_TLS_CA
  };

  return main(params);
};

module.exports = {
  cli,
  main
};
