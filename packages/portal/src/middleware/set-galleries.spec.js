import sinon from 'sinon';

import middleware from '@/middleware/set-galleries';

describe('middleware/set-galleries', () => {
  afterEach(sinon.resetHistory);

  const redirect = sinon.spy();

  describe('when route path is for /set/ gallery', () => {
    const route = { path: '/en/set/123' };

    it('redirects to /galleries/ path', () => {
      middleware({ route, redirect });

      expect(redirect.calledWith('/en/galleries/123')).toBe(true);
    });
  });

  describe('when route path is not for /set/ gallery', () => {
    const route = { path: '/en/galleries/123' };

    it('does not redirect', () => {
      middleware({ route, redirect });

      expect(redirect.called).toBe(false);
    });
  });
});
