import sinon from 'sinon';

import routeCacheControlMiddleware from './route.js';

describe('cache-control middleware - route', () => {
  describe('setCacheControl', () => {
    it('replaces cache-control header with route-specific config setting', () => {
      const ctx = {
        $config: { app: { cacheControl: { enabled: true, route: { itemAll: 'public' } } } },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() },
        route: { name: 'item-all___en' }
      };

      routeCacheControlMiddleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'public')).toBe(true);
    });
  });
});
