import sinon from 'sinon';
import nock from 'nock';

const cacher = require('@/cachers/items/recent');
const utils = require('@/cachers/utils');

let redisClientStub;

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

const cacheValue = JSON.stringify([
  { id: 'item1' },
  { id: 'item2' },
  { id: 'item3' },
  { id: 'item4' }
]);

const config = {
  europeana: {
    apis: {
      record: {
        url: 'https://api.example.org/record',
        key: 'recordApiKey'
      }
    }
  },
  redis: {
    url: 'redis://localhost:6370/0'
  }
};

describe('cachers/items/recent', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === '*:*' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[0]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[1]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1" OR "dataset2")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[2]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'NOT edm_datasetName:("dataset1" OR "dataset2" OR "dataset3")' && query.sort === 'timestamp_update+desc' && query.qf === 'contentTier:4' && query.profile === 'standard'
      ))
      .reply(200, apiResponses.datasets[3]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset1"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[0]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset2"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[1]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset3"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[2]);

    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.query === 'edm_datasetName:"dataset4"' && query.qf === 'contentTier:4' && query.profile === 'minimal'
      ))
      .reply(200, apiResponses.items[3]);

    redisClientStub = {
      setAsync: sinon.stub().resolves(),
      quitAsync: sinon.stub().resolves()
    };
    sinon.stub(utils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach('restore utility methods', () => {
    utils.createRedisClient.restore();
    nock.cleanAll();
  });

  describe('.cache', () => {
    it('creates a redis client from config', async() => {
      await cacher.cache(config);

      utils.createRedisClient.should.have.been.calledWith(config.redis);
    });

    it('queries Record API for 4 items from recently updated content tier 4 datasets', async() => {
      await cacher.cache(config);

      nock.isDone().should.be.true;
    });

    it('writes item metadata to cache', async() => {
      await cacher.cache(config);

      redisClientStub.setAsync.should.have.been.calledWith(cacher.CACHE_KEY, cacheValue);
    });

    it('quits the Redis connection', async() => {
      await cacher.cache(config);

      redisClientStub.quitAsync.should.have.been.called;
    });
  });
});
