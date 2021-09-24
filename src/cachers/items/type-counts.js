import * as utils from '../utils.js';

const CACHE_KEY = '@europeana:portal.js:items:type-counts';

let axiosClient;
let redisClient;


const facetsForMediaTypes = async() => {
  const query = '*:*';
  const params = {
    profile: 'facets',
    query,
    facet: 'TYPE',
    qf: 'contentTier:1 OR contentTier:2 OR contentTier:3 OR  contentTier:4',
    rows: 0
  };
  const response = await axiosClient.get('/search.json', { params });
  return response.data?.facets?.[0]?.fields || [];
};

const cache = async(config = {}) => {
  try {
    axiosClient = utils.createEuropeanaApiClient(config.europeana?.apis?.record);
    redisClient = utils.createRedisClient(config.redis);

    const data = await facetsForMediaTypes();

    return utils.writeToRedis(redisClient, CACHE_KEY, data);
  } catch (error) {
    return Promise.reject(utils.errorMessage(error));
  }
};

export {
  cache,
  CACHE_KEY
};
