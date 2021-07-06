import * as plugin from '../../../src/plugins/vue-matomo.client';

describe('plugins/vue-matomo.client', () => {
  describe('trackSiteSearch', () => {
    context('when route includes non-empty query', () => {
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses query as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        keyword.should.eq('gothic');
      });
    });

    context('when route includes empty query', () => {
      const route = { query: { query: '' }, name: 'search' };

      it('uses *:* as keyword', () => {
        const keyword = plugin.trackSiteSearch()(route).keyword;

        keyword.should.eq('*:*');
      });
    });

    context('when route is for a collection page', () => {
      const route = { query: { query: 'gothic' }, name: 'collections-type-all___en', params: { type: 'topic', pathMatch: '190-art' } };

      it('uses collection params as category', () => {
        const category = plugin.trackSiteSearch()(route).category;

        category.should.eq('topic 190-art');
      });
    });

    context('when route has no query', () => {
      const route = { query: {}, name: 'home' };

      it('returns `null`', () => {
        const siteSearch = plugin.trackSiteSearch()(route);

        (siteSearch === null).should.be.true;
      });
    });

    context('when store state has search totalResults', () => {
      const store = { state: { search: { totalResults: 9890 } } };
      const route = { query: { query: 'gothic' }, name: 'search' };

      it('uses totalResults for resultsCount', () => {
        const resultsCount = plugin.trackSiteSearch(store)(route).resultsCount;

        resultsCount.should.eq(9890);
      });
    });
  });
});
