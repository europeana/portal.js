import sinon from 'sinon';

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
    sinon.stub(utils, 'createRedisClient').returns(redisClientStub);
  });
  afterEach('restore utility methods', () => {
    utils.createAxiosClient.restore();
    utils.createRedisClient.restore();
  });

  it('creates an axios client from params', () => {
    const params = {
      europeanaEntityApiKey: 'MY_KEY'
    };

    cacher(params);

    utils.createAxiosClient.should.have.been.calledWith(params);
  });

  it('creates a redis client from params', () => {
    const params = {
      redisUrl: 'redis://localhost:6370/0'
    };

    cacher(params);

    utils.createRedisClient.should.have.been.calledWith(params);
  });

  it('paginates over organisations', async() => {
    await cacher();

    axiosClientStub.get.should.have.been.calledThrice;
  });

  it('writes reduced organisations to cache', async() => {
    await cacher();

    redisClientStub.setAsync.should.have.been.calledWith(utils.CACHE_KEY, cacheValue);
  });

  it('quits the Redis connection', async() => {
    await cacher();

    redisClientStub.quitAsync.should.have.been.called;
  });
});
