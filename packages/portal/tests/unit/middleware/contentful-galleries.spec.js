import sinon from 'sinon';

import middleware from '@/middleware/contentful-galleries';

describe('middleware/contentful-galleries', () => {
  afterEach(sinon.resetHistory);

  const redirect = sinon.spy();
  const error = sinon.spy();

  describe('when set galleries are enabled', () => {
    const app = { $features: { setGalleries: true } };

    describe('when route path is for migrated gallery', () => {
      const route = { path: '/en/galleries/yellow' };

      it('redirects to path with numeric Set ID', () => {
        middleware({ route, redirect, error, app });

        expect(redirect.calledWith('/en/galleries/9280-yellow')).toBe(true);
      });
    });

    describe('when route path is for gallery skipped for migration', () => {
      const route = { path: '/en/galleries/postcards' };

      it('issues a 410 error', () => {
        middleware({ route, redirect, error, app });

        expect(error.calledWith(sinon.match.has('status', 410))).toBe(true);
      });
    });

    describe('when route path is not for known gallery', () => {
      const route = { path: '/en/galleries/i-dont-think-so' };

      it('does not redirect', () => {
        middleware({ route, redirect, error, app });

        expect(redirect.called).toBe(false);
      });
    });
  });

  describe('when set galleries are disabled', () => {
    const app = { $features: { setGalleries: false } };
    const route = { path: '/en/galleries/yellow' };

    it('does not redirect', () => {
      middleware({ route, redirect, error, app });

      expect(redirect.called).toBe(false);
    });
  });
});
