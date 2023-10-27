import sinon from 'sinon';

import middleware from '@/middleware/redirects';

describe('middleware/redirects', () => {
  afterEach(sinon.resetHistory);
  const redirect = sinon.spy();

  describe('when route path matches a redirect', () => {
    const route = { path: '/fr/professionals' };

    it('redirects to /share-your-data', () => {
      middleware({ route, redirect });

      expect(redirect.calledWith('/fr/share-your-data')).toBe(true);
    });
  });

  describe('when route path does not match a redirect', () => {
    const route = { path: '/en/collections' };

    it('does not redirect', () => {
      middleware({ route, redirect });

      expect(redirect.called).toBe(false);
    });
  });
});
