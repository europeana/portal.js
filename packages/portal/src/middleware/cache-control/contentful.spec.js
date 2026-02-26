import sinon from 'sinon';

import contentfulCacheControlMiddleware from './contentful.js';

describe('cache-control middleware - contentful', () => {
  describe('setCacheControl', () => {
    it('replaces cache-control header with contentful config setting', () => {
      const ctx = {
        $config: { app: { cacheControl: { contentful: 'no-store', enabled: true } } },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
      };

      contentfulCacheControlMiddleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
    });
  });
});
