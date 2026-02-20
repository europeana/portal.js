import sinon from 'sinon';

import middleware from './cache-control.js';

describe('cache-control middleware', () => {
  afterEach(sinon.resetHistory);

  describe('default export', () => {
    it('sets cache-control from app config, default scope', () => {
      const ctx = {
        $config: { app: { cacheControl: { default: 'no-cache' } } },
        $features: { cacheControl: true },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
      };

      middleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-cache')).toBe(true);
    });

    it('favours auth scope cache-control from app config if logged in', () => {
      const ctx = {
        $auth: { loggedIn: true },
        $config: { app: { cacheControl: { default: 'no-cache', auth: 'no-store' } } },
        $features: { cacheControl: true },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
      };

      middleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
    });
  });
});
