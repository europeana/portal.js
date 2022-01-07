import store from '@/modules/http/templates/store';

describe('http/store', () => {
  describe('getters', () => {
    describe('canonicalUrlWithoutLocale()', () => {
      describe('when `canonicalUrl` has two-letter locale', () => {
        const state = {};
        const getters = { canonicalUrl: 'http://www.example.org/en/about-us' };

        it('is removed', () => {
          expect(store.getters.canonicalUrlWithoutLocale(state, getters)).toBe('http://www.example.org/about-us');
        });
      });

      describe('when `canonicalUrl` has no locale', () => {
        const state = {};
        const getters = { canonicalUrl: 'http://www.example.org/about-us' };

        it('is returned as-is', () => {
          expect(store.getters.canonicalUrlWithoutLocale(state, getters)).toBe('http://www.example.org/about-us');
        });
      });
    });
  });
});
