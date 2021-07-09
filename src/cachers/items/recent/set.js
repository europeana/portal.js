const { CACHE_KEY, createAxiosClient } = require('./utils');
const { createRedisClient, errorMessage } = require('../../utils');
const dateFormat = require('dateformat');

let axiosClient;
let redisClient;
let randomSortSeed;

const writeToRedis = (data) => {
  return redisClient.setAsync(CACHE_KEY, JSON.stringify(data))
    .then(() => redisClient.quitAsync())
    .then(() => ({
      body: `Wrote ${Object.keys(data).length} items to Redis "${CACHE_KEY}".`
    }));
};

const recentlyUpdatedContentTier4Dataset = async(exclude = []) => {
  const query = (exclude.length === 0) ? '*:*' : 'NOT edm_datasetName:(' + exclude.map(e => `"${e}"`).join(' OR ') + ')';
  const response = await axiosClient.get('/search.json', {
    params: {
      profile: 'standard',
      query,
      qf: 'contentTier:4',
      rows: 1,
      sort: 'timestamp_update+desc'
    }
  });
  return response.data.items[0].edmDatasetName;
};

const recentlyUpdatedContentTier4ItemFromDataset = async(dataset) => {
  const query = `edm_datasetName:"${dataset}"`;
  const response = await axiosClient.get('/search.json', {
    params: {
      profile: 'minimal',
      query,
      qf: 'contentTier:4',
      rows: 1,
      sort: `timestamp_update+desc,random_${randomSortSeed}+asc`
    }
  });
  return response.data.items[0];
};

const recentlyUpdatedContentTier4Items = async() => {
  const datasets = [];
  const items = [];

  while (items.length < 4) {
    const dataset = await recentlyUpdatedContentTier4Dataset(datasets);
    datasets.push(dataset);

    const item = await recentlyUpdatedContentTier4ItemFromDataset(dataset);
    items.push(item);
  }

  return items;
};

const main = async(config = {}, args) => {
  try {
    axiosClient = createAxiosClient(config);
    redisClient = createRedisClient(config);
    randomSortSeed = args[0] || dateFormat(new Date(), 'isoDate');

    const data = await recentlyUpdatedContentTier4Items();

    return writeToRedis(data);
  } catch (error) {
    return Promise.reject({ body: errorMessage(error) });
  }
};

module.exports = main;
