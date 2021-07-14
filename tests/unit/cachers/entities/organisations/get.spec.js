import sinon from 'sinon';

const utils = require('@/cachers/entities/organisations/utils');
const cacher = require('@/cachers/entities/organisations/get');

let redisClientStub;
const cacheValue = '{}';

describe('cachers/entities/organisations/get', () => {
  before('stub utils.createRedisClient', () => {
    redisClientStub = {
      getAsync: sinon.stub().resolves(cacheValue),
      quitAsync: sinon.stub().resolves()
    };
    sinon.stub(utils, 'createRedisClient').returns(redisClientStub);
  });
  after('restore utils.createRedisClient', () => {
    utils.createRedisClient.restore();
  });

  it('creates a redis client from params', () => {
    const params = {
      redisUrl: 'redis://localhost:6370/0'
    };

    cacher(params);

    utils.createRedisClient.should.have.been.calledWith(params);
  });

  it('fetches organisations from the cache', () => {
    cacher();

    redisClientStub.getAsync.should.have.been.calledWith(utils.CACHE_KEY);
  });

  it('quits the Redis connection', async() => {
    await cacher();

    redisClientStub.quitAsync.should.have.been.called;
  });

  it('resolves to object with parsed cache value in body', async() => {
    const response = await cacher();

    response.should.eql({ body: JSON.parse(cacheValue) });
  });
});
