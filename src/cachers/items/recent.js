import dateFormat from 'dateformat';
import { createEuropeanaApiClient } from '../utils.js';

const CACHE_KEY = '@europeana:portal.js:items:recent';

let axiosClient;
let randomSortSeed;

const recentlyUpdatedContentTier4Dataset = async(exclude = []) => {
  let query = '*:*';
  if (exclude.length > 0) {
    const excludedDatasets = exclude.map(e => `"${e}"`).join(' OR ');
    query = `NOT edm_datasetName:(${excludedDatasets})`;
  }

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
  const params = {
    profile: 'minimal',
    query,
    qf: 'contentTier:4',
    rows: 1,
    sort: `timestamp_update+desc,random_${randomSortSeed}+asc`
  };
  const response = await axiosClient.get('/search.json', { params });
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

const data = (config = {}) => {
  axiosClient = createEuropeanaApiClient(config.europeana?.apis?.record);
  randomSortSeed = dateFormat(new Date(), 'isoDate');

  return recentlyUpdatedContentTier4Items();
};

export {
  data,
  CACHE_KEY
};
