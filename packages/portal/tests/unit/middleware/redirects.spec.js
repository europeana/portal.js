import sinon from 'sinon';

import middleware from '@/middleware/redirects';

describe('middleware/redirects', () => {
  afterEach(sinon.resetHistory);
  const redirect = sinon.spy();

  it('redirects /professionals to /share-your-data', () => {
    const route = { path: '/fr/professionals' };

    middleware({ route, redirect });

    expect(redirect.calledWith('/fr/share-your-data')).toBe(true);
  });

  describe('when redirectBlogsToStories feature is enabled', () => {
    const $features = { redirectBlogsToStories: true };

    it('redirects /blog to /stories', () => {
      const route = { path: '/de/blog' };

      middleware({ route, redirect, $features });

      expect(redirect.calledWith('/de/stories')).toBe(true);
    });

    it('redirects /blog/* to /stories/*', () => {
      const route = { path: '/nl/blog/nice' };

      middleware({ route, redirect, $features });

      expect(redirect.calledWith('/nl/stories/nice')).toBe(true);
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
