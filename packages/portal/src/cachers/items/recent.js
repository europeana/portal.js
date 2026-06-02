import dateFormat from 'dateformat';

import EuropeanaRecordApi from '../../plugins/europeana/record.js';

const PICK = ['dataProvider', 'dcCreatorLangAware', 'dcTitleLangAware', 'edmPreview', 'id'];
// TODO: We can't let the cacher localise in advance because the item preview card
// expects to handle it. Consider refactoring that automated card group to
// use generic content card directly?
// const LOCALISE = ['dcCreatorLangAware', 'dcTitleLangAware'];
const LOCALISE = false;

const data = (context = {}) => {
  const api = context.$apis?.record || new EuropeanaRecordApi(context);

  const randomSortSeed = dateFormat(new Date(), 'isoDate');

  const recentlyUpdatedContentTier4Dataset = async(exclude = []) => {
    let query = '*:*';
    if (exclude.length > 0) {
      const excludedDatasets = exclude.map(e => `"${e}"`).join(' OR ');
      query = `NOT edm_datasetName:(${excludedDatasets})`;
    }

    const response = await api.search({
      profile: 'standard',
      query,
      qf: 'contentTier:4',
      rows: 1,
      sort: 'timestamp_update+desc'
    }
    );

    return response.items?.[0]?.edmDatasetName;
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
    const response = await api.search(params);
    return response.items[0];
  };

  const recentlyUpdatedContentTier4Items = async() => {
    const datasets = [];
    const items = [];
    let moreDatasets = true;

    while (moreDatasets && (items.length < 4)) {
      const dataset = await recentlyUpdatedContentTier4Dataset(datasets);
      if (dataset) {
        datasets.push(dataset);

        const item = await recentlyUpdatedContentTier4ItemFromDataset(dataset);
        items.push(item);
      } else {
        moreDatasets = false;
      }
    }

    return items;
  };

  return recentlyUpdatedContentTier4Items();
};

export {
  data,
  LOCALISE,
  PICK
};
