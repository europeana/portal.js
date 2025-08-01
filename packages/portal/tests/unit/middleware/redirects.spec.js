import sinon from 'sinon';

import middleware from '@/middleware/redirects';

describe('middleware/redirects', () => {
  afterEach(sinon.resetHistory);
  const redirect = sinon.spy();

  it('redirects /professionals to /share-your-collections', () => {
    const route = { path: '/fr/professionals' };

    middleware({ route, redirect });

    expect(redirect.calledWith('/fr/share-your-collections')).toBe(true);
  });

  it('redirects /blog to /stories', () => {
    const route = { path: '/de/blog' };

    middleware({ route, redirect });

    expect(redirect.calledWith('/de/stories?type=story')).toBe(true);
  });

  it('redirects /blog/* to /stories/*', () => {
    const route = { path: '/nl/blog/nice' };

    middleware({ route, redirect });

    expect(redirect.calledWith('/nl/stories/nice')).toBe(true);
  });

  it('redirects /exhibitions to /stories?type=exhibition', () => {
    const route = { path: '/es/exhibitions' };

    middleware({ route, redirect });

    expect(redirect.calledWith('/es/stories?type=exhibition')).toBe(true);
  });

  it('redirects /rights/public-domain-charter to https://pro.europeana.eu/post/the-europeana-public-domain-charter', () => {
    const route = { path: '/en/rights/public-domain-charter' };

    middleware({ route, redirect });

    expect(redirect.calledWith('https://pro.europeana.eu/post/the-europeana-public-domain-charter')).toBe(true);
  });

  describe('when route path does not match a redirect', () => {
    const route = { path: '/en/collections' };

    it('does not redirect', () => {
      middleware({ route, redirect });

      expect(redirect.called).toBe(false);
    });
  });
});
