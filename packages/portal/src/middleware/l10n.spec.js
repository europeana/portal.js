import sinon from 'sinon';

import middleware from '@/middleware/l10n';

describe('middleware/l10n', () => {
  afterEach(sinon.resetHistory);

  const app = { $cookies: { get: sinon.spy(), set: sinon.spy() } };
  const redirect = sinon.spy();
  const req = {};

  describe('if route path should be ignored for l10n', () => {
    describe('because it is an auth callback', () => {
      const route = { path: '/account/callback' };

      it('is is not stored in the cookie', () => {
        middleware({ app, route, redirect, req });

        expect(app.$cookies.set.called).toBe(false);
      });

      it('does not redirect', () => {
        middleware({ app, route, redirect, req });

        expect(redirect.called).toBe(false);
      });
    });
  });

  describe('if route path seems to include a locale', () => {
    describe('and that locale is supported', () => {
      describe('and it is the root path for that locale', () => {
        const route = { path: '/de' };

        it('is stored in the cookie', () => {
          middleware({ app, route, redirect, req });

          expect(app.$cookies.set.calledWith('i18n_locale_code', 'de')).toBe(true);
        });

        it('does not redirect', () => {
          middleware({ app, route, redirect, req });

          expect(redirect.called).toBe(false);
        });
      });

      describe('and it is a sub- path for that locale', () => {
        const route = { path: '/en/item/123/abc' };

        it('is stored in the cookie', () => {
          middleware({ app, route, redirect, req });

          expect(app.$cookies.set.calledWith('i18n_locale_code', 'en')).toBe(true);
        });

        it('does not redirect', () => {
          middleware({ app, route, redirect, req });

          expect(redirect.called).toBe(false);
        });
      });
    });

    describe('but that locale is not supported', () => {
      describe('and it is the root path for that locale', () => {
        const route = { path: '/ja' };

        it('is is not stored in the cookie', () => {
          middleware({ app, route, redirect, req });

          expect(app.$cookies.set.called).toBe(false);
        });

        it('redirects to path without locale', () => {
          middleware({ app, route, redirect, req });

          expect(redirect.calledWith(sinon.match.has('path', '/'))).toBe(true);
        });
      });

      describe('and it is a sub- path for that locale', () => {
        const route = { path: '/ja/item/123/abc' };

        it('is is not stored in the cookie', () => {
          middleware({ app, route, redirect, req });

          expect(app.$cookies.set.called).toBe(false);
        });

        it('redirects to path without locale', () => {
          middleware({ app, route, redirect, req });

          expect(redirect.calledWith(sinon.match.has('path', '/item/123/abc'))).toBe(true);
        });
      });
    });
  });
});
