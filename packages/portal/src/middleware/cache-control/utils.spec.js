import sinon from 'sinon';

import { setCacheControl } from './utils.js';

describe('cache-control middleware - utils', () => {
  describe('setCacheControl', () => {
    describe('when not enabled', () => {
      it('does nothing', () => {
        const ctx = {
          $config: { app: { cacheControl: { enabled: false } } },
          res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
        };

        setCacheControl(ctx, () => true);

        expect(ctx.res.removeHeader.called).toBe(false);
        expect(ctx.res.setHeader.called).toBe(false);
      });
    });

    describe('when enabled', () => {
      it('calls callback with config from context', () => {
        const ctx = {
          $config: { app: { cacheControl: { enabled: true } } },
          res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
        };
        const callback = sinon.stub().returns(true);

        setCacheControl(ctx, callback);

        expect(callback.calledWith({ enabled: true })).toBe(true);
      });

      describe('but callback returns falsy value', () => {
        it('does nothing', () => {
          const ctx = {
            $config: { app: { cacheControl: { enabled: true } } },
            res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
          };

          setCacheControl(ctx, () => false);

          expect(ctx.res.removeHeader.called).toBe(false);
          expect(ctx.res.setHeader.called).toBe(false);
        });
      });

      describe('and callback returns truthy value', () => {
        it('replaces cache-control header with callback response', () => {
          const ctx = {
            $config: { app: { cacheControl: { enabled: true } } },
            res: { removeHeader: sinon.spy(), setHeader: sinon.spy() }
          };

          setCacheControl(ctx, () => 'no-store');

          expect(ctx.res.removeHeader.calledWith('Cache-Control')).toBe(true);
          expect(ctx.res.setHeader.calledWith('Cache-Control', 'no-store')).toBe(true);
        });
      });
    });
  });
});
