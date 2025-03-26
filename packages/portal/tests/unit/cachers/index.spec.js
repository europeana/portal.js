import sinon from 'sinon';

import * as cacherUtils from '@/cachers/utils.js';
import * as cachers from '@/cachers/index.js';
import * as recentItemsCacher from '@/cachers/items/recent.js';

let consoleErrorStub;
let consoleLogStub;
let processExitStub;

const redisClientStub = {
  connect: sinon.stub().resolves(),
  disconnect: sinon.stub().resolves(),
  get: sinon.stub().resolves('cached'),
  set: sinon.stub().resolves()
};

const recentItemsData = [
  { id: '/abc/123' },
  { id: '/def/123' },
  { id: '/ghi/123' },
  { id: '/jkl/123' }
];

describe('@/cachers/index', () => {
  beforeAll(() => {
    consoleErrorStub = sinon.stub(console, 'error');
    consoleLogStub = sinon.stub(console, 'log');
    processExitStub = sinon.stub(process, 'exit');

    sinon.stub(recentItemsCacher, 'data').resolves(recentItemsData);
    sinon.stub(cacherUtils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach(sinon.resetHistory);

  afterAll(() => {
    sinon.restore();
  });

  describe('run', () => {
    describe('get', () => {
      it('reads and returns the cached data', async() => {
        const response = await cachers.run('get', 'items:recent');

        expect(redisClientStub.get.calledWith('@europeana:portal.js:items:recent')).toBe(true);
        expect(response).toBe('cached');
      });
    });

    describe('set', () => {
      it('generates and caches data', async() => {
        await cachers.run('set', 'items:recent');

        expect(redisClientStub.set.calledWith(
          '@europeana:portal.js:items:recent', JSON.stringify(recentItemsData)
        )).toBe(true);
      });
    });

    describe('unknown command', () => {
      it('throws an error', async() => {
        await expect(async() => await cachers.run('unknown', 'command'))
          .rejects.toThrow('Unknown command "unknown"');
      });
    });
  });

  describe('cli', () => {
    describe('on success', () => {
      it('logs message to console', async() => {
        await cachers.cli('get', 'items:recent');

        expect(consoleLogStub.calledWith('cached')).toBe(true);
      });

      it('exits with code 0', async() => {
        await cachers.cli('get', 'items:recent');

        expect(processExitStub.calledWith(0)).toBe(true);
      });
    });

    describe('on failure', () => {
      it('logs error to console', async() => {
        await cachers.cli('unknown', 'command');

        expect(consoleErrorStub.calledWith('ERROR: Unknown command "unknown"')).toBe(true);
      });

      it('exits with code 1', async() => {
        await cachers.cli('unknown', 'command');

        expect(processExitStub.calledWith(1)).toBe(true);
      });
    });
  });
});
