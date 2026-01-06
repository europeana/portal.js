import * as redis from 'redis';
import sinon from 'sinon';

import serverMiddleware from '@/server-middleware/api/cache/index.js';

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

let redisClientStub;

describe('server-middleware/api/cache/index', () => {
  beforeAll(() => {
    redisClientStub = {
      connect: sinon.spy(),
      on: sinon.spy(),
      get: sinon.stub().resolves(cached),
      set: sinon.spy(),
      disconnect: sinon.spy()
    };

    sinon.stub(redis, 'createClient').returns(redisClientStub);
  });
  afterAll(() => {
    redis.createClient.restore();
  });

  it('fetches from the cache, with app namespace', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(redisClientStub.get.calledWith(`@europeana:portal.js:${id}`)).toBe(true);
  });

  it('responds with JSON', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(expressResStub.set.calledWith('Content-Type', 'application/json')).toBe(true);
    expect(expressResStub.send.calledWith({ [id]: JSON.parse(cached) })).toBe(true);
  });

  it('quits the Redis connection', async() => {
    await serverMiddleware(config)(expressReq, expressResStub);

    expect(redisClientStub.disconnect.called).toBe(true);
  });
});
