import sinon from 'sinon';

import middleware from '@/middleware/l10n';

describe('middleware/legacy', () => {
  afterEach(sinon.resetHistory);

  const app = { $cookies: { set: sinon.spy() } };
  const redirect = sinon.spy();
  const req = {};

  describe('if route path seems to include a locale', () => {
    describe('and that locale is supported', () => {
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

    describe('but that locale is not supported', () => {
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
