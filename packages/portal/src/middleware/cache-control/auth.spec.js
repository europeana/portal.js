import sinon from 'sinon';

import authCacheControlMiddleware from './auth.js';

describe('cache-control middleware - auth', () => {
  describe('setCacheControl', () => {
    describe('when not logged-in', () => {
      it('does nothing', () => {
        const ctx = {
          $auth: { loggedIn: false },
          $config: { app: { cacheControl: { auth: 'no-store', enabled: true } } },
          res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
        };

        authCacheControlMiddleware(ctx);

        expect(ctx.res.removeHeader.called).toBe(false);
        expect(ctx.res.setHeader.called).toBe(false);
      });
    });

    describe('when logged-in', () => {
      it('replaces cache-control header with auth config setting', () => {
        const ctx = {
          $auth: { loggedIn: true },
          $config: { app: { cacheControl: { auth: 'no-store', enabled: true } } },
          res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
        };

        authCacheControlMiddleware(ctx);

        expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
        expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
      });
    });
  });
});
