import sinon from 'sinon';
import nock from 'nock';

const cacher = require('@/cachers/entities/times');
const utils = require('@/cachers/utils');

let redisClientStub;

const apiResponse = {
  pageOne: {
    items: [{
      id: 'http://data.europeana.eu/timespan/1',
      type: 'timespan',
      identifier: ['1'],
      prefLabel: {
        en: '1st century'
      },
      isShownBy: 'http://www.example.eu'
    },
    {
      id: 'http://data.europeana.eu/timespan/2',
      type: 'timespan',
      identifier: ['2'],
      prefLabel: {
        en: '10th century'
      },
      isShownBy: 'http://www.example.eu'
    },
    {
      id: 'http://data.europeana.eu/timespan/3',
      type: 'timespan',
      identifier: ['3'],
      prefLabel: {
        en: '2nd century'
      },
      isShownBy: 'http://www.example.eu'
    }]
  }
};

const cacheValue = JSON.stringify(
  [{ id: 'http://data.europeana.eu/timespan/1',
    prefLabel: {
      en: '1st century'
    },
    isShownBy: 'http://www.example.eu' },
  { id: 'http://data.europeana.eu/timespan/3',
    prefLabel: {
      en: '2nd century'
    },
    isShownBy: 'http://www.example.eu' },
  { id: 'http://data.europeana.eu/timespan/2',
    prefLabel: {
      en: '10th century'
    },
    isShownBy: 'http://www.example.eu' }]
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

describe('cachers/entities/times', () => {
  beforeEach('stub utility methods', () => {
    nock(config.europeana.apis.entity.url)
      .get('/search')
      .query(query => query.page === '0')
      .reply(200, apiResponse.pageOne);

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

    it('writes chronologically sorted centuries to cache', async() => {
      await cacher.cache(config);

      redisClientStub.setAsync.should.have.been.calledWith(cacher.CACHE_KEY, cacheValue);
    });

    it('quits the Redis connection', async() => {
      await cacher.cache(config);

      redisClientStub.quitAsync.should.have.been.called;
    });
  });
});
