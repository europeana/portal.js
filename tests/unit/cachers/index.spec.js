import sinon from 'sinon';

import * as cacherUtils from '@/cachers/utils.js';
import * as recentItemsCacher from '@/cachers/items/recent.js';
import * as cachers from '@/cachers/index.js';

let createRedisClientStub;

describe('@/cachers/index', () => {
  beforeAll(() => {
    const redisClientStub = {
      getAsync: sinon.stub().resolves('cached'),
      quitAsync: sinon.stub().resolves(),
      setAsync: sinon.stub().resolves()
    };
    createRedisClientStub = sinon.stub(cacherUtils, 'createRedisClient').returns(redisClientStub);
  });

  afterEach(sinon.resetHistory);

  afterAll(() => {
    sinon.restore();
  });

  describe('cli', () => {
    let consoleErrorStub;
    let consoleLogStub;
    let processExitStub;

    beforeAll(() => {
      consoleErrorStub = sinon.stub(console, 'error');
      consoleLogStub = sinon.stub(console, 'log');
      processExitStub = sinon.stub(process, 'exit');
    });

    afterAll(() => {
      consoleErrorStub.restore();
      consoleLogStub.restore();
      processExitStub.restore();
    });

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

        expect(consoleErrorStub.calledWith('Unknown command "unknown"')).toBe(true);
      });

      it('exits with code 1', async() => {
        await cachers.cli('unknown', 'command');

        expect(processExitStub.calledWith(1)).toBe(true);
      });
    });
  });
});
