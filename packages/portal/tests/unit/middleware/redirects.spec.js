import sinon from 'sinon';

import middleware from '@/middleware/redirects';

describe('middleware/redirects', () => {
  const redirect = sinon.spy();

  describe('when route path is for /professionals', () => {
    const route = { path: '/fr/professionals' };

    it('redirects to /share-your-data', () => {
      middleware({ route, redirect });

      expect(redirect.calledWith('/fr/share-your-data')).toBe(true);
    });
  });
});
