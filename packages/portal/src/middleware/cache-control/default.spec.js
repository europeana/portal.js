import sinon from 'sinon';

import defaultCacheControlMiddleware from './default.js';

describe('cache-control middleware - default', () => {
  describe('setCacheControl', () => {
    it('replaces cache-control header with default config setting', () => {
      const ctx = {
        $config: { app: { cacheControl: { default: 'no-store', enabled: true } } },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
      };

      defaultCacheControlMiddleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
    });
  });
});
