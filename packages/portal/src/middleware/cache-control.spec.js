import sinon from 'sinon';

import middleware, { createCacheControlMiddleware } from './cache-control.js';

describe('cache-control middleware', () => {
  afterEach(sinon.resetHistory);

  describe('default scope', () => {
    describe('when not enabled', () => {
      it('does nothing', () => {
        const ctx = {
          $config: { app: { cacheControl: { enabled: false, default: 'no-cache' } } },
          res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
        };

        middleware(ctx);

        expect(ctx.res.removeHeader.called).toBe(false);
        expect(ctx.res.setHeader.called).toBe(false);
      });
    });

    describe('when enabled', () => {
      describe('when no header value configured', () => {
        it('just removes cache-control header', () => {
          const ctx = {
            $config: { app: { cacheControl: { enabled: true, default: '' } } },
            res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
          };

          middleware(ctx);

          expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
          expect(ctx.res.setHeader.called).toBe(false);
        });
      });

      describe('when header value configured', () => {
        it('sets cache-control from app config, default scope', () => {
          const ctx = {
            $config: { app: { cacheControl: { enabled: true, default: 'no-cache' } } },
            res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
          };

          middleware(ctx);

          expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
          expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-cache')).toBe(true);
        });

        describe('when logged-in', () => {
          it('favours auth scope cache-control from app config', () => {
            const ctx = {
              $auth: { loggedIn: true },
              $config: { app: { cacheControl: { enabled: true, default: 'no-cache', auth: 'no-store' } } },
              res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
            };

            middleware(ctx);

            expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
            expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
          });
        });
      });
    });
  });

  describe('custom scope', () => {
    it('uses scope config', () => {
      const scope = 'item';
      const ctx = {
        $config: { app: { cacheControl: { enabled: true, default: 'no-cache', item: 'public' } } },
        res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
      };

      const scopedMiddleware = createCacheControlMiddleware(scope);
      scopedMiddleware(ctx);

      expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
      expect(ctx.res.setHeader.calledWith('Cache-Control', 'public')).toBe(true);
    });
  });
});
