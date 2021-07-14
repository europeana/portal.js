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

describe('cachers/entities/organisations', () => {
  beforeEach('stub utility methods', () => {
    nock('https://api.europeana.eu')
      .get('/entity/search')
      .query(query => query.page === '0')
      .reply(200, apiResponse.pageOne);
    nock('https://api.europeana.eu')
      .get('/entity/search')
      .query(query => query.page === '1')
      .reply(200, apiResponse.pageTwo);
    nock('https://api.europeana.eu')
      .get('/entity/search')
      .query(query => query.page === '2')
      .reply(200, apiResponse.pageThree);

    redisClientStub = {
      getAsync: sinon.stub().resolves(cacheValue),
      setAsync: sinon.stub().resolves(),
      quitAsync: sinon.stub().resolves()
    };
    sinon.stub(utils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach('restore utility methods', () => {
    utils.createRedisClient.restore();
    nock.cleanAll();
  });

  describe('.get', () => {
    it('creates a redis client from params', () => {
      const params = {
        redisUrl: 'redis://localhost:6370/0'
      };

      cacher.get(params);

      utils.createRedisClient.should.have.been.calledWith(params);
    });

    it('fetches organisations from the cache', () => {
      cacher.get();

      redisClientStub.getAsync.should.have.been.calledWith(cacher.CACHE_KEY);
    });

    it('quits the Redis connection', async() => {
      await cacher.get();

      redisClientStub.quitAsync.should.have.been.called;
    });

    it('resolves to object with parsed cache value in body', async() => {
      const response = await cacher.get();

      response.should.eql({ body: JSON.parse(cacheValue) });
    });
  });

  describe('.set', () => {
    it('creates a redis client from params', () => {
      const params = {
        redisUrl: 'redis://localhost:6370/0'
      };

      cacher.set(params);

      utils.createRedisClient.should.have.been.calledWith(params);
    });

    it('paginates over organisations', async() => {
      await cacher.set();

      nock.isDone().should.be.true;
    });

    it('writes reduced organisations to cache', async() => {
      await cacher.set();

      redisClientStub.setAsync.should.have.been.calledWith(cacher.CACHE_KEY, cacheValue);
    });

    it('quits the Redis connection', async() => {
      await cacher.set();

      redisClientStub.quitAsync.should.have.been.called;
    });
  });
});
