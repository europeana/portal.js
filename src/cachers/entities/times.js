import * as utils from '../utils.js';

const CACHE_KEY = '@europeana:portal.js:entity:times';

let axiosClient;
let redisClient;

const allTimes = () => {
  return axiosClient.get('/search', {
    params: {
      ...axiosClient.defaults.config,
      query: '*:*',
      type: 'timespan',
      page: 0,
      pageSize: 100
    }
  })
    .then(response => response.data.items)
    .then(items => items ? items.map(item => {
      return { id: item.id,
        prefLabel: item.prefLabel,
        isShownBy: item.isShownBy };
    }
    ) : [])
    .then(items => items.sort((a, b) =>
      a.prefLabel.en.localeCompare(b.prefLabel.en, undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    )
    );
};

const writeToRedis = (data) => {
  return redisClient.setAsync(CACHE_KEY, JSON.stringify(data))
    .then(() => redisClient.quitAsync())
    .then(() => ({
      body: `Wrote ${Object.keys(data).length} times to Redis "${CACHE_KEY}".`
    }));
};

const cache = async(config = {}) => {
  try {
    axiosClient = utils.createEuropeanaApiClient(config.europeana.apis.entity);
    redisClient = utils.createRedisClient(config.redis);

    const times = await allTimes();

    return writeToRedis(times);
  } catch (error) {
    return Promise.reject({ body: utils.errorMessage(error) });
  }
};

export {
  cache,
  CACHE_KEY
};
