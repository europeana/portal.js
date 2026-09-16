import sinon from 'sinon';

import initCookiesPlugin from '@/plugins/cookies.js';

describe('@/plugins/cookies.js', () => {
  afterEach(() => {
    sinon.resetHistory();
    delete document.cookie;
  });
  afterAll(() => {
    sinon.restore();
  });

  it('is injected as "cookies"', () => {
    const inject = sinon.spy();

    initCookiesPlugin(null, inject);

    expect(inject.calledWith('cookies', sinon.match.hasOwn('get').and(sinon.match.hasOwn('set')))).toBe(true);
  });

  describe('get', () => {
    describe('when context contains req object', () => {
      const ctx = { req: { headers: { cookie: 'i18n_locale_code=en; auth.strategy=keycloak' } } };
      document.cookie = 'i18n_locale_code=de; auth.strategy=keycloak';

      it('gets the named cookie from the req headers', () => {
        let cookiesPlugin;
        const inject = ((id, plugin) => cookiesPlugin = plugin);
        initCookiesPlugin(ctx, inject);

        const cookieValue = cookiesPlugin.get('i18n_locale_code');

        expect(cookieValue).toBe('en');
      });
    });

    describe('when context does not contain req object', () => {
      const ctx = {};
      document.cookie = 'i18n_locale_code=de; auth.strategy=keycloak';

      it('gets the named cookie from the document cookie property', () => {
        let cookiesPlugin;
        const inject = ((id, plugin) => cookiesPlugin = plugin);
        initCookiesPlugin(ctx, inject);

        const cookieValue = cookiesPlugin.get('i18n_locale_code');

        expect(cookieValue).toBe('de');
      });
    });
  });

  describe('set', () => {
    describe('when context contains res object', () => {
      const getHeaderStub = sinon.stub().withArgs('set-cookie').returns('i18n_locale_code=en');
      const setHeaderSpy = sinon.spy();
      const ctx = { res: { getHeader: getHeaderStub, setHeader: setHeaderSpy } };

      it('adds the cookie to the "set-cookie" response header, defaulting path to "/"', () => {
        let cookiesPlugin;
        const inject = ((id, plugin) => cookiesPlugin = plugin);
        initCookiesPlugin(ctx, inject);

        cookiesPlugin.set('auth.strategy', 'keycloak');

        expect(setHeaderSpy.calledWith('set-cookie', ['i18n_locale_code=en', 'auth.strategy=keycloak; Path=/'])).toBe(true);
      });
    });

    describe('when context does not contain res object', () => {
      const ctx = {};
      document.cookie = 'i18n_locale_code=de';

      it('adds the cookie to the document cookie property', () => {
        let cookiesPlugin;
        const inject = ((id, plugin) => cookiesPlugin = plugin);
        initCookiesPlugin(ctx, inject);

        cookiesPlugin.set('auth.strategy', 'keycloak');

        expect(document.cookie).toBe('i18n_locale_code=de; auth.strategy=keycloak');
      });
    });
  });
});
