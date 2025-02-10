import createCanonicalUrl from '@/utils/url/canonicalUrl.js';

const fixtures = {
  baseUrl: 'https://www.example.org',
  i18n: { locale: 'en' },
  routes: {
    home: {
      path: '/en',
      fullPath: '/en?query=art'
    },
    item: {
      path: '/en/item/123/abc',
      fullPath: '/en/item/123/abc?query=art'
    }
  }
};

describe('@/utils/url/canonicalUrl.js', () => {
  describe('createCanonicalUrl', () => {
    it('returns an object with four variants of canonical URL', () => {
      const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.home };

      const canonicalUrl = createCanonicalUrl(args);

      expect(Object.keys(canonicalUrl)).toEqual([
        'withBothLocaleAndQuery',
        'withNeitherLocaleNorQuery',
        'withOnlyLocale',
        'withOnlyQuery'
      ]);
    });
    describe('withBothLocaleAndQuery', () => {
      it('includes both locale and query for home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.home };

        const withBothLocaleAndQuery = createCanonicalUrl(args).withBothLocaleAndQuery;

        expect(withBothLocaleAndQuery).toBe('https://www.example.org/en?query=art');
      });

      it('includes both locale and query for non-home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.item };

        const withBothLocaleAndQuery = createCanonicalUrl(args).withBothLocaleAndQuery;

        expect(withBothLocaleAndQuery).toBe('https://www.example.org/en/item/123/abc?query=art');
      });
    });

    describe('withOnlyQuery', () => {
      it('includes only query for home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.home };

        const withOnlyQuery = createCanonicalUrl(args).withOnlyQuery;

        expect(withOnlyQuery).toBe('https://www.example.org/?query=art');
      });

      it('includes only query for non-home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.item };

        const withOnlyQuery = createCanonicalUrl(args).withOnlyQuery;

        expect(withOnlyQuery).toBe('https://www.example.org/item/123/abc?query=art');
      });
    });

    describe('withOnlyLocale', () => {
      it('includes only locale for home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.home };

        const withOnlyLocale = createCanonicalUrl(args).withOnlyLocale;

        expect(withOnlyLocale).toBe('https://www.example.org/en');
      });

      it('includes only locale for non-home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.item };

        const withOnlyLocale = createCanonicalUrl(args).withOnlyLocale;

        expect(withOnlyLocale).toBe('https://www.example.org/en/item/123/abc');
      });
    });

    describe('withNeitherLocaleNorQuery', () => {
      it('includes neither locale nor query for home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.home };

        const withNeitherLocaleNorQuery = createCanonicalUrl(args).withNeitherLocaleNorQuery;

        expect(withNeitherLocaleNorQuery).toBe('https://www.example.org/');
      });

      it('includes neither locale nor query for non-home page', () => {
        const args = { baseUrl: fixtures.baseUrl, i18n: fixtures.i18n, route: fixtures.routes.item };

        const withNeitherLocaleNorQuery = createCanonicalUrl(args).withNeitherLocaleNorQuery;

        expect(withNeitherLocaleNorQuery).toBe('https://www.example.org/item/123/abc');
      });
    });
  });
});
