import * as plugin from '@/plugins/vue-matomo.client';

describe('plugins/vue-matomo.client', () => {
  describe('trackSiteSearch', () => {
    describe('when route includes non-empty query', () => {
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses query as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        expect(keyword).toBe('gothic');
      });
    });

    describe('when route includes empty query', () => {
      const route = { query: { query: '' }, name: 'search' };

      it('uses *:* as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        expect(keyword).toBe('*:*');
      });
    });

    describe('when route is for a collection page', () => {
      const route = { query: { query: 'gothic' }, name: 'collections-type-all___en', params: { type: 'topic', pathMatch: '190-art' } };

      it('uses collection params as category', () => {
        const category = plugin.trackSiteSearch()(route).category;

        expect(category).toBe('topic 190-art');
      });
    });

    describe('when route has no query', () => {
      const route = { query: {}, name: 'home' };

      it('returns `null`', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        expect(siteSearch === null).toBe(true);
      });
    });

    describe('when store state has search totalResults', () => {
      const store = { state: { search: { totalResults: 9890 } } };
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses totalResults for resultsCount', () => {
        const resultsCount = plugin.trackSiteSearch(store)(route).resultsCount;

        expect(resultsCount).toBe(9890);
      });
    });
  });
});
