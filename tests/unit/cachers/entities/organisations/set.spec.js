import sinon from 'sinon';

const cacheUtils = require('@/cachers/utils');
const utils = require('@/cachers/entities/organisations/utils');
const cacher = require('@/cachers/entities/organisations/set');

let axiosClientStub;
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

describe('cachers/entities/organisations/set', () => {
  const config = {
    europeana: {
      apis: {
        entity: {
          key: 'MY_KEY'
        }
      }
    },
    redis: {
      url: 'redis://localhost:6370/0'
    }
  };

  beforeEach('stub utility methods', () => {
    axiosClientStub = {
      get: sinon.stub()
        .onFirstCall().resolves({ data: apiResponse.pageOne })
        .onSecondCall().resolves({ data: apiResponse.pageTwo })
        .onThirdCall().resolves({ data: apiResponse.pageThree }),
      defaults: { params: {} }
    };
    sinon.stub(utils, 'createAxiosClient').returns(axiosClientStub);

    redisClientStub = {
      setAsync: sinon.stub().resolves(),
      quitAsync: sinon.stub().resolves()
    };
    sinon.stub(cacheUtils, 'createRedisClient').returns(redisClientStub);
  });
  afterEach('restore utility methods', () => {
    utils.createAxiosClient.restore();
    cacheUtils.createRedisClient.restore();
  });

  it('creates an axios client from params', () => {
    cacher(config);

    utils.createAxiosClient.should.have.been.calledWith(params);
  });

  it('creates a redis client from params', () => {
    cacher(config);

    utils.createRedisClient.should.have.been.calledWith(params);
  });

  it('paginates over organisations', async() => {
    await cacher(config);

    axiosClientStub.get.should.have.been.calledThrice;
  });

  it('writes reduced organisations to cache', async() => {
    await cacher(config);

    redisClientStub.setAsync.should.have.been.calledWith(utils.CACHE_KEY, cacheValue);
  });

  it('quits the Redis connection', async() => {
    await cacher(config);

    redisClientStub.quitAsync.should.have.been.called;
  });
});
