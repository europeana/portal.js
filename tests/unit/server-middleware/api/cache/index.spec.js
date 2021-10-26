import sinon from 'sinon';

import serverMiddleware from '@/server-middleware/api/cache/index.js';
import * as dailyEntries from '@/server-middleware/api/cache/daily.js';
import * as localise from '@/server-middleware/api/cache/localise.js';
import * as cacheUtils from '@/cachers/utils.js';

const expressResStub = {
  json: sinon.stub(),
  status: sinon.stub()
};

const config = { redis: { url: 'redis://localhost:6379' } };

const id = 'items';
const cached = [
  { id: '1' },
  { id: '2' }
];

const redisClientStub = {
  getAsync: sinon.stub().resolves(JSON.stringify(cached)),
  quitAsync: sinon.stub()
};

describe('server-middleware/api/cache/index', () => {
  beforeEach('stub utils', () => {
    sinon.stub(dailyEntries, 'default').returnsArg(0);
    sinon.stub(localise, 'default').returnsArg(0);
    sinon.stub(cacheUtils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach('restore stubs', () => {
    dailyEntries.default.restore();
    localise.default.restore();
    cacheUtils.createRedisClient.restore();
  });

  it('fetches from the cache, with app namespace', async() => {
    await serverMiddleware(id, config)({ query: {} }, expressResStub);

    redisClientStub.getAsync.should.have.been.calledWith(`@europeana:portal.js:${id}`);
  });

  it('optionally localises data', async() => {
    await serverMiddleware(id, config)({ query: { locale: 'fr' } }, expressResStub);

    localise.default.should.have.been.calledWith(cached, 'fr');
  });

  it('optionally filters data to daily selections', async() => {
    await serverMiddleware(id, config)({ query: { daily: 'true' } }, expressResStub);

    dailyEntries.default.should.have.been.calledWith(cached);
  });

  it('responds with JSON', async() => {
    await serverMiddleware(id, config)({ query: {} }, expressResStub);

    expressResStub.json.should.have.been.calledWith(cached);
  });

  it('quits the Redis connection', async() => {
    await serverMiddleware(id, config)({ query: {} }, expressResStub);

    redisClientStub.quitAsync.should.have.been.called;
  });
});
