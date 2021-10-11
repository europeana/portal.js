import sinon from 'sinon';
import nock from 'nock';

const cacher = require('@/cachers/items/type-counts');
const utils = require('@/cachers/utils');

let redisClientStub;

const apiResponse = {
  facets: [{
    name: 'TYPE',
    fields: [
      { label: 'IMAGE', count: 36839700 },
      { label: 'TEXT', count: 23626784 },
      { label: 'VIDEO', count: 1111932 },
      { label: 'SOUND', count: 849936 },
      { label: '3D', count: 24104 }
    ]
  }]
};

const cacheValue = JSON.stringify([
  { label: 'IMAGE', count: 36839700 },
  { label: 'TEXT', count: 23626784 },
  { label: 'VIDEO', count: 1111932 },
  { label: 'SOUND', count: 849936 },
  { label: '3D', count: 24104 }
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

describe('cachers/items/type-counts', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.record.url)
      .get('/search.json')
      .query(query => (
        query.profile === 'facets' && query.query === '*:*' && query.facet === 'TYPE' && query.qf === 'contentTier:1 OR contentTier:2 OR contentTier:3 OR contentTier:4' && query.rows === '0'
      ))
      .reply(200, apiResponse);

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

    it('queries Record API for facets', async() => {
      await cacher.cache(config);

      nock.isDone().should.be.true;
    });

    it('writes count metadata to cache', async() => {
      await cacher.cache(config);

      redisClientStub.setAsync.should.have.been.calledWith(cacher.CACHE_KEY, cacheValue);
    });

    it('quits the Redis connection', async() => {
      await cacher.cache(config);

      redisClientStub.quitAsync.should.have.been.called;
    });
  });
});
