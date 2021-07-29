import sinon from 'sinon';
import nock from 'nock';

const cacher = require('@/cachers/entities/organisations');
const utils = require('@/cachers/utils');

let redisClientStub;

const apiResponse = {
  pageOne: {
    items: [{
      id: 'http://data.europeana.eu/organization/1',
      type: 'Organization',
      identifier: ['1'],
      prefLabel: {
        en: 'One'
      }
    }]
  },
  pageTwo: {
    items: [{
      id: 'http://data.europeana.eu/organization/2',
      type: 'Organization',
      identifier: ['2'],
      prefLabel: {
        en: 'Two'
      }
    }]
  },
  pageThree: {}
};

const cacheValue = JSON.stringify(
  {
    '1': {
      prefLabel: {
        en: 'One'
      }
    },
    '2': {
      prefLabel: {
        en: 'Two'
      }
    }
  }
);

const config = {
  europeana: {
    apis: {
      entity: {
        url: 'https://api.example.org/entity',
        key: 'entityApiKey'
      }
    }
  },
  redis: {
    url: 'redis://localhost:6370/0'
  }
};

describe('cachers/entities/organisations', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.page === '0')
      .reply(200, apiResponse.pageOne);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.page === '1')
      .reply(200, apiResponse.pageTwo);
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.page === '2')
      .reply(200, apiResponse.pageThree);

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

    it('paginates over organisations', async() => {
      await cacher.cache(config);

      nock.isDone().should.be.true;
    });

    it('writes reduced organisations to cache', async() => {
      await cacher.cache(config);

      redisClientStub.setAsync.should.have.been.calledWith(cacher.CACHE_KEY, cacheValue);
    });

    it('quits the Redis connection', async() => {
      await cacher.cache(config);

      redisClientStub.quitAsync.should.have.been.called;
    });
  });
});
