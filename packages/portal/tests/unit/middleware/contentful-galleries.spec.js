import sinon from 'sinon';

import middleware from '@/middleware/contentful-galleries';

describe('middleware/contentful-galleries', () => {
  afterEach(sinon.resetHistory);

  const redirect = sinon.spy();

  describe('when route path is for migrated gallery', () => {
    const route = { path: '/en/galleries/yellow' };

    it('redirects to path with numeric Set ID', () => {
      middleware({ route, redirect });

      expect(redirect.calledWith('/en/galleries/8379-yellow')).toBe(true);
    });
  });

  describe('when route path is not for migrated gallery', () => {
    const route = { path: '/en/galleries/i-dont-think-so' };

    it('does not redirects', () => {
      middleware({ route, redirect });

      expect(redirect.called).toBe(false);
    });
  });
});
