import nock from 'nock';

const cacher = require('@/cachers/items/recent');

const apiResponses = {
  datasets: [
    { items: [{ edmDatasetName: 'dataset1' }] },
    { items: [{ edmDatasetName: 'dataset2' }] },
    { items: [{ edmDatasetName: 'dataset3' }] },
    { items: [{ edmDatasetName: 'dataset4' }] }
  ],
  items: [
    { items: [{ id: 'item1' }] },
    { items: [{ id: 'item2' }] },
    { items: [{ id: 'item3' }] },
    { items: [{ id: 'item4' }] }
  ]
};

const dataToCache = [
  { id: 'item1' },
  { id: 'item2' },
  { id: 'item3' },
  { id: 'item4' }
];

describe('cachers/items/recent', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === '*:*' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[0]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[1]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1" OR "dataset2")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[2]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1" OR "dataset2" OR "dataset3")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[3]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset1"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[0]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset2"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[1]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset3"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[2]);

    nock('https://api.europeana.eu/record')
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset4"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[3]);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('.data', () => {
    it('queries Record API for 4 items from recently updated content tier 4 datasets', async() => {
      await cacher.data();

      expect(nock.isDone()).toBe(true);
    });

    it('returns item metadata to cache', async() => {
      const data = await cacher.data();

      expect(data).toEqual(dataToCache);
    });
  });
});
