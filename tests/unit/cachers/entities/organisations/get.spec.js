import sinon from 'sinon';

const cacheUtils = require('@/cachers/utils');
const cacher = require('@/cachers/entities/organisations/get');

let redisClientStub;
const cacheValue = '{}';

describe('cachers/entities/organisations/get', () => {
  before('stub utils.createRedisClient', () => {
    redisClientStub = {
      getAsync: sinon.stub().resolves(cacheValue),
      quitAsync: sinon.stub().resolves()
    };
    sinon.stub(cacheUtils, 'createRedisClient').returns(redisClientStub);
  });
  after('restore utils.createRedisClient', () => {
    cacheUtils.createRedisClient.restore();
  });

  const config = {
    redis: {
      url: 'redis://localhost:6370/0'
    }
  };

  it('creates a redis client from params', () => {
    cacher(config);

    utils.createRedisClient.should.have.been.calledWith(params);
  });

  it('fetches organisations from the cache', () => {
    cacher(config);

    redisClientStub.getAsync.should.have.been.calledWith(utils.CACHE_KEY);
  });

  it('quits the Redis connection', async() => {
    await cacher(config);

    redisClientStub.quitAsync.should.have.been.called;
  });

  it('resolves to object with parsed cache value in body', async() => {
    const response = await cacher(config);

    response.should.eql({ body: JSON.parse(cacheValue) });
  });
});
