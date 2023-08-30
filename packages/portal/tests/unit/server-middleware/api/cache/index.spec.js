import sinon from 'sinon';

import serverMiddleware from '@/server-middleware/api/cache/index.js';
import * as cacheUtils from '@/cachers/utils.js';

const expressResStub = {
  set: sinon.stub(),
  send: sinon.stub()
};

const config = { url: 'redis://localhost:6379' };

const id = 'items';
const cached = JSON.stringify([
  { id: '1' },
  { id: '2' }
]);
const expressReq = { params: [id], query: {} };

const redisClientStub = {
  getAsync: sinon.stub().resolves(cached),
  quitAsync: sinon.stub()
};

describe('server-middleware/api/cache/index', () => {
  beforeEach(() => {
    sinon.stub(cacheUtils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach(() => {
    cacheUtils.createRedisClient.restore();
  });

  it('fetches from the cache, with app namespace', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(redisClientStub.getAsync.calledWith(`@europeana:portal.js:${id}`)).toBe(true);
  });

  it('responds with JSON', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(expressResStub.set.calledWith('Content-Type', 'application/json')).toBe(true);
    expect(expressResStub.send.calledWith({ [id]: JSON.parse(cached) })).toBe(true);
  });

  it('quits the Redis connection', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(redisClientStub.quitAsync.called).toBe(true);
  });
});
